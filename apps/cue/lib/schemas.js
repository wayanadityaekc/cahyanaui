import { z as zod } from 'zod';

export const EMAIL_RE = /^\S+@\S+\.\S+$/;

function email(message = 'Please enter a valid email address.') {
  return zod.string().trim().regex(EMAIL_RE, message);
}
function required(message) {
  return zod.string().trim().min(1, message);
}

export const contactSchema = zod.object({
  name: required('Please enter your name.'),
  email: email(),
  message: required('Please enter a message.'),
});

export const signInSchema = zod.object({
  email: email(),
});

export const createAccountSchema = zod.object({
  name: required('Please enter your name.'),
  email: email(),
  phone: required('Please enter your phone number.'),
});

export const reviewSchema = zod.object({
  picked: zod.array(zod.string()).min(1, 'Please pick at least one tour to review.'),
  rating: zod.number().min(1, 'Please give a star rating.'),
  message: required('Please write your review.'),
});

export function bookingSchema({
  pickupOptional = false,
  dropoffRequired = false,
  needsTime = false,
  needsFlight = false,
} = {}) {
  return zod.object({
    name: required('Please enter your name.'),
    phone: required('Please enter your phone number.'),
    email: email(),
    pickup: pickupOptional ? zod.string() : required('Please enter your pick-up location.'),
    dropoff: dropoffRequired ? required('Please enter your drop-off location.') : zod.string(),
    time: needsTime ? zod.string().min(1, 'Please select a pickup time.') : zod.string(),
    flightNumber: needsFlight ? required('Please enter your flight number.') : zod.string(),
    flightDatetime: needsFlight ? zod.string().min(1, 'Please enter your flight date & time.') : zod.string(),
    referral: zod.string().optional(),
  });
}
