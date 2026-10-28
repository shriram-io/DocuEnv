# DocuEnv — Project Rules

## Product and scope
- Build a privacy-first, client-side environment configuration auditor.
- Prioritize import/paste → parse → compare → review → generate → export.
- Keep the MVP within 7–8 hours.
- Defer backend processing, accounts, cloud persistence, deployment integrations, GitHub bots, collaboration, and billing.

## Privacy and security
- Never transmit environment file contents or values.
- Never log raw values, tokens, passwords, private keys, or complete input files.
- Do not persist raw configuration in localStorage, IndexedDB, URLs, analytics, or error reporting by default.
- Render user input as text. Never use `eval` or `Function`.
- Generated CI scripts must not print secret values.
- State privacy behavior accurately; do not claim absolute security.

## Parsing and inference
- Document supported `.env` syntax; do not claim universal compatibility.
- Flag duplicate keys, malformed lines, empty values, and ambiguous syntax.
- Type inference is heuristic. Label suggestions clearly and allow overrides.
- Fall back to `string` when a type is ambiguous.
- Never include raw values in diagnostics.

## Code quality
- Use TypeScript types for domain models and module interfaces.
- Separate parsing, comparison, inference, generation, and UI.
- Prefer small pure functions and deterministic output.
- Handle errors explicitly and preserve input after recoverable errors.
- Add dependencies only when their value is clear.

## Testing
- Test parser, comparison, inference, and code generation.
- Add regression tests for bug fixes.
- Run tests, lint/type checks, and production build before release.
- Never claim a check passed unless it was actually run.
- Verify generated output and manually test deployed flows.

## UI/UX
- No generic purple gradients, excessive glassmorphism, random colours, or decorative card grids.
- Use an editorial engineering design: warm neutrals, ink typography, restrained status colours, consistent spacing.
- Animations must be purposeful, short, and respect `prefers-reduced-motion`.
- Never communicate status through colour alone.
- Include empty, success, warning, error, and clipboard feedback states.
- Support keyboard navigation, visible focus, responsive layouts, and readable code.

## GitHub and release
- Never commit real `.env` files or secrets.
- Use placeholders in examples.
- Keep the main branch buildable and make small, meaningful commits.
- Tag releases only after required checks and production smoke tests pass.
- Document actual supported syntax, privacy behavior, limitations, and verification status.
- Do not use fake metrics, testimonials, or unverified claims.

## Decision rules
- Prefer correctness, privacy, clarity, and testability over feature count.
- Choose the simplest defensible option unless clarification is essential.
- Keep implementation instructions concise and stepwise.
- Do not expand scope just to make the repository look larger.

## Definition of done
- Core workflow works end to end.
- Critical tests pass and production build succeeds.
- Generated schema and CI output are validated against examples.
- Browser network inspection confirms inputs are not transmitted.
- Deployment is manually verified.
- README, license, screenshots, and known limitations are accurate.
- No known critical defect remains unresolved.
