import 'dotenv/config'; // <-- Now it loads first!
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser'; // <-- NEW
import authRouter from './auth';
import attendanceRouter from './attendance';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(cors({ origin: frontendUrl, credentials: true }));
app.use(express.json());
app.use(cookieParser()); // <-- NEW

// Mount the router
app.use('/api/auth', authRouter);
app.use('/api/attendance', attendanceRouter);

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});