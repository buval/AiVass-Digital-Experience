/**
 * AiVass booking configuration
 *
 * STRATEGIC_ASSESSMENT_URL is the single source of truth for the
 * Strategic Profile Assessment booking flow. All assessment CTAs
 * across the site must reference this constant — do NOT hard-code
 * the URL independently in individual components.
 *
 * The Google Calendar appointment schedule already includes:
 *   - Booking form with résumé/CV and LinkedIn intake
 *   - Assessment questions
 *   - $250 Stripe payment (handled inside Google Calendar)
 *   - Google Meet creation + calendar invitation + email reminder
 *
 * DO NOT: create a separate Stripe checkout for the assessment.
 * DO NOT: expose the assessment price on aivass.com.
 * DO NOT: embed the Google default booking button.
 *
 * To update the booking URL in future, change it here only.
 */
export const STRATEGIC_ASSESSMENT_URL =
  "https://calendar.app.google/SG2UBbBPHU9tzM9c9";
