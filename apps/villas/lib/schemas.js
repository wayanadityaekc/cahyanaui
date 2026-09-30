import { z } from 'zod';

// Own email regex, not z.email(): Zod's is stricter and would reject addresses the API accepts today.
export const EMAIL_RE = /^\S+@\S+\.\S+$/;

function email(msg = 'Please enter a valid email address.') { return z.string().trim().regex(EMAIL_RE, msg); }
function required(msg) { return z.string().trim().min(1, msg); }

export const signInSchema = z.object({
  email: email(),
});

// Phone is required: it is how the family finds a guest when the email bounces (same rule as the tour site).
export const createAccountSchema = z.object({
  name: required('Please enter your name.'),
  email: email(),
  phone: required('Please enter your phone number.'),
});
