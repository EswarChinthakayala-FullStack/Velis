# Velis — Enterprise Project Management & Secure Client Portal Platform

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

**Velis** is a high-performance, single-owner enterprise project management platform and client portal engine designed for modern full-stack engineers, digital agencies, and software consultants. It features zero-trust security boundaries, cryptographic share links, real-time analytics, and automated GitHub & payment integrations.

---

## Key Features

### 🏢 Single-Owner Administrator System
- **Sole Admin Control**: Restricted access for single-owner project control with zero public registration vulnerabilities.
- **Role-Based RLS**: Database Row-Level Security (RLS) enforcing strict authorization for admin resources versus viewer share links.

### 🌐 Zero-Trust Client Portals
- **Cryptographic Share Links**: Share project deliverables, documents, and updates securely without requiring client signups.
- **SHA-256 Passcode Protection**: Password-protect links with SHA-256 salted password hashes and expiration presets.
- **Granular Scope Controls**: Toggle client download permissions, view analytics, and revoke link access instantly.

### 📊 Real-Time Analytics & KPIs
- **Interactive Dashboards**: Operational metrics, completion velocity, project health, and activity logs powered by Recharts.
- **Storage Metrics**: Dynamic file & media storage tracking across projects, documents, and deliverables.

### 🚀 Integrations & Delivery Modules
- **GitHub Repository Sync**: Real-time integration tracking repository branches, releases, open issues, and pull requests.
- **Payments & Delivery**: Integrated UPI payment links (PhonePe / HDFC) with automated unlock states for client deliverables.
- **Resilient Network Layer**: Custom `resilientFetch` pipeline with HTTP/2 concurrency limiting and backoff retry logic.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 19, TypeScript, Vite |
| **Styling & Motion** | TailwindCSS v4, Framer Motion |
| **Icons & UI** | Hugeicons React, Base UI, Shadcn UI patterns |
| **State Management** | TanStack React Query v5, Zustand |
| **Backend & Database** | Supabase (Postgres, Auth, Realtime, Storage, Edge Functions) |
| **Visualization & Docs** | Recharts, Mermaid.js, React Markdown |

---

## Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** / **pnpm** / **yarn**
- **Supabase Account**: A running Supabase project instance

### 1. Clone the Repository
```bash
git clone https://github.com/EswarChinthakayala-FullStack/Velis.git
cd Velis
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-anon-key

# UPI Payment Gateway Configuration (Optional)
VITE_UPI_PHONEPE=your-upi-id@axl
VITE_UPI_HDFC=your-upi-id@pthdfc
```

### 4. Database Setup & Migrations
Execute the SQL migrations provided in `supabase/migrations/` on your Supabase Postgres database in sequence, or apply `supabase/schema.sql` directly via the Supabase SQL Editor.

```bash
# Using Supabase CLI
supabase db push
```

### 5. Run the Local Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Project Structure

```text
Velis/
├── src/
│   ├── components/       # Shared UI primitives, Modals, Banners & Layouts
│   ├── lib/              # Supabase singleton, utils, resilientFetch & validators
│   ├── modules/          # Feature domains
│   │   ├── auth/         # Single-owner admin authentication & guards
│   │   ├── dashboard/    # KPI metrics, quick insights & activity feeds
│   │   ├── projects/     # Project management CRUD & section builders
│   │   ├── portal/       # Zero-trust client portal & viewer state
│   │   ├── share-links/  # Cryptographic share link generator & analytics
│   │   ├── payments/     # Payment unlock modals & UPI gateway handlers
│   │   └── settings/     # Infrastructure health, profiles & storage queries
│   ├── pages/            # Top-level view routing components
│   ├── router/           # AuthGuard, GuestGuard & React Router v7 definitions
│   └── types/            # Database schema types & TypeScript contracts
├── supabase/
│   ├── functions/        # Deno Edge Functions (validate-share-token, etc.)
│   ├── migrations/       # Imperative Postgres SQL migration scripts
│   └── schema.sql        # Canonical database schema definition
├── vite.config.ts        # Vite build, asset chunking & dev configuration
└── package.json          # Workspace dependencies & scripts
```

---

## Deployment

### Vercel / Netlify
1. Import the repository into **Vercel** or **Netlify**.
2. Set Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Set Build Command: `npm run build`
4. Set Output Directory: `dist`

---

## License

Created and maintained exclusively by **Eswar Chinthakayala**. Distributed under the MIT License.
