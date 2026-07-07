import express, { Request, Response } from 'express';
import { Pool } from 'pg';
import { requireAuth } from './auth';

const router = express.Router();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// DOAF Headquarters, Kado Express Anchor
const DOAF_ANCHOR = { lat: 9.0820, lng: 7.4892 };
const MAX_RADIUS_METERS = 150;

/**
 * Utility: Compute Haversine Distance
 */
function getDistanceInMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; 
    const toRadians = (deg: number) => deg * (Math.PI / 180);
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

/**
 * Utility: Get Current Date in West Africa Time (WAT) -> 'YYYY-MM-DD'
 */
function getCurrentDateWAT(): string {
    return new Intl.DateTimeFormat('en-CA', { 
        timeZone: 'Africa/Lagos', 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit' 
    }).format(new Date());
}

/**
 * POST /api/attendance/checkin
 */
router.post('/checkin', requireAuth, async (req: Request, res: Response): Promise<void> => {
    // Note: Assuming `req.user.student_id` is populated by prior authentication middleware
    // Hardcoded for testing:
    const student_id = (req as any).user.student_id;
    const { latitude, longitude } = req.body;

    if (!student_id || !latitude || !longitude) {
        res.status(400).json({ success: false, error: 'BAD_REQUEST', message: 'Missing required payload data.' });
        return;
    }

    // 1. Server-Side Geofence Validation
    const distance = getDistanceInMeters(latitude, longitude, DOAF_ANCHOR.lat, DOAF_ANCHOR.lng);
    if (distance > MAX_RADIUS_METERS) {
        res.status(403).json({ 
            success: false, 
            error: 'OUT_OF_BOUNDS', 
            message: 'Attendance blocked. You must be at the DOAF Headquarters in Kado Express to sign in.' 
        });
        return;
    }

    const attendanceDateWAT = getCurrentDateWAT();
    const dateHashLock = parseInt(attendanceDateWAT.replace(/-/g, ''), 10); // e.g., 20260630
    
    const client = await pool.connect();

    try {
        // 2. Transaction Strategy: Serializable + Postgres Advisory Lock
        // This explicitly locks concurrent requests for THIS SPECIFIC DATE, ensuring flawless atomic increments.
        await client.query('BEGIN ISOLATION LEVEL SERIALIZABLE');
        await client.query('SELECT pg_advisory_xact_lock($1)', [dateHashLock]);

        // 3. Duplicate Check
        const dupCheck = await client.query(
            'SELECT sequence_number FROM attendance_records WHERE student_id = $1 AND attendance_date = $2',
            [student_id, attendanceDateWAT]
        );

        if (dupCheck.rows.length > 0) {
            await client.query('ROLLBACK');
            res.status(409).json({ 
                success: false, 
                error: 'ALREADY_CHECKED_IN', 
                sequence_number: dupCheck.rows[0].sequence_number,
                date: attendanceDateWAT,
                message: `You have already marked attendance today. Your number for ${attendanceDateWAT} is: #${dupCheck.rows[0].sequence_number}.`
            });
            return;
        }

        // 4. Sequential Atomic Assignment
        const maxResult = await client.query(
            'SELECT COALESCE(MAX(sequence_number), 0) as max_seq FROM attendance_records WHERE attendance_date = $1',
            [attendanceDateWAT]
        );
        const nextSequence = maxResult.rows[0].max_seq + 1;

        // 5. Commit Record
        await client.query(
            `INSERT INTO attendance_records (student_id, sequence_number, attendance_date) 
             VALUES ($1, $2, $3)`,
            [student_id, nextSequence, attendanceDateWAT]
        );

        await client.query('COMMIT');
        
        res.status(200).json({ 
            success: true, 
            sequence_number: nextSequence, 
            date: attendanceDateWAT 
        });

    } catch (error: any) {
        await client.query('ROLLBACK');
        
        // Handle race-condition DB unique constraint catch (fallback)
        if (error.code === '23505') { 
            res.status(409).json({ success: false, error: 'DB_CONFLICT', message: 'System processing conflict. Please retry.' });
        } else {
            console.error('Check-in Error:', error);
            res.status(500).json({ success: false, error: 'SERVER_ERROR', message: 'An internal server error occurred.' });
        }
    } finally {
        client.release();
    }
});

export default router;