import { z } from 'zod';

export const EMAIL_RE = /^\S+@\S+\.\S+$/;

function email(msg = 'Please enter a valid email address.') {
  return z.string().trim().regex(EMAIL_RE, msg);
}
function required(msg) {
  return z.string().trim().min(1, msg);
}

export const signInSchema = z.object({
  email: email(),
});

export const createAccountSchema = z.object({
  name: required('Please enter your name.'),
  email: email(),
  phone: required('Please enter your phone number.'),
});
