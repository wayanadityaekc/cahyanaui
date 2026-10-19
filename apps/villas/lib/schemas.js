import { z as zod } from 'zod';

export const EMAIL_RE = /^\S+@\S+\.\S+$/;

function email(message = 'Please enter a valid email address.') {
  return zod.string().trim().regex(EMAIL_RE, message);
}
function required(message) {
  return zod.string().trim().min(1, message);
}

export const signInSchema = zod.object({
  email: email(),
});

export const createAccountSchema = zod.object({
  name: required('Please enter your name.'),
  email: email(),
  phone: required('Please enter your phone number.'),
});
