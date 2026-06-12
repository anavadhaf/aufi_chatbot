# Architecture

src/

pages/
components/
hooks/
services/
store/
routes/
utils/
assets/

Rules:

Pages:
Contains route pages.

Components:
Reusable UI components.

Services:
API and OAuth related logic.

Store:
Global state using Zustand.

Hooks:
Reusable business logic.

Utils:
Helper functions.

Never place API calls directly inside UI components.
Always use service files.
