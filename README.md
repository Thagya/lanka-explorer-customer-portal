# Lanka Explorer — Customer Portal

Mobile-first web app for tourists to explore Sri Lanka destinations, book hotels & tours, and manage their trips.  
**University of Kelaniya — SENG 41293**

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React | v19 | UI framework |
| Vite | v8 | Build tool & dev server |
| React Router DOM | v7 | Client-side routing |
| Tailwind CSS | v4 | Utility-first styling |
| Axios | v1 | HTTP API requests |
| Lucide React | v1 | Icons |

---

## Features

- Browse tourist **destinations** (attractions) with map view via OpenStreetMap
- Browse and search **hotels, tours & vehicles** with filters
- User **registration & login** (JWT authentication)
- **Booking flow** — 3-step wizard with date validation and live price calculation
- **Payment proof** upload per booking
- **My Bookings** — track booking status and history
- **My Favourites** — save and manage favourite places and listings
- **Reviews** — read customer reviews on hotels and tours
- Mobile-first design with bottom navigation bar

---

## Project Structure

```
customer-portal/
├── src/
│   ├── main.jsx                    # App entry point
│   ├── App.jsx                     # Routes
│   ├── index.css                   # Tailwind + brand theme
│   ├── api/
│   │   ├── client.js               # Axios instance with JWT interceptor
│   │   ├── attractions.js
│   │   ├── listings.js
│   │   └── bookings.js
│   ├── contexts/
│   │   ├── AuthContext.jsx         # Login / logout / current user
│   │   └── FavouritesContext.jsx   # Saved items state
│   ├── hooks/
│   │   ├── useAttractions.js
│   │   ├── useListings.js
│   │   └── useBookings.js
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Layout.jsx
│   │   │   ├── TopNav.jsx          # Desktop navigation
│   │   │   └── BottomNav.jsx       # Mobile bottom tabs
│   │   ├── ui/
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── Spinner.jsx
│   │   │   └── ImageGallery.jsx
│   │   ├── attractions/
│   │   │   ├── AttractionCard.jsx
│   │   │   ├── AttractionGrid.jsx
│   │   │   └── AttractionFilter.jsx
│   │   ├── listings/
│   │   │   ├── ListingCard.jsx
│   │   │   ├── ListingGrid.jsx
│   │   │   └── ListingFilter.jsx
│   │   └── bookings/
│   │       ├── BookingCard.jsx
│   │       ├── BookingTimeline.jsx
│   │       └── PaymentForm.jsx
│   └── pages/
│       ├── HomePage.jsx
│       ├── LoginPage.jsx
│       ├── ProfilePage.jsx
│       ├── FavouritesPage.jsx
│       ├── attractions/
│       │   ├── AttractionsPage.jsx
│       │   └── AttractionDetailPage.jsx
│       ├── listings/
│       │   ├── ListingsPage.jsx
│       │   └── ListingDetailPage.jsx
│       └── bookings/
│           ├── BookingFormPage.jsx
│           ├── MyBookingsPage.jsx
│           └── BookingDetailPage.jsx
├── index.html
├── vite.config.js
└── package.json
```

---

## Prerequisites

- Node.js v18 or higher — https://nodejs.org
- Lanka Explorer Backend running on http://localhost:5000

---

## Setup & Installation

### 1. Install dependencies

```bash
cd customer-portal
npm install
```

### 2. Environment variable (optional)

By default the app connects to `http://localhost:5000/api`.  
If your backend runs on a different URL, create a `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Start the development server

```bash
npm run dev
```

App runs at: **http://localhost:5173**

### 4. Build for production

```bash
npm run build
```

Output is in the `dist/` folder.

---

## Connecting to the Backend

Make sure the backend API is running before starting the customer portal.  
Start order:

```
1. Start MongoDB (or ensure Atlas is accessible)
2. Start Backend  →  cd lanka-explorer-backend && npm run dev
3. Start Customer Portal  →  cd customer-portal && npm run dev
```

---

## Pages & Routes

| Route | Page | Auth Required |
|---|---|---|
| `/` | Home — featured destinations & listings | No |
| `/attractions` | All destinations with filters | No |
| `/attractions/:id` | Destination detail + map | No |
| `/listings` | Hotels, tours & vehicles | No |
| `/listings/:id` | Listing detail + reviews + Book Now | No |
| `/login` | Login / Register | No |
| `/book/:listingId` | 3-step booking form | Yes |
| `/bookings` | My Bookings & My Favourites tabs | Yes |
| `/bookings/:id` | Booking detail + payment + review | Yes |
| `/favourites` | Saved destinations & listings | Yes |
| `/profile` | Profile & account links | Yes |

---

## Brand Colors

Defined in `src/index.css` using Tailwind v4 `@theme`:

| Token | Hex | Usage |
|---|---|---|
| `teal-500` | `#1F4E4E` | Primary — buttons, nav, headings |
| `teal-400` | `#2a6b6b` | Hover states |
| `teal-600` | `#163838` | Active / pressed |
| `sand` | `#FAF6F0` | Page background |
| `terracotta` | `#E07856` | Accent |
| `gold` | `#C9A96A` | Stars, highlights |

---

## Default Login (Demo)

| Field | Value |
|---|---|
| Email | nimal@example.com |
| Password | demo1234 |
