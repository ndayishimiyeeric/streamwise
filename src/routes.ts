/**
 * Routes that are accessible to the public, and
 * don't require authentication
 * @type {string[]}
 */

export const publicRoutes = ["/", "/auth/new-verification"];

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
];

/**
 * prefix for api authentication routes.
 * routes that start with this prefix are use for authentication purposes
 * @type {string}
 */

export const authApiPrefix = "/api/auth";

/**
 * prefix for trpc ai routes
 * routes that start with this prefix are use for trpc purposes
 * @type {string}
 */

export const trpcApiPrefix = "/api/trpc";

/**
 * prefix for webhooks routes
 * routes that start with this prefix are use for webhooks purposes
 * @type {string}
 */

export const webhooksApiPrefix = "/api/webhook";

/**
 * the default redirect url after login
 * @type {string}
 */

export const DEFAULT_LOGIN_REDIRECT = "/dashboard";
