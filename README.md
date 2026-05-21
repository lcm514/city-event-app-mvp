# City Event Management App — MVP

> A web-based prototype for the **[COURSE_NAME]** course, demonstrating the core features of the City Event Management App proposed in our project plan. Inspired by **Saudi Vision 2030's Quality of Life Program**.

---

## Project Idea

Saudi Arabia's Vision 2030 has transformed the country into a year-round destination for cultural festivals, sports tournaments, entertainment shows, and family activities. However, residents still rely on a patchwork of social media posts, news sites, and word-of-mouth to discover what's happening around them — and organizers struggle to reach the audiences who would care most.

The **City Event Management App** is a unified platform where citizens and residents can browse, save, and register for city events in one place, while organizers manage listings through a dedicated admin interface. The MVP in this repository demonstrates the end-to-end user and organizer flows — browsing, filtering, favoriting, booking, and managing events — using only client-side technologies.

This project aligns directly with Vision 2030's **Quality of Life Program**, which aims to enhance citizens' lifestyles by making cultural, recreational, and entertainment opportunities effortlessly accessible across every Saudi city.

---

## Features

### For users
- Browse all city events in a responsive card grid (1 / 2 / 3 columns)
- Real-time search by event title
- Filter by category — Cultural, Sports, Entertainment, Educational, Family
- Detailed event view with full description, venue, organizer, and pricing
- Save events to a personal Favorites list (persisted)
- Register for an event with a validated form and ticket count
- View and cancel personal bookings — seats restore automatically

### For administrators
- Password-protected admin mode (default password: `admin123`)
- Dashboard with live stats: total events, total bookings, total favorites, most popular event
- Full table view of all events with at-a-glance seat occupancy
- Add new events with comprehensive client-side validation
- Edit existing events with seat-pool integrity preserved
- Delete events with safe cascade — cleans up related bookings and favorites
- All actions confirmed via toast notifications

### General
- Mobile-first responsive layout (320 px → desktop)
- Keyboard-friendly: Esc closes modals, Enter submits forms, Tab order honored
- ARIA labels, semantic HTML, visible focus states
- Smooth 200 ms transitions, animated toasts, shake-on-error feedback
- All data persists across browser refreshes via `localStorage`

---

## Tech Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Storage:** Browser `localStorage`
- **Icons:** Font Awesome (CDN)
- **Type:** Inter + Poppins (Google Fonts)
- **No backend, no build step, no framework dependencies**

---

## How to Run

1. Clone the repository:
   ```bash
   git clone https://github.com/[GITHUB_USERNAME]/city-event-management-app.git
   cd city-event-management-app
   ```
2. Open `index.html` in any modern browser (Chrome, Firefox, Safari, Edge).
3. The app automatically initializes with **8 sample Saudi-themed events** on first load.

### Admin access

- Click **Admin Mode** in the top-right navigation.
- Password: `admin123`
- Once unlocked, an **Admin** chip appears in the header and a **Dashboard** link appears in the nav.
- Click **Exit Admin** to return to the user view.

### Reset the demo

To wipe the demo data and start fresh, open DevTools → Application → Local Storage and clear the entries beginning with `cea_`, then refresh.

---

## Demo Video

[DEMO_VIDEO_LINK]

---

## Project Structure

```
city-event-management-app/
├── index.html       # Markup for all views + modals (single-page app)
├── style.css        # Design tokens, responsive layout, component styles
├── script.js        # State management, router, render functions, handlers
└── README.md        # This file
```

### `script.js` is organized into clearly labeled sections:

1. Config + constants
2. localStorage wrappers
3. Seed data (first-load only)
4. Utilities (id, escape, dates, prices)
5. Toast notifications
6. Router (`showView`)
7. Render functions (events list, details, favorites, bookings, admin dashboard)
8. Favorites toggle
9. Modal open / close
10. Register (booking) flow
11. Admin login / mode toggle
12. Event form (create / edit)
13. Delete event with safe cascade
14. Delegated click + keyboard listeners
15. Initialization

---

## Saudi Vision 2030 Alignment

This MVP demonstrates how a unified events platform can contribute to:

- **Quality of Life Program** — by making local cultural and entertainment opportunities effortlessly discoverable for every resident.
- **Vibrant Society Pillar** — by increasing citizen participation in cultural, sports, and entertainment activities across all five categories represented in the app.
- **Digital Transformation** — by digitizing municipal event services and giving organizers a self-serve management surface instead of manual coordination.

---

## Browser Support

Tested in:
- Google Chrome 120+
- Firefox 120+
- Safari 17+
- Microsoft Edge 120+

Uses widely supported features only (CSS Grid, Flexbox, `localStorage`, ES6+ syntax, `backdrop-filter`). No polyfills required.

---

## Limitations (intentional for an MVP)

- Single-user simulation — no multi-user accounts, no real authentication.
- No payment integration — paid events show price for display only.
- Admin password is hardcoded — production would use a real auth provider.
- Data lives in `localStorage` — clearing browser storage erases everything.

These would be addressed in subsequent iterations as outlined in the team's project plan.

---

## Team

[TEAM_MEMBERS]

---

## Course

[COURSE_NAME] — [UNIVERSITY_NAME]

Supervised by **[SUPERVISOR_NAME]**
