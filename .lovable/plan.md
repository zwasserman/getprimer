

## Home Screen Restructure

### Changes

**1. Rename "Hub" to "Home" in bottom tab bar**
- Update the label in `src/components/BottomTabBar.tsx` from `"Hub"` to `"Home"`

**2. Restructure the Home screen (`src/pages/HubPage.tsx`)**
- Remove the `HubWelcome` component (the big welcome card with "Start Your First Task" CTA)
- Remove the demo toggle button and the `showActive` state / `AnimatePresence` switching logic
- Keep the `HubActive` layout as the single view, with these modifications:
  - **Header**: Keep the greeting area ("Your Home" + address + avatar) as a compact header
  - **Priority section**: Use the same task data from TasksPage (overdue + due tasks) displayed as horizontal scrollable cards matching the Tasks tab card style (190px wide, same layout)
  - Add a **"See all tasks"** link next to the "Priority" heading that navigates to `/tasks`
  - **Recent Activity** and **Progress** sections remain below, unchanged

### Technical Details

**`src/components/BottomTabBar.tsx`**
- Line 6: Change `label: "Hub"` to `label: "Home"`

**`src/pages/HubPage.tsx`**
- Remove `HubWelcome` component entirely
- Remove `useState`, `AnimatePresence` imports (no longer needed)
- Remove the demo toggle button
- Update `comingUpTasks` to include the same overdue/due tasks from TasksPage (tasks with ids 1-3 plus the overdue task id 1 with date 2026-02-05)
- Add `Zap` icon import and expand `comingUpTasks` to match TasksPage data (all non-completed tasks)
- Filter to only show overdue and due-soon tasks in the priority carousel
- Update section header from "Coming Up" to "Priority" with a "See all tasks" link using `ChevronRight` icon, navigating to `/tasks`
- Card width updated to 190px to match Tasks tab cards
- Add `formatDueLabel` helper (same as TasksPage) for consistent due date labels on cards
- The component renders one single view (no toggle, no welcome state)
