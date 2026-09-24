import { z } from 'zod';

// Form validation rules, one declarative place instead of if-chains spread across
// the modals. The booking schema is the one the server (cahyana-api) should mirror:
// it defines what counts as a bookable enquiry.
//
// Email uses the project's own regex rather than z.email(). Zod's built-in check is
// stricter, so switching would start rejecting addresses the site accepts today -
// a silent behaviour change in the booking flow, which is not what this refactor is
// for. Keep them identical unless that change is made deliberately.
export const EMAIL_RE = /^\S+@\S+\.\S+$/;

const email = (msg = 'Please enter a valid email address.') => z.string().trim().regex(EMAIL_RE, msg);
const required = (msg) => z.string().trim().min(1, msg);

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

// Booking rules are conditional on the booking context, so the schema is built per
// open rather than being a single constant. Flags mirror BookConfirmModal's derived
// values: pickupOptional/dropoffRequired come from the booking context, needsTime
// and needsFlight from the catalog category and whether the route is the airport one.
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
