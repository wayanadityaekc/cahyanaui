import { z } from 'zod';

// Form rules, in one place so they can be read against the server's own.
//
// EMAIL USES OUR OWN REGEX, not z.email(): Zod's built-in is stricter and would
// start rejecting addresses the API accepts today. CUE learnt this and left the
// same note - if the two disagree, the guest is told their real address is
// invalid by a form that then cannot be submitted.
export const EMAIL_RE = /^\S+@\S+\.\S+$/;

const email = (msg = 'Please enter a valid email address.') => z.string().trim().regex(EMAIL_RE, msg);
const required = (msg) => z.string().trim().min(1, msg);

export const signInSchema = z.object({
  email: email(),
});

// Phone is required because it is how the family recognises a guest when the
// email bounces - the same rule the tour site's account form uses.
export const createAccountSchema = z.object({
  name: required('Please enter your name.'),
  email: email(),
  phone: required('Please enter your phone number.'),
});
