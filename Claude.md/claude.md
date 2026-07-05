# E-commerce — CLAUDE.md

## Project Identity
E-commerce is a Tests for E-commerce site ; automationexercise.com . Tech stack: Custom backend, React/TypeScript frontend, Custom.

**Prime Directive:** Never break existing functionality without explicit approval. Every change must be testable and reversible.

## Architecture Rules

### Backend (Custom)
- Follow layered architecture pattern
- All external-facing data must pass through validation at the boundary
- Database access only through your ORM — no raw SQL in handlers
- Structure: `src/`

### Database (Custom)
- All schema changes require a migration file
- Never modify existing migration files — only create new ones
- Test migrations against a fresh database before merging
- Name tables in snake_case, columns in snake_case

### Frontend (React/TypeScript)
- Components are self-contained with co-located tests
- State management follows project conventions
- API calls go through a centralized client — never fetch directly in components
- All user-facing text must handle loading and error states

## Code Standards
- Import ordering: stdlib → third-party → local (enforce with linter)
- Error handling: never swallow exceptions silently — log or propagate
- Logging: structured logging with context (request ID, user ID where applicable)
- No hardcoded secrets, URLs, or environment-specific values — use env vars

## Hard Constraints

```
NEVER: Push directly to main/production branch
WHY: Breaks CI/CD guarantees and bypasses review
INSTEAD: Create a feature branch and open a PR

NEVER: Modify auth/authentication logic without full test coverage
WHY: Auth bugs are security vulnerabilities
INSTEAD: Write tests FIRST, then modify auth code

NEVER: Skip database migrations for schema changes
WHY: Causes drift between environments
INSTEAD: Always create a migration, even for "small" changes

NEVER: Commit .env files or secrets to git
WHY: Credential exposure
INSTEAD: Use environment variable management (Doppler, Vault, etc.)

NEVER: Deploy without passing all tests
WHY: Regressions reach users
INSTEAD: CI must be green before any merge
```

## Known Pain Points
1. **Execute a E2E Sanity Testing using Playwright as framework. Ensure all flaky test cases are fixed as necessaary**  Retest and confirm they all run successfully(i.e pass)

## Testing
- Framework: Playwright
- Run all tests before committing: verify nothing breaks
- New features require tests — no exceptions
- Team: Solo developer

## Git Discipline
- Branch naming: `feature/`, `fix/`, `refactor/` prefixes
- Commit messages: imperative mood, explain WHY not WHAT
- PRs require passing CI

NB : Check Folder README for further clues. Ask for approval where necessary