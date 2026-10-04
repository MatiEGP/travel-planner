# Delta for auth

## ADDED Requirements

### Requirement: Responsive Animated Auth Container

The `AnimatedAuthContainer` 3D mirrored authentication cards MUST remain within viewport boundaries and clickable across desktop and tablet screen sizes (viewport widths >= 768px) without horizontal clipping or scrollbar overflow.

#### Scenario: Tablet and desktop viewport rendering

- GIVEN a user visiting `/login` or `/register` on a screen width >= 768px
- WHEN the `AnimatedAuthContainer` renders active and mirrored cards
- THEN all card surfaces MUST stay within horizontal viewport boundaries without horizontal clipping
- AND all input fields, buttons, and mode toggle controls MUST remain fully clickable and accessible.

#### Scenario: Reduced motion display

- GIVEN a user with `prefers-reduced-motion` enabled
- WHEN visiting the authentication view
- THEN card transforms MUST adapt to prevent horizontal overflow and abrupt motion effects.
