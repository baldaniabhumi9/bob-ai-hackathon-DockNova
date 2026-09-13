# DockNova Frontend Web Application

React + TypeScript + Vite web client for the DockNova Port Operations Control Center.

## Architecture

- `src/design-system/`: Design system tokens (colors, typography, spacing, radius, shadows, theme).
- `src/components/ui/`: Shared atomic UI components (Button, Card, Badge, Input, Select, Modal, Table, Tabs, ProgressBar).
- `src/components/layout/`: Shared layout components (Sidebar, Header, PageContainer, DashboardLayout).
- `src/layouts/`: Role-based wrapper layouts (AdminLayout, ManagerLayout, UserLayout).
- `src/pages/`: Role-scoped page views (admin, manager, user).
- `src/features/`: Domain feature modules (congestion, vessels, berths, cranes, optimisation, simulation, copilot).
- `src/services/`: API service layers and client integrations.
- `src/store/`: State management context / stores.
- `src/hooks/`: Custom React hooks.
- `src/types/`: Frontend-specific TypeScript definitions.
- `src/utils/`: Helper utilities and formatting functions.

## Development Scripts

```bash
npm install      # Install dependencies
npm run dev      # Start Vite dev server on http://localhost:3000
npm run build    # Type-check and build production bundle
npm run preview  # Preview production build locally
```
