# Next.js & Storybook Icon Catalog

This project is a Next.js application integrated with Storybook, featuring an interactive searchable icon catalog containing all **JetBrains** and **Lucide** icons.

## Total Icons: 2,822
- **JetBrains Icons:** 770 icons (from `icons-master/src`)
- **Lucide Icons:** 2,052 icons (from `lucide-main/icons`)

## Features
- **Searchable Icon Gallery:** Real-time search by icon name, tags, or categories.
- **Source Filtering:** Quickly filter between All, JetBrains, or Lucide icons.
- **Preview Canvas Modes:** Switch between Light, Dark, and Grid backgrounds.
- **Quick Copy:** One-click copy for icon names, SVG markup, and JSX snippets.
- **Icon Detail Modal:** Detailed inspect view with tags, full-size preview, and export snippet.
- **High Performance:** Paginated & optimized rendering for smooth browsing of 2,800+ icons.

## Getting Started

### 1. Run Storybook
To explore the icon catalog and component stories in Storybook:
```bash
cd frontend-next
npm run storybook
```
Open [http://localhost:6006](http://localhost:6006) to view the Storybook UI under **Design System > Icon Gallery**.

### 2. Run Next.js Application
To run the Next.js development server:
```bash
cd frontend-next
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the icon gallery directly in the Next.js app.

### 3. Rebuilding Icons
If you add more icons to the download directories, re-run:
```bash
node scripts/prepare-icons.mjs
```
