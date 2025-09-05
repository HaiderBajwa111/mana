# MANA

A modern platform for connecting creators, buyers, and manufacturers in the 3D printing world.

---

## Overview

MANA is a web application you can use in your browser. It helps people who design 3D models, people who want to buy them, and people who print them (makers) to connect in one place.

---

## Getting Started (For Developers)

If you're helping build or test the MANA site, here's how to get started on your own computer:

### 1. Download the Code

```bash
git clone https://github.com/ManaAdmin/MANA_Vercel.git
cd MANA_Vercel
```

### 2. Install the Tools You Need

Run one of these commands to install the software the project needs:

```bash
npm install     # if you use npm
# or
bun install     # if you use bun (an alternative to npm)
```

### 3. Add Your Environment Settings

Make a new file called `.env.local` in the main folder. Paste in the following:

```bash
# Database connection
DATABASE_URL="your-postgresql-connection-string"
DIRECT_URL="your-postgresql-connection-string"

# Supabase setup
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

#

# OpenAI API (for printer verification)
OPENAI_API_KEY="your-openai-api-key"

# Stripe (payments)
STRIPE_SECRET_KEY="sk_test_your_secret_key"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_signing_secret"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your_publishable_key"
```

> **Tip:** Supabase is like a database and user management tool for your app. These keys help your project talk to Supabase.

### 4. Set Up the Database

This step sets up the app's database so it knows what kind of data to expect:

```bash
npx prisma db push
# or
bunx prisma db push
```

### 5. Start the App Locally

To run the project in your browser:

```bash
npm run dev
# or
bun dev
```

Then visit `http://localhost:3000` in your browser to view the app.

---

## How the Project is Organized

All the code lives in the `src/` folder. Here's a simple breakdown:

### `/app`

This is the heart of a Next.js app. Instead of organizing pages in a traditional `pages/` folder, this project uses the newer `app/` directory structure. Here's how it works:

- Each folder in `/app` represents a route in your site. For example, `/app/about/page.tsx` will be shown at `yourdomain.com/about`
- Files named `page.tsx` are the entry points for that route
- Files named `layout.tsx` control the layout and structure (like headers and footers) shared across pages inside that folder
- Server functions like login or data updates live in `/app/actions/`, keeping them separate from the user interface code

This setup makes it easier to scale your app and manage larger feature sets by keeping the code grouped by functionality.

### `/components`

- Reusable pieces of the website like buttons, maps, file uploads, etc.
- Organized into folders by feature (e.g., `/dashboard`, `/upload`)
- Helps keep your UI code clean and consistent

### `/hooks`

- Custom React functions for logic that needs to be reused in multiple places
- Examples: detecting if a user is on mobile, getting their location, checking if they're logged in

### `/lib`

- Utility code and configuration, such as connecting to Supabase or handling onboarding logic
- Keeps your main app code simpler and easier to read

### `/types`

- TypeScript files that define the shapes of data used throughout the app
- This helps catch errors early and improves autocomplete while coding

### `/db`

- Code to set up and connect to your database using Prisma

### `/scripts`

- Handy one-time-use scripts like deleting test users or seeding the database

### `/styles`

- CSS (styling rules) for how the app looks
- Global styles live here, and the project uses Tailwind CSS for layout and design

---

## Tools We're Using

- **Next.js:** A tool that makes fast and flexible websites
- **Supabase:** Stores user accounts and other data
- **Prisma:** Helps organize and talk to our database
- **Tailwind CSS:** Styling the site with utility classes
- **shadcn/ui:** A modern UI component library

---

## How Things Work (Simplified)

### Prisma and the Database

We use **Prisma** to talk to our database:

- **Schema file:** Describes what kind of data we have (users, messages, etc.)
- **Migrations:** Tracks changes to the database setup over time

Common Prisma Commands:

```bash
npx prisma generate        # Get latest changes into the code
npx prisma db push         # Push current schema to database
npx prisma migrate dev     # Create and apply a schema update
npx prisma migrate reset   # Reset the database (for testing)
npx prisma studio          # See the data in a nice web interface
```

### React Hooks

Hooks are little functions that let your site remember things like the user who's logged in, or where the user is located. Example:

```typescript
import useGeolocation from "@/hooks/location/use-geolocation";

const { location, error } = useGeolocation();
```

### Middleware

Middleware is code that runs before showing a page. We use it to check if users are logged in or not.

Example:

```typescript
export async function middleware(request) {
  return await updateSession(request);
}
```

---

## Adding New Features (Step-by-Step)

1. Create UI components in `/components/[feature]`
2. Add logic with custom hooks in `/hooks/`
3. Write backend logic in `/lib` or `/app/actions/`
4. Add data types in `/types`
5. Create new pages in `/app/[route]`

---

## Styling the Site

- Global styles: `/src/app/globals.css`
- Most of the app is styled using Tailwind CSS

---

## Team Tips

- Keep your code clean and modular
- Use clear names for files and folders
- Write comments to explain complex code
- Follow the existing folder structure
- Write everything in TypeScript for safety and clarity

---

## Questions?

If you're not sure how something works, check out the `hooks`, `components`, or `lib` folders—or ask a teammate! The goal is to keep things simple, reusable, and easy to understand for everyone.

---

## Stripe Setup (Boilerplate)

This project includes Stripe boilerplate:

- `src/lib/stripe.ts` initializes the Stripe SDK using `STRIPE_SECRET_KEY`.
- `src/app/actions/billing/ensure-stripe-customer.ts` creates a Stripe Customer for the signed-in user and stores the ID on the `users` row (`stripeCustomerId`).
- `src/app/api/stripe/webhook/route.ts` exposes a webhook endpoint with signature verification.

Recommended local steps:

```bash
# 1) Install Stripe SDK
bun add stripe

# 2) Regenerate Prisma types
bunx prisma generate

# 3) Create and apply migration for `stripeCustomerId` on users
bunx prisma migrate dev --name add_stripe_customer_id

# 4) (Optional) Listen for webhooks during development
stripe listen --forward-to localhost:3000/api/stripe/webhook
# Copy the signing secret and set STRIPE_WEBHOOK_SECRET in .env.local
```

Server action usage example:

```ts
import { ensureStripeCustomerForCurrentUser } from "@/app/actions";

await ensureStripeCustomerForCurrentUser();
```
