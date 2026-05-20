// Frontend error tracking utility
// In production, replace with Sentry SDK: import * as Sentry from '@sentry/react'

const errors: Array<{ message: string; stack?: string; timestamp: string; context?: string }> = [];
const MAX_ERRORS = 100;

export function trackError(error: Error, context?: string) {
  const entry = {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    context,
  };

  errors.push(entry);
  if (errors.length > MAX_ERRORS) errors.shift();

  // In production with Sentry:
  // Sentry.captureException(error, { extra: { context } });

  // Log to console in development
  if (import.meta.env.DEV) {
    console.error(`[ErrorTracker] ${context || 'Unknown'}:`, error);
  }
}

export function getTrackedErrors() {
  return [...errors];
}

// Global unhandled error listener
window.addEventListener('error', (event) => {
  trackError(event.error || new Error(event.message), 'global:unhandled');
});

window.addEventListener('unhandledrejection', (event) => {
  const error = event.reason instanceof Error ? event.reason : new Error(String(event.reason));
  trackError(error, 'global:unhandledrejection');
});
