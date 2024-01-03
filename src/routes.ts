/**
 * Routes that are accessible to the public, and
 * don't require authentication
 * @type {string[]}
 */

export const publicRoutes = ["/", "/auth/new-verification, /api/webhook, /api/trpc/, /api/trpc/:path*"];

/**
 * Routes that are used for authentication
 * They redirect logged in users to the dashboard
 * @type {string[]}
 */

export const authRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/error",
  "/auth/reset",
  "/auth/new-password",
  "/api/webhook"
];

/**
 * prefix for api authentication routes.
 * routes that start with this prefix are use for authentication purposes
 * @type {string}
 */

export const authApiPrefix = "/api/auth";

export const DEFAULT_LOGIN_REDIRECT = "/dashboard";
