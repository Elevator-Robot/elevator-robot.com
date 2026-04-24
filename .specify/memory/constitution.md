# Elevator Robot Website Constitution
<!-- Example: Spec Constitution, TaskFlow Constitution, etc. -->

## Core Principles

### I. Stack Consistency
<!-- Example: I. Library-First -->
- MUST keep frontend work in React + TypeScript + Vite + TailwindCSS.
- MUST keep backend work in Amplify Gen2 patterns.
- MUST NOT add new frameworks without explicit approval.
<!-- Example: Every feature starts as a standalone library; Libraries must be self-contained, independently testable, documented; Clear purpose required - no organizational-only libraries -->

### II. Security Baseline
<!-- Example: II. CLI Interface -->
- MUST never expose credentials, API keys, or tokens in client code.
- MUST use environment variables for sensitive configuration.
- MUST validate and sanitize user input at form/API boundaries.
<!-- Example: Every library exposes functionality via CLI; Text in/out protocol: stdin/args → stdout, errors → stderr; Support JSON + human-readable formats -->

### III. Build and Quality Gate
<!-- Example: III. Test-First (NON-NEGOTIABLE) -->
- MUST pass `npm run lint` and `npm run build` before merge/deploy.
- MUST add error handling for newly introduced async logic.
- SHOULD add or update tests when behavior changes.
<!-- Example: TDD mandatory: Tests written → User approved → Tests fail → Then implement; Red-Green-Refactor cycle strictly enforced -->

### IV. Accessibility and Mobile
<!-- Example: IV. Integration Testing -->
- MUST preserve keyboard accessibility and semantic labels.
- MUST keep primary user flows usable on common mobile viewport sizes.
- SHOULD respect reduced-motion preferences for new animations.
<!-- Example: Focus areas requiring integration tests: New library contract tests, Contract changes, Inter-service communication, Shared schemas -->

### V. Simplicity and Reuse
<!-- Example: V. Observability, VI. Versioning & Breaking Changes, VII. Simplicity -->
- MUST prefer small, incremental changes over broad rewrites.
- MUST reuse existing patterns before introducing new abstractions.
- SHOULD remove dead code when touching related areas.
<!-- Example: Text I/O ensures debuggability; Structured logging required; Or: MAJOR.MINOR.BUILD format; Or: Start simple, YAGNI principles -->

## Project Constraints
<!-- Example: Additional Constraints, Security Requirements, Performance Standards, etc. -->

- AWS operations MUST use the `elevator-robot.com` profile.
- Branding MUST use "Elevator Robot" capitalization.
- Deployments target `elevatorrobot.com` and approved subdomains.
<!-- Example: Technology stack requirements, compliance standards, deployment policies, etc. -->

## Development Workflow
<!-- Example: Development Workflow, Review Process, Quality Gates, etc. -->

1. Implement only scoped, minimal changes.
2. Run lint and build checks.
3. Verify frontend changes in desktop and mobile views.
4. Verify backend changes in Amplify sandbox when applicable.
<!-- Example: Code review requirements, testing gates, deployment approval process, etc. -->

## Governance
<!-- Example: Constitution supersedes all other practices; Amendments require documentation, approval, migration plan -->

- This constitution is the baseline authority for spec, plan, and task decisions.
- Exceptions MUST be documented with rationale and expiration in the plan.
- Amendments require file update plus version/date change.
<!-- Example: All PRs/reviews must verify compliance; Complexity must be justified; Use [GUIDANCE_FILE] for runtime development guidance -->

**Version**: 1.0.0 | **Ratified**: 2026-04-23 | **Last Amended**: 2026-04-23
<!-- Example: Version: 2.1.1 | Ratified: 2025-06-13 | Last Amended: 2025-07-16 -->
