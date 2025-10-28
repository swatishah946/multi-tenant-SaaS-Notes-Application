// validators/userValidator.js
import { body } from 'express-validator';

export const inviteUserValidator = [
  body('email')
    .isEmail()
    .withMessage('Valid email required'),
  body('role')
    .isIn(['Admin', 'Member'])
    .withMessage('Role must be Admin or Member')
];
