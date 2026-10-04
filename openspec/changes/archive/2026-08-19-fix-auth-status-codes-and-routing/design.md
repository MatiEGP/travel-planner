# Design: Fix Auth HTTP Status Codes and Guest Routing

## Technical Approach

Align HTTP response semantics with REST conventions by introducing an `AuthenticationEntryPoint` in Spring Security returning `401 Unauthorized` on unauthenticated requests. Streamline frontend navigation by replacing imperative page-level redirects with a declarative `GuestRoute` wrapper in React Router.

## Architecture Decisions

| Decision | Choice | Alternatives Considered | Rationale |
|---|---|---|---|
| **Unauthenticated Entry Point** | Dedicated `JwtAuthenticationEntryPoint` returning `401` with `ErrorResponseDTO` JSON | Default Spring `Http403ForbiddenEntryPoint` | Default entry point returns 403 Forbidden on missing credentials, violating HTTP semantics. |
| **Duplicate Login Requests** | Overwrite existing session cookie on valid credentials | Return 403 Forbidden with empty body | Users or tests logging in with different credentials should seamlessly replace session without manual logout. |
| **Guest Page Access Control** | Declarative `GuestRoute` layout route wrapper | Page-level `useEffect` redirects in `LoginPage` / `RegisterPage` | Eliminates component render flashing and centralizes redirection logic in the router tree. |

## Data Flow

```
[ Unauthenticated Request to /api/auth/me ]
   │
   ▼
[ SecurityFilterChain ]
   │ (No JWT cookie / invalid signature)
   ▼
[ JwtAuthenticationEntryPoint ]
   │
   ▼
Response: HTTP 401 Unauthorized + ErrorResponseDTO JSON Body
```

```
[ Authenticated User navigates to /login ]
   │
   ▼
[ React Router: GuestRoute ]
   ├── isLoading == true  ──→ Render Loader
   ├── isAuthenticated == true ──→ <Navigate to={from || "/planificaciones"} replace />
   └── isAuthenticated == false ──→ <Outlet /> (Render LoginPage)
```

## File Changes

| File | Action | Description |
|---|---|---|
| `backend/.../config/JwtAuthenticationEntryPoint.java` | Create | Implements `AuthenticationEntryPoint`, writes 401 JSON `ErrorResponseDTO` |
| `backend/.../config/SecurityConfig.java` | Modify | Attach `JwtAuthenticationEntryPoint` via `http.exceptionHandling()` |
| `backend/.../controllers/AuthController.java` | Modify | Remove `estaAutenticado()` blocking check on `/login` and `/registro` |
| `backend/src/test/.../AuthControllerTest.java` | Modify | Update and add test assertions for 401 and session overwrites |
| `frontend/src/components/auth/GuestRoute.tsx` | Create | Declarative guard route redirecting authenticated users |
| `frontend/src/router/index.tsx` | Modify | Wrap `/login`, `/register`, `/registro` under `GuestRoute` |
| `frontend/src/pages/LoginPage.tsx` | Modify | Remove imperative redirect `useEffect` |
| `frontend/src/pages/RegisterPage.tsx` | Modify | Remove imperative redirect `useEffect` |

## Interfaces / Contracts

### Backend `JwtAuthenticationEntryPoint`
```java
@Component
@RequiredArgsConstructor
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {
    private final ObjectMapper objectMapper;

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
                         AuthenticationException authException) throws IOException {
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        ErrorResponseDTO errorResponse = new ErrorResponseDTO(
                HttpStatus.UNAUTHORIZED.value(),
                HttpStatus.UNAUTHORIZED.getReasonPhrase(),
                "No autenticado. Credenciales ausentes o inválidas.",
                LocalDateTime.now()
        );
        objectMapper.writeValue(response.getOutputStream(), errorResponse);
    }
}
```

### Frontend `GuestRoute`
```tsx
export const GuestRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isAuthenticated) {
    const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/planificaciones';
    return <Navigate to={from} replace />;
  }

  return <Outlet />;
};
```

## Testing Strategy

| Layer | What to Test | Approach |
|---|---|---|
| **Unit (Backend)** | `JwtAuthenticationEntryPoint` writing 401 JSON | Mock `HttpServletResponse` and verify status + payload |
| **Integration (Backend)** | `/api/auth/me` without cookie returns 401 | MockMvc GET request asserting `status().isUnauthorized()` |
| **Integration (Backend)** | `/api/auth/login` with active session overwrites token | MockMvc POST request asserting `status().isOk()` and `Set-Cookie` header |
| **Static Verification (Frontend)** | Router & GuestRoute component typing | Run `npm run build && npm run lint` |

## Threat Matrix

| Boundary / Threat | Applicability | Mitigation & Test Plan |
|---|---|---|
| **Client Route Bypass** | Applicable | Protected routes remain guarded by `ProtectedRoute`. `GuestRoute` only gates public auth screens. |
| **Open Redirection** | Applicable | Redirection fallback defaults strictly to internal `/planificaciones`. |
| **Shell / Subprocess / VCS** | N/A | No shell execution or subprocess integration in this change. |

## Migration / Rollout

No database or infrastructure migration required. All changes are backward compatible with standard HTTP semantics.

## Open Questions

None.
