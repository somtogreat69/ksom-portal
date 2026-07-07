import express, { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Pool } from 'pg';

const router = express.Router();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

// --- AUTHENTICATION MIDDLEWARE ---
export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.cookies.token;
    if (!token) {
        res.status(401).json({ success: false, message: 'Unauthorized. Please log in.' });
        return;
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        (req as any).user = decoded; // Attach user payload (student_id) to request
        next();
    } catch (err) {
        res.status(403).json({ success: false, message: 'Invalid or expired session. Please log in again.' });
    }
};

// --- SIGNUP ROUTE ---
router.post('/signup', async (req: Request, res: Response): Promise<void> => {
    const { full_name, email, password } = req.body;
    
    if (!full_name || !email || !password) {
        res.status(400).json({ success: false, message: 'All fields are required.' });
        return;
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            `INSERT INTO students (full_name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, full_name, email`,
            [full_name, email, hashedPassword]
        );
        
        const user = result.rows[0];
        
        // Generate Token
        const token = jwt.sign({ student_id: user.id }, JWT_SECRET, { expiresIn: '12h' });
        
        // Set HTTP-Only Cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 12 * 60 * 60 * 1000 // 12 hours
        });

        res.status(201).json({ success: true, user: { id: user.id, name: user.full_name } });
    } catch (error: any) {
        if (error.code === '23505') { // Unique violation
            res.status(409).json({ success: false, message: 'Email is already registered.' });
        } else {
            res.status(500).json({ success: false, message: 'Server error during signup.' });
        }
    }
});

// --- LOGIN ROUTE ---
router.post('/login', async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    try {
        const result = await pool.query(`SELECT * FROM students WHERE email = $1`, [email]);
        const user = result.rows[0];

        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            res.status(401).json({ success: false, message: 'Invalid email or password.' });
            return;
        }

        const token = jwt.sign({ student_id: user.id }, JWT_SECRET, { expiresIn: '12h' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 12 * 60 * 60 * 1000
        });

        res.status(200).json({ success: true, user: { id: user.id, name: user.full_name } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error during login.' });
    }
});

// --- LOGOUT ROUTE ---
router.post('/logout', (req: Request, res: Response) => {
    res.clearCookie('token');
    res.status(200).json({ success: true, message: 'Logged out successfully.' });
});

export default router;