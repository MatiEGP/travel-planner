# Objective: Implement Refresh Token Flow

## Problem
Currently, the authentication system relies on short-lived JWTs. To improve security and user experience, an additional layer using a Refresh Token is required. This allows automatic token renewal without requiring the user to log in repeatedly, while preventing exposure to XSS attacks (by using HttpOnly cookies).

## Scope & Constraints
- Must not destructively alter the current legacy login with JWT.
- Refresh Token must be implemented as a new feature (additional layer).
- Backend must use HttpOnly, Secure, SameSite=Strict cookies for the Refresh Token.
- Frontend must implement an HTTP interceptor for 401 Unauthorized errors with a Mutex/Queue to prevent race conditions on concurrent requests.
- Adhere strictly to project's DEVELOPMENT_GUIDELINES.md.

## Tasks
- [x] 1. (Backend) Create `RefreshToken` entity and repository.
- [x] 2. (Backend) Implement `RefreshTokenService` to generate, validate, and revoke refresh tokens.
- [x] 3. (Backend) Create `AuthController` endpoint `POST /api/auth/refresh`.
- [x] 4. (Backend) Update login response and refresh endpoint to use HttpOnly cookies for Refresh Token.
- [x] 5. (Frontend) Create/update TS interfaces for new auth responses.
- [x] 6. (Frontend) Update HTTP client interceptor to handle 401s with Mutex/Queue.
- [x] 7. (Frontend) Update Logout flow to invalidate the Refresh Token cookie.

## Evidence
- Backend Implementation: `89b2d9d` - feat(backend): implement refresh token security layer
- Frontend Implementation: `83ec357` - feat(frontend): implement refresh token interceptor and flow
