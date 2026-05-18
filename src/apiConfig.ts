/**
 * Centralized API configuration for the application.
 * All backend URLs and versioned endpoints are defined here.
 */

// Implementation targets used by the server proxy
export const BACKEND_TARGETS = {
  WEEKLY_STATUS: 'https://unstatic-boston-indeterminedly.ngrok-free.dev/report/view',
};

// Generic endpoint generator for versioned APIs
export const getApiEndpoint = (version: string, feature: string) => `/api/${version}/${feature}`;

// Standard feature keys
export const API_FEATURES = {
  WEEKLY_STATUS: 'weekly-status',
  MESSAGES: 'messages',
  STAR: 'messages/star',
  QUOTATION: 'quotation/save'
};
