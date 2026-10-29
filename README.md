# DocuEnv

**Audit environment configuration drift. Generate validation contracts. Keep your configuration local.**

DocuEnv is a privacy-first developer utility that compares environment-variable configurations, identifies missing and extra keys, suggests likely value types, and generates Zod schemas and CI validation scripts.

## Features

- **Local file import and paste:** Load `.env` and `.env.example` files directly in your browser.
- **Configuration comparison:** Identify missing, extra, and present variables.
- **Parsing diagnostics:** Review supported syntax issues and environment-variable warnings.
- **Type inference:** Receive heuristic suggestions for strings, integers, booleans, URLs, emails, and ports.
- **Manual overrides:** Review and adjust inferred types and requiredness.
- **Zod schema generation:** Generate TypeScript validation schema code.
- **CI validation:** Generate a script that checks required environment-variable presence.
- **Copy and export:** Copy generated output and use the available download functionality.
- **Privacy-first processing:** The application processes configuration input locally in the browser; it does not require an application backend.

## Getting started

### Requirements

- Node.js and npm
- Git (optional, for cloning the repository)

### Installation

```bash
git clone https://github.com/shriram-io/DocuEnv.git
cd DocuEnv
npm install
```

### Run locally

```bash
npm run dev
```

Open the local URL printed by Vite in your browser.

### Verify the project

```bash
npm run test
npm run lint
npm run build
```

## How to use

1. Open DocuEnv.
2. Paste or import your reference configuration, such as `.env.example`.
3. Paste or import the configuration you want to audit.
4. Run the comparison.
5. Review missing, extra, and present variables and any parsing warnings.
6. Review suggested types and adjust the contract where needed.
7. Inspect the generated Zod schema or CI validation script.
8. Copy or download the output using the available controls.

Use placeholder values or compare variable names only whenever possible. Do not paste production secrets unless necessary.

## Privacy and security

DocuEnv is designed to process environment-file contents locally in your browser. Its core functionality does not require a server to receive your configuration values.

Local processing is not an absolute security guarantee. Your browser, extensions, device, and the application bundle still need to be trustworthy. Use caution when handling production secrets.

- Never commit real `.env` files or credentials.
- Keep example files limited to placeholder values.
- Review generated code before using it in production.
- Do not treat inferred types as guaranteed validation rules.

## Supported syntax and limitations

DocuEnv supports common `.env` assignment syntax, comments, and quoted values, with diagnostics for supported parsing errors and edge cases.

It is not intended to implement every dotenv dialect, shell expansion rule, interpolation convention, or deployment-platform-specific behavior. Type inference is advisory and should be reviewed by the user.

The generated CI script checks required key presence; it is not a secret scanner or a complete deployment validation system.

## Technology

- React
- TypeScript
- Vite
- Vitest
- ESLint

## Project documentation

The `docs/` directory contains the project requirements and design documents:

- `01_PRD_DocuEnv.docx` — Product Requirements Document
- `02_SRS_DocuEnv.docx` — Software Requirements Specification
- `03_Architecture_DocuEnv.docx` — Architecture Document
- `04_UI_UX_DocuEnv.docx` — UI/UX Specification
- `05_Development_DocuEnv.docx` — Development Plan
- `rules.md` — Project Rules

## Development checks

Before submitting changes, run the test suite, lint check, and production build. Manually verify the application after deployment, including responsive layouts and privacy-related network behavior.

## License

The project license will be specified in the repository's `LICENSE` file.
