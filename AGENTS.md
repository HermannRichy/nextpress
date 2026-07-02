<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# Specifications

The project specifications are in NEXTPRESS_V1_SPEC.md

# Package manager & installation

Package manager in this project: pnpm
Dont execute package installation automatically
Do not install packages automatically; I will do it myself.
Do not stop when a package is missing; continue and tell me which package needs to be installed.

# Workflow

Before generating any files, tell me what you plan to do and ask for approval before proceeding.

# Design & UI

Design files is in this folder /nextpress-design-files (solely for inspiration and the implementation of the project's design system)
Tailwind CSS 4.3 for styling (mobile first)
Avoid creating custom classes with Tailwind CSS as much as possible.
For the UI, use shadcn/ui components.
Use tabler/icons packages for all icons in this project

# Year context

The project is being developed in July 2026.
