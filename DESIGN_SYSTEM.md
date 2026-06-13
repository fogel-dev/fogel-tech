# Design system

The interface grows in three layers:

1. Add or reuse a semantic token in `src/app/globals.css`.
2. Add a reusable primitive in `src/shared/ui` only when behavior repeats.
3. Compose product-specific components in `features` or `widgets`.

Pages must not duplicate raw colors, shadows, radii, or transition timings.
Light and dark appearances are expressed through tokens, not component forks.
