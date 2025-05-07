import cors from 'cors';
import * as dotenv from 'dotenv';
import express, { Application, Request, Response } from "express";
import rateLimit from 'express-rate-limit';
import http from 'http';
import cookieParser = require('cookie-parser');
import authRouter from './routes/auth.route'
import { TokenAuthorization } from './middleware/token-authorization';

dotenv.config();

const app: Application = express();

// middlewares.
app.use(express.json());
app.use(cors({
    origin: '*',
    credentials: true
}));
app.use(cookieParser());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, 
  standardHeaders: true,
  legacyHeaders: false
});
if (process.env.NODE_ENV === 'production') { 
  app.use(limiter);
}

app.use(authRouter);

app.get("/", (req: Request, res: Response) => {
    res.send("Home route")
})

const server = http.createServer(app)
const PORT = process.env.PORT || 8080;

server.listen(PORT, () =>
  console.log(`server running on http://localhost${PORT}`)
)