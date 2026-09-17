# abort-controller-useeffect Proposal

## Motivation
Currently, frontend components perform asynchronous requests inside `useEffect` hooks without mechanisms to cancel them when the component unmounts. This can cause race conditions (e.g., if the user navigates quickly between views) and memory leaks or React warnings when attempting to update the state of unmounted components.

## Proposed Changes
Implement `AbortController` in `useEffect` hooks that perform data fetching or asynchronous API calls in the frontend. Extend the corresponding frontend service functions to accept an optional `AbortSignal` and pass it to the underlying `fetch` calls.
When a component unmounts, the `useEffect` cleanup function will trigger `abortController.abort()`, cancelling any pending network requests.

## Dependencies
- No new dependencies. This relies on native browser capabilities (`AbortController`, `fetch`).

## Rollback Plan
- Revert the commits that modify the `useEffect` hooks and the frontend service definitions.
- Restore the service APIs to their previous state without the `AbortSignal` parameters.

## Affected Capabilities
- All frontend capabilities that perform data fetching on mount (e.g., `frontend-layouts`, `planificaciones-view`, `planificacion-detail-view`).

## Success Criteria
- Views that perform data requests cancel the request if the user navigates away before the request completes.
- React warnings regarding state updates on unmounted components are eliminated.
- Affected asynchronous services correctly receive and pass the `signal` parameter to the underlying network requests.
