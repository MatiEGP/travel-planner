# Exploration: frontend-enhancements

## 1. Overview & Context

Following the initial layout and nested itinerary refactoring (`frontend-refactor`), the frontend codebase was transitioned toward an organic, fluid travel theme with distinct layouts (`DiscoveryLayout`, `PlannerLayout`) and nested itinerary visualizers (`PlanificacionCard` > `MiniDestinoCard` > `ActivityListItem`).

An investigation into the current frontend codebase reveals several critical architectural misalignments, visual/routing bugs, and functional gaps resulting from incomplete integration of the new layouts and components.

---

## 2. Current State & Codebase Findings

### Finding 1: Layout & Route Hierarchy Mismatch (Double Navbars & Broken Shells)
- **Problem**: In `frontend/src/router/index.tsx`, the root route (`/`) wraps all child routes with `MainLayout` (which renders `Header` and `footer`). Meanwhile:
  - `HomePage.tsx` wraps its content with `DiscoveryLayout` (which renders `DiscoveryNavbar`), creating **two overlapping navbars/headers**.
  - `PlanificacionesPage.tsx` wraps its content with `PlannerLayout` (which contains fixed-height sidebars and sticky headers), rendering an internal 3-column app shell inside `MainLayout`'s scrollable container, breaking desktop layout constraints.
- **Affected Files**: `src/router/index.tsx`, `src/layouts/MainLayout.tsx`, `src/pages/HomePage.tsx`, `src/pages/PlanificacionesPage.tsx`.

### Finding 2: Itinerary Data Disconnect & Loss of Plan Management (CRUD Regression)
- **Problem**: 
  - `PlanificacionesPage.tsx` loads trips via `planificacionService.getByUsuario(usuario.id)`, but passes `destinos={[]}` hardcoded into `PlanificacionCard`. The backend API returns flat DTOs (`/api/planificaciones/usuario/{id}`), so nested destinations and activities are never fetched or displayed.
  - The previous plan creation (`PlanificacionForm`) and deletion (`onDelete`) capabilities from `PlanificacionManager` were removed during the refactor. `PlannerLayout` contains a static `<button>Create New Plan</button>` with no `onClick` handler or creation modal.
- **Affected Files**: `src/pages/PlanificacionesPage.tsx`, `src/layouts/PlannerLayout.tsx`, `src/components/itinerary/PlanificacionCard.tsx`.

### Finding 3: Non-SPA Navigation & Incomplete Auth Integration
- **Problem**:
  - `PlannerSidebar.tsx` and `DiscoveryNavbar.tsx` use raw HTML anchor tags (`<a href="...">`) rather than React Router's `<Link>` or `<NavLink>`, triggering full browser page reloads and resetting client state.
  - `PlannerSidebar.tsx` renders static `"User Account"` placeholder text instead of real user profile info and a logout trigger.
  - `DiscoveryNavbar.tsx` lacks authentication-aware links (Login / Register vs. User Profile / Logout).
- **Affected Files**: `src/components/layout/PlannerSidebar.tsx`, `src/components/layout/DiscoveryNavbar.tsx`.

### Finding 4: Duplicate & Legacy Component Fragmentation
- **Problem**:
  - Duplicate cards exist: `src/components/PlanificacionCard.tsx` (legacy flat card) vs. `src/components/itinerary/PlanificacionCard.tsx` (nested itinerary card).
  - Unmigrated views: `DestinosPage.tsx`, `ActividadesPage.tsx`, `AdminPage.tsx`, `LoginPage.tsx`, and `RegisterPage.tsx` still rely on legacy components (`DestinoManager`, `ActividadManager`, `UsuarioManager`) using old teal/slate color tokens rather than the new `nature`/`sand`/`ocean` design system.
- **Affected Files**: `src/pages/DestinosPage.tsx`, `src/pages/ActividadesPage.tsx`, `src/components/`.

---

## 3. Potential Approaches

### Approach 1: Core Layout Architecture & CRUD Restoration (Recommended Priority)
- **Scope**:
  1. Restructure `src/router/index.tsx` so top-level routes attach directly to their respective layouts (`DiscoveryLayout` for Discovery/Auth, `PlannerLayout` for Planificaciones/Destinos/Actividades/Admin), eliminating `MainLayout` conflicts.
  2. Replace all raw `<a>` tags with `Link`/`NavLink` in `PlannerSidebar` and `DiscoveryNavbar`.
  3. Connect user auth info and logout modal into `PlannerSidebar` and `DiscoveryNavbar`.
  4. Restore Plan creation (via modal/drawer triggered by "Create New Plan" in `PlannerLayout`) and trip deletion actions in `PlanificacionCard`.
- **Pros**: Directly fixes navigation bugs, removes double navbars, and restores critical functional flows for users.
- **Cons**: Does not yet solve deep nested data fetching across all destination/activity levels.

### Approach 2: Full Nested Itinerary Visualizer & Hierarchical Data Management
- **Scope**:
  1. Implement hierarchical data fetching (e.g., fetching destinos and actividades on demand or upon expanding a `PlanificacionCard`).
  2. Add interactive controls to `PlanificacionCard` and `MiniDestinoCard` to expand/collapse itinerary details, add destinations, and add activities inline or via modals.
  3. Deprecate legacy flat managers (`PlanificacionManager`, `DestinoManager`, `ActividadManager`).
- **Pros**: Delivers on the full vision of the nested itinerary visualizer.
- **Cons**: Larger scope with multiple async state loading states per card.

### Approach 3: Comprehensive Design System & Full-Page Migration
- **Scope**:
  1. Modernize `LoginPage`, `RegisterPage`, `DestinosPage`, and `ActividadesPage` to use the organic `sand`/`nature`/`ocean` color tokens and card components.
  2. Polish landing page (`HomePage.tsx`) with richer travel visuals and organic CTA cards.
  3. Clean up legacy component files and unify styling tokens across all forms.
- **Pros**: Provides visual consistency across 100% of the frontend.
- **Cons**: Purely visual/cosmetic without fixing data flow regressions unless combined with Approach 1 or 2.

---

## 4. Tradeoffs & Comparison Matrix

| Approach | Functional Fixes | Visual Polish | Complexity | Scope |
| :--- | :--- | :--- | :--- | :--- |
| **Approach 1: Layout & Core CRUD** | High (Fixes double header, routing, trip creation/deletion) | Medium | Moderate | Targeted |
| **Approach 2: Full Nested Itinerary** | High (Complete hierarchical itinerary explorer) | High | High | Broad |
| **Approach 3: Complete Design Modernization** | Low (Mostly styling & form redesign) | High | Low–Moderate | Broad |
