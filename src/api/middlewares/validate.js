import { validationResult } from 'express-validator';

// Middleware to check validation errors and send a response if any
export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.error('Middleware validation error: ', errors);
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
