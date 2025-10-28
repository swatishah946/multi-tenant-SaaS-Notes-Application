import { body } from 'express-validator';

export const createNoteValidator = [
  body('content')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Note content is required'),
];
