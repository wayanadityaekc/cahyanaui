import { z as zod } from 'zod';

export const EMAIL_RE = /^\S+@\S+\.\S+$/;

function buildEmailSchema(message = 'Please enter a valid email address.') {
  return zod.string().trim().regex(EMAIL_RE, message);
}
function buildRequiredSchema(message) {
  return zod.string().trim().min(1, message);
}

export const contactSchema = zod.object({
  name: buildRequiredSchema('Please enter your name.'),
  email: buildEmailSchema(),
  message: buildRequiredSchema('Please enter a message.'),
});

export const signInSchema = zod.object({
  email: buildEmailSchema(),
});

export const createAccountSchema = zod.object({
  name: buildRequiredSchema('Please enter your name.'),
  email: buildEmailSchema(),
  phone: buildRequiredSchema('Please enter your phone number.'),
});

export const reviewSchema = zod.object({
  picked: zod.array(zod.string()).min(1, 'Please pick at least one tour to review.'),
  rating: zod.number().min(1, 'Please give a star rating.'),
  message: buildRequiredSchema('Please write your review.'),
});

export function buildBookingSchema({
  pickupOptional = false,
  dropoffRequired = false,
  needsTime = false,
  needsFlight = false,
} = {}) {
  return zod.object({
    name: buildRequiredSchema('Please enter your name.'),
    phone: buildRequiredSchema('Please enter your phone number.'),
    email: buildEmailSchema(),
    pickup: pickupOptional ? zod.string() : buildRequiredSchema('Please enter your pick-up location.'),
    dropoff: dropoffRequired ? buildRequiredSchema('Please enter your drop-off location.') : zod.string(),
    time: needsTime ? zod.string().min(1, 'Please select a pickup time.') : zod.string(),
    flightNumber: needsFlight ? buildRequiredSchema('Please enter your flight number.') : zod.string(),
    flightDatetime: needsFlight ? zod.string().min(1, 'Please enter your flight date & time.') : zod.string(),
    referral: zod.string().optional(),
  });
}
