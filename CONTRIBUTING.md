# Contributing to Tiny Coerce

Thank you for your interest in contributing to Tiny Coerce! This document provides guidelines and instructions for contributing.

## Development Setup

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/tiny-coerce.git
   cd tiny-coerce
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```

## Development Workflow

### Code Quality

- **Linting**: We use [oxlint](https://oxc.rs/docs/guide/usage/linter.html) for linting
- **Formatting**: We use [oxfmt](https://oxc.rs/docs/guide/usage/formatter.html) for formatting
- **Check code**:
  ```bash
  npm run lint
  ```
- **Auto-fix issues**:
  ```bash
  npm run fix
  ```

### Testing

- **Run tests**:
  ```bash
  npm test
  ```
- **Run with coverage**:
  ```bash
  npm run coverage
  ```

Tests use Node.js native test runner with ES Modules.

### Building

- **Build distribution files**:
  ```bash
  npm run build
  ```
- **Build only (skip lint)**:
  ```bash
  npm run rollup
  ```

Distribution files are built using [Rollup](https://rollupjs.org/).

## Making Changes

1. **Create a branch** for your feature or fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following the code style:
   - Tabs for indentation
   - Double quotes for strings
   - No semicolons (automatic insertion)
   - JSDoc comments for exported functions

3. **Run tests and linting** before committing:
   ```bash
   npm test
   ```

4. **Commit your changes**:
   ```bash
   git add .
   git commit --no-verify -m "Add feature description"
   ```

   Note: We use `--no-verify` to skip husky hooks during development.

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

## Pull Request Process

1. **Ensure your code passes all tests**:
   ```bash
   npm test
   ```

2. **Update documentation** if needed:
   - `README.md` for user-facing changes
   - `docs/API.md` for API changes
   - `docs/TECHNICAL.md` for implementation changes

3. **Create a Pull Request** from your feature branch to `master`

4. **Describe your changes** clearly in the PR:
   - What problem does this solve?
   - How does it work?
   - Any breaking changes?

## Code Style Guidelines

See [docs/CODE_STYLE.md](docs/CODE_STYLE.md) for detailed code style guidelines.

Key principles:
- **Keep it simple**: Prefer simple, readable solutions
- **No mutations**: Functions should not mutate their arguments
- **Error handling**: Use try/catch for JSON parsing, throw for invalid input
- **Naming**: Use camelCase for variables/functions, UPPER_CASE for constants
- **Comments**: Use JSDoc for public APIs, inline comments for complex logic

## Security Considerations

- Never commit secrets, keys, or credentials
- Validate all inputs
- Respect size limits (`maxStringSize`, `maxDepth`)

## Questions?

If you have questions, feel free to:
- Open an issue on GitHub
- Contact the maintainer

## License

By contributing, you agree that your contributions will be licensed under the BSD-3-Clause license.
