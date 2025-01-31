import { body, query, oneOf } from 'express-validator';

const numericValidator = (field) =>
    body(field)
        .exists().withMessage(`${field} is required`)
        .isInt({ min: 1 }).withMessage(`${field} must be a positive integer`)
        .toInt();


const optionalRequestBodyNumericValidator = (field) =>
    query(field)
        .optional()
        .isInt({ min: 1 }).withMessage(`${field} must be a positive integer`)
        .toInt();

const optionalRequestQueryNumericValidator = (field) =>
    query(field)
        .optional()
        .isInt({ min: 1 }).withMessage(`${field} must be a positive integer`)
        .toInt();

export const validateSendMessage = [
    oneOf([
        body('groupId').exists().withMessage('Group ID is required for group messages'),
        body('receiverId').exists().withMessage('Receiver ID is required for private message')
    ], 'Must provide eithr receiverId or groupId'),

    numericValidator('senderId'),
    optionalRequestBodyNumericValidator('receiverId'),
    optionalRequestBodyNumericValidator('groupId'),
    body('content')
        .trim()
        .isLength({ min: 1 }).withMessage('Message content cannot be empty')
        .escape()
];

export const validateRetrieveMessages = [
    // Mutual exclusivity check (can have neither, but not both)
    oneOf([
        // Case 1: Only groupId provided
        [
            query('groupId').exists(),
            query('receiverId').not().exists()
        ],
        // Case 2: Only receiverId provided
        [
            query('receiverId').exists(),
            query('groupId').not().exists()
        ],
        // Case 3: Neither provided (optional)
        [
            query('groupId').not().exists(),
            query('receiverId').not().exists()
        ]
    ], { message: 'Cannot provide both groupId and receiverId' }),

    optionalRequestQueryNumericValidator('senderId'),
    optionalRequestQueryNumericValidator('receiverId'),
    optionalRequestQueryNumericValidator('groupId'),

    query('page')
        .optional()
        .isInt({ min: 1 }).withMessage('Page must be a positive integer')
        .default(1)
        .toInt(),

    query('pageSize')
        .optional()
        .isInt({ min: 1, max: 100 }).withMessage('Page size must be between 1-100')
        .default(20)
        .toInt(),

    query('startDate')
        .optional()
        .isISO8601().withMessage('startDate must be in ISO 8601 format')
        .bail()
        .toDate(),

    query('endDate')
        .optional()
        .isISO8601().withMessage('endDate must be in ISO 8601 format')
        .bail()
        .toDate()
        .custom((value, { req }) => {
            if (req.query.startDate && value < req.query.startDate) {
                throw new Error('endDate cannot be before startDate');
            }
            return true;
        })
];
