# Changelog

## [0.1.1] - 2026-06-15
### Changed
- **Massive Architectural Upgrade:** Completely migrated the dashboard from Streamlit to a state-of-the-art **React + Vite** Single Page Application.
- **Backend Overhaul:** Replaced the Streamlit runner with a lightning-fast **FastAPI** + **Uvicorn** backend.
- **Rebranding:** Officially changed the CLI command and project branding to **`gitlytics`**.
- **UI/UX Overhaul:** Completely redesigned the dashboard interface with premium dark mode, glassmorphism, animated Recharts, and unified landing screens.
- **PyPI Build Process:** Updated `pyproject.toml` and GitHub Actions to automatically bundle the compiled React frontend into the Python package.

## [0.1.0] - 2026-06-14
### Added
- Initial package release
- Core traffic fetching logic
- CLI commands: fetch, sync, dashboard
- Streamlit dashboard
- GitHub Actions automation template
- PyPI distribution support
