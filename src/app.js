import express from 'express';
import { router } from './routes/route.js';
import { ERROR_MESSAGES } from './utils/errorMessages.js';

export const app = express()

// middlewares
app.use(express.json());

app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        console.error('Bad JSON:', err);
        return res.status(400).json({ error: ERROR_MESSAGES.INVALID_JSON });
    }
    next();
});

// routes
app.use('/api/v1/messages', router);