# Contributing

1. Fork the repository and create a branch.
2. Use Node.js 24 and run `npm ci`.
3. Start the demo with `npm run dev`; open `/library/` for the playgrounds.
4. Change components in `src/lib`, playground logic in `src/playground`, or documentation in `src/LibraryPage.tsx`.
5. Run `npm test`, `npm run typecheck`, `npm run build:lib`, and `npm run build`.
6. For code generation changes, run `npm run test:examples` to compile generated snippets against the actual library exports.
7. Check narrow and desktop layouts, keyboard navigation, and copied TypeScript before submitting a pull request.

Keep public props documented in the playground tables. Keep generated examples aligned with the real preview. Update holiday data only with a verifiable source and include the source URL in the change description. Preserve third-party notices and license files.

GitHub Pages deploys from `main` through the Pages workflow. Pull requests run checks but do not deploy. Do not commit credentials, local hosting metadata, node_modules, or build output.
