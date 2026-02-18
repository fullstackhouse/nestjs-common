# Code Style Guidelines

## Clean Code Practices

- Follow Clean Code principles (Single Responsibility, small focused functions)
- Self-documenting code with meaningful names
- Early return pattern to reduce nesting
- Keep functions small and focused on one task
- Extract complex logic into separate, well-named functions
- Use meaningful variable and function names
- Don't extract something to a function if the implementation is very short and self-explanatory
- **Avoid restatement functions**: Don't create functions whose body just repeats what the name says - either add meaningful logic or call the underlying method directly

Bad - unnecessary wrapper:
```ts
function addUserToDatabase(user) {
  database.add(user);
}
addUserToDatabase(user);  // Just call database.add(user) directly
```

Good - call directly or add meaningful logic:
```ts
database.add(user);  // Direct call

// OR if there's real logic:
function addUserToDatabase(user) {
  validateUser(user);
  user.createdAt = Date.now();
  database.add(user);
}
```

## Comments Policy - STRICT ENFORCEMENT

- **NO COMMENTS RULE**: When you feel the need to comment, extract code to a function with a descriptive name instead
- **NEVER write obvious comments** that restate what the code does
- **ONLY ACCEPTABLE COMMENTS**: Complex business rules or non-obvious algorithmic decisions (rare exceptions)
- **SELF-DOCUMENTING CODE**: Method and variable names should tell the story
- **EXCEPTION - Reusable/public code**: Add concise JSDoc for exported functions, classes, and modules meant for reuse across the codebase. Focus on purpose and usage, not implementation details

## Control Flow

- Use early-return (if-guard) pattern to reduce nesting
- Prefer guard clauses over nested if-else statements
- Return early from functions when conditions are not met

## Error Handling

- **Avoid unnecessary try-catch blocks** - Let errors propagate naturally unless you need to transform them
- Don't catch errors just to throw a different message if the original error is clear enough
- Only wrap in try-catch when you need to:
  - Transform the error type
  - Add significant context
  - Handle specific error cases differently

## TypeScript Best Practices

- **NEVER use 'as any' type assertions** - always use proper typing instead
- Prefer type-safe alternatives like 'unknown' when type is truly unknown
- Use proper type annotations for function parameters and return values
- Skip type annotations when they can be guessed implicitly by TS

## Shell Scripts

Always include set flags at the beginning of bash/shell scripts:

```bash
#!/bin/bash
set -euo pipefail
```
