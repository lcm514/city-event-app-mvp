# Setup Instructions, Demo Script & Test Plan

This document supplements the project README with the steps the team needs to (1) push the repo to GitHub, (2) record the demo video, and (3) self-test the MVP before submission.

> Replace the placeholders `[GITHUB_USERNAME]`, `[TEAM_MEMBERS]`, `[COURSE_NAME]`, `[UNIVERSITY_NAME]`, `[SUPERVISOR_NAME]`, and `[DEMO_VIDEO_LINK]` in the README before publishing.

---

## 1. Push to GitHub

From the project root (`city-event-management-app/`):

```bash
# 1. Initialize the repo (skip if already initialized)
git init
git branch -M main

# 2. Add and commit
git add index.html style.css script.js README.md SETUP.md
git commit -m "feat: City Event Management App MVP"

# 3. Create the empty repo on github.com first (Public, no README, no .gitignore)
#    Name suggestion: city-event-management-app

# 4. Connect and push
git remote add origin https://github.com/[GITHUB_USERNAME]/city-event-management-app.git
git push -u origin main
```

If you re-run `git init` on an existing folder you do not need to re-commit unchanged files. Verify with `git status` first.

### Useful follow-up commands

```bash
# View commit history
git log --oneline

# Make a quick fix and update
git add -p             # review changes hunk-by-hunk
git commit -m "fix: typo in event description"
git push
```

---

## 2. Demo video script (5–7 minutes)

> Record at 1080p, screen-only with voiceover. Open `index.html` in Chrome before you start.

### Scene 1 — Introduction (0:00 – 0:45)
- Greet the grader, state the course name and team.
- One-sentence project pitch: *"A unified events platform inspired by Saudi Vision 2030's Quality of Life Program — citizens discover events, organizers manage them, no backend required."*
- Mention the tech stack: **HTML, CSS, vanilla JavaScript, localStorage**.

### Scene 2 — Home + browse (0:45 – 1:30)
- Show the hero, search bar, and 8 seeded events.
- Hover one card to demo the lift animation.
- Click a **category chip** ("Sports") to filter — point out the result count updates.
- Type **"AlUla"** in the search bar to demo real-time filtering.

### Scene 3 — Event details (1:30 – 2:15)
- Click a card to open the details view.
- Highlight: hero image, full description, venue, organizer, seat counter, price.
- Toggle the **heart** in the right rail — show the favorites badge in the nav increment.
- Click **Back** to return.

### Scene 4 — Favorites (2:15 – 2:45)
- Click the **Favorites** nav item.
- Show the saved event(s).
- Remove a favorite — show the count decrement instantly.
- Return to Home.

### Scene 5 — Register flow (2:45 – 3:45)
- Click any open event → **Register now**.
- First submit empty — show inline validation errors (red text + red border).
- Fill the form (full name, email, 2 tickets), submit — toast appears, seat count decrements.
- Click **My Bookings** → show the new booking.
- Click **Cancel** → confirm → toast appears, seats restored.

### Scene 6 — Admin mode (3:45 – 5:00)
- Click **Admin Mode** in the nav.
- In the password modal, type a wrong password → modal shakes, inline error appears.
- Type the correct password `admin123` → toast, dashboard opens.
- Walk through the **stats cards** (total events, bookings, favorites, most popular).
- Open the events table — point out the seat occupancy column.
- Click **Add new event** → fill in (e.g. "Saudi National Day Parade", Date: 2026-09-23, Family, 1000 seats, free) → save → toast.
- Click **Edit** on the same row → change the price to 50 → save.
- Click **Delete** on a different event → confirm → show toast + the cascaded cleanup.

### Scene 7 — Persistence + responsiveness (5:00 – 5:45)
- Click **Exit Admin**.
- Refresh the browser tab — point out that events, favorites, and bookings all persist; admin mode resets to OFF.
- Open DevTools → toggle the device toolbar (iPhone size).
- Show the responsive layout: hamburger nav, single-column grid, full-width buttons.

### Scene 8 — Wrap-up (5:45 – 6:30)
- Recap the user vs admin separation.
- Mention the placeholders for team-specific information in the README.
- Thank the supervisor and grader.

---

## 3. Pre-submission test plan

Run through this checklist on a clean Chrome profile (or after clearing `cea_*` localStorage entries) before recording the demo. Tick each item.

| # | Step | Expected result | ✓ |
|---|------|------------------|---|
| 1 | Open `index.html` | Hero loads; 8 events visible | |
| 2 | Type "Riyadh" in search | List filters in real time | |
| 3 | Clear search via the × button | All events return | |
| 4 | Click chip "Sports" | Only Sports events visible | |
| 5 | Click chip "All" | All events return | |
| 6 | Click an event card | Details view opens with cover, meta, description | |
| 7 | Click ♡ in the details sidebar | Heart fills; nav badge shows "1" | |
| 8 | Click **Favorites** in nav | The event appears in the grid | |
| 9 | Click ♡ on the favorited card | Removes from favorites; empty state appears | |
| 10 | Open any open event → Register now → submit empty | Inline errors appear under each required field | |
| 11 | Fill the form (1 ticket) → submit | Toast appears, seats decrement on the card | |
| 12 | Open **My Bookings** | Booking is listed with thumbnail, date, ticket count | |
| 13 | Click **Cancel** on the booking → confirm | Toast appears, seats restore in the events grid | |
| 14 | Click **Admin Mode** → enter `wrong` → submit | Modal shakes; inline error shown | |
| 15 | Enter `admin123` → submit | Admin chip appears; dashboard opens | |
| 16 | Stats cards reflect correct counts | Total events = 8 (or +N if you added), bookings/favorites match | |
| 17 | Click **Add new event** → submit empty | Inline errors on every required field | |
| 18 | Fill the form completely → save | Toast "Event created!"; new row appears in table | |
| 19 | Refresh the browser | Events, favorites, bookings all persist; admin mode is OFF | |
| 20 | Switch to **Home** → confirm new event is visible | Yes | |
| 21 | In admin, click **Edit** on the new event → change title → save | Toast "Event updated!"; row reflects new title | |
| 22 | Click **Delete** on an event with bookings → confirm | Event removed; related bookings/favorites cleaned up | |
| 23 | Click **Exit Admin** | Chip + dashboard link hidden; you return to events list | |
| 24 | Resize browser to mobile width (375 px) | Hamburger menu, single-column grid, full-width buttons | |
| 25 | Open any modal → press **Esc** | Modal closes | |
| 26 | Open DevTools console while clicking around | No red errors | |

### Edge cases worth recording (optional)

- Register twice for the same event with the same email → expect a duplicate-booking warning toast.
- Register on a low-seat event (e.g. one with 1 seat left, edited in admin) → ticket dropdown caps at 1.
- Delete the most-popular event → "Most popular" stat updates to the next highest.

---

## 4. Submitting the deliverable

Final checklist before zipping or pushing:

- [ ] All placeholders in README are filled (or kept as placeholders if instructed)
- [ ] Demo video link added under `## Demo Video`
- [ ] `git status` shows a clean tree
- [ ] Repository is public (or shared with the supervisor)
- [ ] One smoke-test run-through completed
- [ ] Browser DevTools console shows no errors

Good luck.
