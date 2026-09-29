import { z } from 'zod';

// Zod form rules; email uses EMAIL_RE, not z.email() (stricter), so accepted addresses don't change.
export const EMAIL_RE = /^\S+@\S+\.\S+$/;

function email(msg = 'Please enter a valid email address.') { return z.string().trim().regex(EMAIL_RE, msg); }
function required(msg) { return z.string().trim().min(1, msg); }

export const contactSchema = z.object({
  name: required('Please enter your name.'),
  email: email(),
  message: required('Please enter a message.'),
});

export const signInSchema = z.object({
  email: email(),
});

export const createAccountSchema = z.object({
  name: required('Please enter your name.'),
  email: email(),
  phone: required('Please enter your phone number.'),
});

export const reviewSchema = z.object({
  picked: z.array(z.string()).min(1, 'Please pick at least one tour to review.'),
  rating: z.number().min(1, 'Please give a star rating.'),
  message: required('Please write your review.'),
});

// Booking schema is built per open; flags mirror BookConfirmModal's derived booking context.
export function bookingSchema({ pickupOptional = false, dropoffRequired = false, needsTime = false, needsFlight = false } = {}) {
  return z.object({
    name: required('Please enter your name.'),
    phone: required('Please enter your phone number.'),
    email: email(),
    pickup: pickupOptional ? z.string() : required('Please enter your pick-up location.'),
    dropoff: dropoffRequired ? required('Please enter your drop-off location.') : z.string(),
    time: needsTime ? z.string().min(1, 'Please select a pickup time.') : z.string(),
    flightNumber: needsFlight ? required('Please enter your flight number.') : z.string(),
    flightDatetime: needsFlight ? z.string().min(1, 'Please enter your flight date & time.') : z.string(),
    // Never validated - it has its own Apply button and its own message.
    referral: z.string().optional(),
  });
}
