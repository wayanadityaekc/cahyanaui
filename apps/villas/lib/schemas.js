import { z as zod } from 'zod';

export const EMAIL_RE = /^\S+@\S+\.\S+$/;

function buildEmailSchema(message = 'Please enter a valid email address.') {
  return zod.string().trim().regex(EMAIL_RE, message);
}
function buildRequiredSchema(message) {
  return zod.string().trim().min(1, message);
}

export const signInSchema = zod.object({
  email: buildEmailSchema(),
});

export const createAccountSchema = zod.object({
  name: buildRequiredSchema('Please enter your name.'),
  email: buildEmailSchema(),
  phone: buildRequiredSchema('Please enter your phone number.'),
});
