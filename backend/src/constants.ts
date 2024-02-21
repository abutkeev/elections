import path from 'path';
import 'dotenv/config';

export const FrontendDir = path.resolve(__dirname, '..', 'frontend');

export const { DB_URI, PORT, JWT_SECRET, TELEGRAM_BOT_TOKEN } = process.env;
