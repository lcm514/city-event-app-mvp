/* ==========================================================================
   City Event Management App — MVP application logic
   Vanilla ES6+, single-namespace IIFE, localStorage-backed.
   ========================================================================== */

(function () {
  'use strict';

  // ==========================================================================
  // 1. CONFIG + CONSTANTS
  // ==========================================================================

  const STORAGE_KEYS = {
    events: 'cea_events',
    favorites: 'cea_favorites',
    bookings: 'cea_bookings',
    adminMode: 'cea_adminMode',
  };

  const ADMIN_PASSWORD = 'admin123';
  const CATEGORIES = ['Cultural', 'Sports', 'Entertainment', 'Educational', 'Family'];
  const VIEWS = ['view-events', 'view-event-details', 'view-favorites', 'view-bookings', 'view-admin'];

  const state = {
    currentView: 'view-events',
    search: '',
    category: 'all',
    pendingDeleteId: null,
    adminMode: false,
  };

  // ==========================================================================
  // 2. STATE / LOCALSTORAGE WRAPPERS
  // ==========================================================================

  function readStore(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return fallback;
      return JSON.parse(raw);
    } catch (err) {
      console.warn(`[CEA] Failed to read ${key} from storage`, err);
      return fallback;
    }
  }

  function writeStore(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.warn(`[CEA] Failed to write ${key} to storage`, err);
    }
  }

  function getEvents() {
    return readStore(STORAGE_KEYS.events, []);
  }

  function saveEvents(events) {
    writeStore(STORAGE_KEYS.events, events);
  }

  function getFavorites() {
    return readStore(STORAGE_KEYS.favorites, []);
  }

  function saveFavorites(ids) {
    writeStore(STORAGE_KEYS.favorites, ids);
  }

  function getBookings() {
    return readStore(STORAGE_KEYS.bookings, []);
  }

  function saveBookings(bookings) {
    writeStore(STORAGE_KEYS.bookings, bookings);
  }

  // ==========================================================================
  // 3. SEED DATA (first-load only)
  // ==========================================================================

  function buildSeedEvents() {
    const now = new Date().toISOString();
    const seed = [
      {
        id: 'evt_1',
        title: 'Riyadh Season — Opening Night',
        description:
          'Kick off the season with a spectacular live show, drone displays, and headline acts at Boulevard City. A night-long celebration of music, light, and Saudi creativity.',
        date: '2026-10-15',
        time: '19:00',
        venue: 'Boulevard City, Riyadh',
        organizer: 'General Entertainment Authority',
        category: 'Entertainment',
        totalSeats: 5000,
        availableSeats: 4823,
        price: 150,
      },
      {
        id: 'evt_2',
        title: 'Janadriyah Heritage Festival',
        description:
          'Saudi Arabia\'s flagship cultural festival returns to Diriyah with traditional crafts, regional cuisine, folk performances, and storytelling pavilions from every province.',
        date: '2026-11-02',
        time: '16:00',
        venue: 'Diriyah Cultural District',
        organizer: 'Ministry of Culture',
        category: 'Cultural',
        totalSeats: 8000,
        availableSeats: 7200,
        price: 0,
      },
      {
        id: 'evt_3',
        title: 'Saudi Cup 2026',
        description:
          'The world\'s richest horse race returns with international jockeys, premier-class racing, and a full evening of family entertainment around the track.',
        date: '2026-02-28',
        time: '17:30',
        venue: 'King Abdulaziz Racetrack, Riyadh',
        organizer: 'Jockey Club of Saudi Arabia',
        category: 'Sports',
        totalSeats: 12000,
        availableSeats: 9450,
        price: 200,
      },
      {
        id: 'evt_4',
        title: 'AlUla Skies — Stargazing Night',
        description:
          'Escape the city lights for a guided stargazing experience under AlUla\'s desert sky. Telescopes, expert astronomers, and a quiet bonfire dinner included.',
        date: '2026-09-12',
        time: '20:00',
        venue: 'Gharameel Nature Reserve, AlUla',
        organizer: 'Royal Commission for AlUla',
        category: 'Family',
        totalSeats: 200,
        availableSeats: 184,
        price: 0,
      },
      {
        id: 'evt_5',
        title: 'Future Investment Initiative',
        description:
          'Global leaders, founders, and investors converge in Riyadh for three days of stage talks, workshops, and 1:1 meetings shaping the future economy.',
        date: '2026-10-28',
        time: '09:00',
        venue: 'King Abdulaziz International Conference Centre',
        organizer: 'Public Investment Fund',
        category: 'Educational',
        totalSeats: 3000,
        availableSeats: 2870,
        price: 0,
      },
      {
        id: 'evt_6',
        title: 'Diriyah Tennis Cup',
        description:
          'Watch top ATP players battle it out at the historic Diriyah Arena. Premium hospitality, family stands, and post-match meet-and-greets every night.',
        date: '2026-12-05',
        time: '18:00',
        venue: 'Diriyah Arena',
        organizer: 'Diriyah Gate Development Authority',
        category: 'Sports',
        totalSeats: 4500,
        availableSeats: 4120,
        price: 300,
      },
      {
        id: 'evt_7',
        title: 'Jeddah Season Beach Festival',
        description:
          'A two-week celebration on Jeddah Corniche with water sports, beach concerts, food markets, and kid-friendly zones running every weekend.',
        date: '2026-07-10',
        time: '15:00',
        venue: 'Jeddah Corniche',
        organizer: 'Jeddah Season',
        category: 'Family',
        totalSeats: 10000,
        availableSeats: 8600,
        price: 0,
      },
      {
        id: 'evt_8',
        title: 'MDLBEAST Soundstorm',
        description:
          'The Middle East\'s biggest music festival returns to Banban with global headliners, immersive stages, and four nights of nonstop performances.',
        date: '2026-12-12',
        time: '20:00',
        venue: 'Banban, Riyadh',
        organizer: 'MDLBEAST',
        category: 'Entertainment',
        totalSeats: 60000,
        availableSeats: 54300,
        price: 350,
      },
    ];

    return seed.map((e) => ({
      ...e,
      imageUrl: `https://picsum.photos/seed/${e.id}/800/500`,
      createdAt: now,
    }));
  }

  function seedIfNeeded() {
    if (localStorage.getItem(STORAGE_KEYS.events) === null) {
      saveEvents(buildSeedEvents());
    }
    if (localStorage.getItem(STORAGE_KEYS.favorites) === null) {
      saveFavorites([]);
    }
    if (localStorage.getItem(STORAGE_KEYS.bookings) === null) {
      saveBookings([]);
    }
  }

  // ==========================================================================
  // 4. UTILITIES
  // ==========================================================================

  function generateId(prefix) {
    return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
  }

  function escapeHtml(value) {
    if (value === null || value === undefined) return '';
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
  }

  function formatDate(iso) {
    if (!iso) return '';
    const date = new Date(`${iso}T00:00:00`);
    if (Number.isNaN(date.getTime())) return iso;
    return date.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  function formatTime(time) {
    if (!time) return '';
    const [hStr, mStr] = time.split(':');
    const h = parseInt(hStr, 10);
    const m = parseInt(mStr, 10);
    if (Number.isNaN(h) || Number.isNaN(m)) return time;
    const period = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    return `${hour12}:${String(m).padStart(2, '0')} ${period}`;
  }

  function formatPrice(price) {
    const num = Number(price);
    if (!num || num <= 0) return 'Free';
    return `${num} SAR`;
  }

  function eventImage(event) {
    if (event.imageUrl && event.imageUrl.trim()) return event.imageUrl;
    return `https://picsum.photos/seed/${encodeURIComponent(event.id)}/800/500`;
  }

  // ==========================================================================
  // 5. TOASTS
  // ==========================================================================

  function showToast(message, opts) {
    const options = opts || {};
    const type = options.type || 'info';
    const title = options.title;

    const stack = document.getElementById('toast-stack');
    if (!stack) return;

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.setAttribute('role', type === 'danger' ? 'alert' : 'status');

    const icon = {
      success: 'fa-circle-check',
      danger: 'fa-circle-exclamation',
      warning: 'fa-triangle-exclamation',
      info: 'fa-circle-info',
    }[type];

    toast.innerHTML = `
      <i class="fa-solid ${icon} toast__icon" aria-hidden="true"></i>
      <div class="toast__body">
        ${title ? `<div class="toast__title">${escapeHtml(title)}</div>` : ''}
        <div>${escapeHtml(message)}</div>
      </div>
    `;

    stack.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('is-leaving');
      setTimeout(() => toast.remove(), 240);
    }, 3000);
  }

  // ==========================================================================
  // 6. ROUTER (view toggling)
  // ==========================================================================

  function showView(viewId) {
    if (!VIEWS.includes(viewId)) return;
    state.currentView = viewId;

    VIEWS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      if (id === viewId) {
        el.removeAttribute('hidden');
      } else {
        el.setAttribute('hidden', '');
      }
    });

    if (viewId === 'view-events') renderEventsList();
    if (viewId === 'view-favorites') renderFavorites();
    if (viewId === 'view-bookings') renderBookings();
    if (viewId === 'view-admin') {
      if (!state.adminMode) {
        showView('view-events');
        return;
      }
      renderAdminDashboard();
    }

    document.querySelectorAll('.nav__btn').forEach((btn) => {
      btn.classList.remove('is-current');
    });
    const actionMap = {
      'view-events': 'show-events',
      'view-favorites': 'show-favorites',
      'view-bookings': 'show-bookings',
      'view-admin': 'show-admin',
    };
    const action = actionMap[viewId];
    if (action) {
      const navBtn = document.querySelector(`.nav__btn[data-action="${action}"]`);
      if (navBtn) navBtn.classList.add('is-current');
    }

    document.getElementById('nav')?.classList.remove('is-open');
    document.querySelector('.nav-toggle')?.setAttribute('aria-expanded', 'false');

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ==========================================================================
  // 7. RENDER FUNCTIONS
  // ==========================================================================

  function renderFavoritesBadge() {
    const count = getFavorites().length;
    const badge = document.getElementById('favorites-badge');
    if (!badge) return;
    badge.textContent = count;
    if (count > 0) {
      badge.removeAttribute('hidden');
    } else {
      badge.setAttribute('hidden', '');
    }
  }

  function renderEventsList() {
    const events = getEvents();
    const favorites = getFavorites();
    const grid = document.getElementById('events-grid');
    const empty = document.getElementById('events-empty');
    const countEl = document.getElementById('results-count');
    const titleEl = document.getElementById('results-title');
    if (!grid || !empty) return;

    const query = state.search.trim().toLowerCase();
    let filtered = events;

    if (state.category !== 'all') {
      filtered = filtered.filter((e) => e.category === state.category);
    }
    if (query) {
      filtered = filtered.filter((e) => e.title.toLowerCase().includes(query));
    }

    filtered = filtered
      .slice()
      .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

    if (countEl) {
      countEl.textContent = `${filtered.length} ${filtered.length === 1 ? 'event' : 'events'}`;
    }
    if (titleEl) {
      titleEl.textContent =
        state.category === 'all' ? 'All events' : `${state.category} events`;
    }

    if (filtered.length === 0) {
      grid.innerHTML = '';
      empty.removeAttribute('hidden');
      return;
    }
    empty.setAttribute('hidden', '');

    grid.innerHTML = filtered
      .map((event) => buildCardHTML(event, favorites.includes(event.id)))
      .join('');
  }

  function buildCardHTML(event, isFavorite) {
    const soldOut = event.availableSeats <= 0;
    const lowSeats = !soldOut && event.availableSeats / event.totalSeats < 0.15;
    const priceLabel = formatPrice(event.price);
    const isFree = !event.price || event.price <= 0;

    return `
      <article class="card" data-event-id="${escapeHtml(event.id)}" data-action="open-details" tabindex="0">
        <div class="card__cover">
          <img src="${escapeHtml(eventImage(event))}" alt="${escapeHtml(event.title)}" loading="lazy" />
          ${soldOut ? '<span class="card__sold-out">Sold out</span>' : ''}
          <button
            class="card__heart ${isFavorite ? 'is-active' : ''}"
            data-action="toggle-favorite"
            data-event-id="${escapeHtml(event.id)}"
            aria-label="${isFavorite ? 'Remove from favorites' : 'Add to favorites'}"
            aria-pressed="${isFavorite}"
          >
            <i class="fa-${isFavorite ? 'solid' : 'regular'} fa-heart" aria-hidden="true"></i>
          </button>
        </div>
        <div class="card__body">
          <span class="card__cat cat-${escapeHtml(event.category)}">${escapeHtml(event.category)}</span>
          <h3 class="card__title">${escapeHtml(event.title)}</h3>
          <div class="card__meta">
            <span><i class="fa-regular fa-calendar" aria-hidden="true"></i>${escapeHtml(formatDate(event.date))} · ${escapeHtml(formatTime(event.time))}</span>
            <span><i class="fa-solid fa-location-dot" aria-hidden="true"></i>${escapeHtml(event.venue)}</span>
          </div>
          <div class="card__row">
            <span class="card__price ${isFree ? 'card__price--free' : ''}">${escapeHtml(priceLabel)}</span>
            <span class="card__seats ${lowSeats ? 'card__seats--low' : ''}">${
              soldOut
                ? 'Sold out'
                : `${event.availableSeats.toLocaleString()} seats left`
            }</span>
          </div>
        </div>
      </article>
    `;
  }

  function renderEventDetails(eventId) {
    const events = getEvents();
    const event = events.find((e) => e.id === eventId);
    const container = document.getElementById('view-event-details');
    if (!container) return;

    if (!event) {
      container.innerHTML = `
        <div class="empty">
          <i class="fa-regular fa-calendar-xmark" aria-hidden="true"></i>
          <h3>Event not found</h3>
          <p>It may have been removed.</p>
          <button class="btn btn--primary" data-action="show-events">Back to events</button>
        </div>
      `;
      showView('view-event-details');
      return;
    }

    const isFavorite = getFavorites().includes(event.id);
    const soldOut = event.availableSeats <= 0;
    const isFree = !event.price || event.price <= 0;

    container.innerHTML = `
      <div class="details">
        <button class="back" data-action="show-events" aria-label="Back to events">
          <i class="fa-solid fa-arrow-left" aria-hidden="true"></i> Back to events
        </button>
        <div class="details__cover">
          <img src="${escapeHtml(eventImage(event))}" alt="${escapeHtml(event.title)}" />
          <div class="details__cover-overlay"></div>
          <div class="details__cover-content">
            <span class="card__cat cat-${escapeHtml(event.category)}">${escapeHtml(event.category)}</span>
            <h1 id="details-title-h">${escapeHtml(event.title)}</h1>
          </div>
        </div>

        <div class="details__layout">
          <div class="details__main">
            <div class="details__meta">
              <div class="details__meta-item">
                <span class="label">Date</span>
                <span class="value"><i class="fa-regular fa-calendar" aria-hidden="true"></i>${escapeHtml(formatDate(event.date))}</span>
              </div>
              <div class="details__meta-item">
                <span class="label">Time</span>
                <span class="value"><i class="fa-regular fa-clock" aria-hidden="true"></i>${escapeHtml(formatTime(event.time))}</span>
              </div>
              <div class="details__meta-item">
                <span class="label">Venue</span>
                <span class="value"><i class="fa-solid fa-location-dot" aria-hidden="true"></i>${escapeHtml(event.venue)}</span>
              </div>
              <div class="details__meta-item">
                <span class="label">Organizer</span>
                <span class="value"><i class="fa-regular fa-building" aria-hidden="true"></i>${escapeHtml(event.organizer)}</span>
              </div>
            </div>
            <div class="details__description">
              <h3>About this event</h3>
              <p>${escapeHtml(event.description)}</p>
            </div>
          </div>

          <aside class="details__sidebar">
            <div class="details__price-row">
              <div>
                <span class="details__price ${isFree ? 'details__price--free' : ''}">${escapeHtml(formatPrice(event.price))}</span>
                <div class="details__seats">
                  ${soldOut ? 'Sold out' : `${event.availableSeats.toLocaleString()} of ${event.totalSeats.toLocaleString()} seats left`}
                </div>
              </div>
            </div>
            <div class="details__actions">
              <button class="btn btn--primary" data-action="open-register" data-event-id="${escapeHtml(event.id)}" ${soldOut ? 'disabled' : ''}>
                <i class="fa-solid fa-ticket" aria-hidden="true"></i>
                ${soldOut ? 'Sold out' : 'Register now'}
              </button>
              <button class="btn btn--ghost" data-action="toggle-favorite" data-event-id="${escapeHtml(event.id)}">
                <i class="fa-${isFavorite ? 'solid' : 'regular'} fa-heart" aria-hidden="true"></i>
                ${isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              </button>
            </div>
          </aside>
        </div>
      </div>
    `;

    showView('view-event-details');
  }

  function renderFavorites() {
    const events = getEvents();
    const favoriteIds = getFavorites();
    const favorites = events.filter((e) => favoriteIds.includes(e.id));

    const grid = document.getElementById('favorites-grid');
    const empty = document.getElementById('favorites-empty');
    if (!grid || !empty) return;

    if (favorites.length === 0) {
      grid.innerHTML = '';
      empty.removeAttribute('hidden');
      return;
    }
    empty.setAttribute('hidden', '');
    grid.innerHTML = favorites.map((e) => buildCardHTML(e, true)).join('');
  }

  function renderBookings() {
    const events = getEvents();
    const bookings = getBookings();
    const list = document.getElementById('bookings-list');
    const empty = document.getElementById('bookings-empty');
    if (!list || !empty) return;

    if (bookings.length === 0) {
      list.innerHTML = '';
      empty.removeAttribute('hidden');
      return;
    }
    empty.setAttribute('hidden', '');

    list.innerHTML = bookings
      .slice()
      .sort((a, b) => b.bookedAt.localeCompare(a.bookedAt))
      .map((booking) => {
        const event = events.find((e) => e.id === booking.eventId);
        if (!event) {
          return `
            <article class="booking" data-booking-id="${escapeHtml(booking.id)}">
              <div class="booking__thumb" style="background:var(--surface-alt);"></div>
              <div class="booking__body">
                <p class="booking__title">Event no longer available</p>
                <div class="booking__meta">
                  <span><i class="fa-regular fa-user" aria-hidden="true"></i>${escapeHtml(booking.fullName)}</span>
                </div>
              </div>
              <button class="btn btn--ghost" data-action="cancel-booking" data-booking-id="${escapeHtml(booking.id)}">
                <i class="fa-solid fa-xmark" aria-hidden="true"></i> Cancel
              </button>
            </article>
          `;
        }
        return `
          <article class="booking" data-booking-id="${escapeHtml(booking.id)}">
            <img class="booking__thumb" src="${escapeHtml(eventImage(event))}" alt="${escapeHtml(event.title)}" loading="lazy" />
            <div class="booking__body">
              <p class="booking__title" data-action="open-details" data-event-id="${escapeHtml(event.id)}">${escapeHtml(event.title)}</p>
              <div class="booking__meta">
                <span><i class="fa-regular fa-calendar" aria-hidden="true"></i>${escapeHtml(formatDate(event.date))} · ${escapeHtml(formatTime(event.time))}</span>
                <span><i class="fa-solid fa-location-dot" aria-hidden="true"></i>${escapeHtml(event.venue)}</span>
                <span><span class="booking__tickets"><i class="fa-solid fa-ticket" aria-hidden="true"></i>${booking.tickets} ${booking.tickets === 1 ? 'ticket' : 'tickets'}</span></span>
              </div>
            </div>
            <button class="btn btn--ghost" data-action="cancel-booking" data-booking-id="${escapeHtml(booking.id)}">
              <i class="fa-solid fa-xmark" aria-hidden="true"></i> Cancel
            </button>
          </article>
        `;
      })
      .join('');
  }

  function renderAdminDashboard() {
    const events = getEvents();
    const bookings = getBookings();
    const favorites = getFavorites();

    const statsEl = document.getElementById('stats-grid');
    const countEl = document.getElementById('admin-count');
    if (countEl) {
      countEl.textContent = `${events.length} ${events.length === 1 ? 'event' : 'events'}`;
    }

    const bookedByEvent = bookings.reduce((acc, b) => {
      acc[b.eventId] = (acc[b.eventId] || 0) + b.tickets;
      return acc;
    }, {});
    let popularId = null;
    let popularCount = 0;
    Object.keys(bookedByEvent).forEach((id) => {
      if (bookedByEvent[id] > popularCount) {
        popularCount = bookedByEvent[id];
        popularId = id;
      }
    });
    const popular = popularId ? events.find((e) => e.id === popularId) : null;
    const popularTitle = popular ? popular.title : '—';

    if (statsEl) {
      statsEl.innerHTML = `
        <div class="stat stat--hero">
          <p class="stat__label">Total events</p>
          <p class="stat__value">${events.length}</p>
          <p class="stat__sub">Across ${CATEGORIES.length} categories</p>
        </div>
        <div class="stat">
          <p class="stat__label">Total bookings</p>
          <p class="stat__value">${bookings.length}</p>
          <p class="stat__sub">${bookings.reduce((s, b) => s + b.tickets, 0)} tickets sold</p>
        </div>
        <div class="stat">
          <p class="stat__label">Total favorites</p>
          <p class="stat__value">${favorites.length}</p>
          <p class="stat__sub">Saved by users</p>
        </div>
        <div class="stat">
          <p class="stat__label">Most popular</p>
          <p class="stat__value" style="font-size:18px;line-height:1.2;">${escapeHtml(popularTitle)}</p>
          <p class="stat__sub">${popularCount > 0 ? popularCount + ' tickets booked' : 'No bookings yet'}</p>
        </div>
      `;
    }

    const tbody = document.getElementById('admin-table-body');
    if (!tbody) return;

    if (events.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align:center;padding:36px;color:var(--text-muted);">
            No events yet. Click "Add new event" to create one.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = events
      .slice()
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((event) => {
        const booked = event.totalSeats - event.availableSeats;
        return `
          <tr data-event-id="${escapeHtml(event.id)}">
            <td><img class="admin-table__thumb" src="${escapeHtml(eventImage(event))}" alt="" /></td>
            <td><span class="admin-table__title" data-action="open-details" data-event-id="${escapeHtml(event.id)}">${escapeHtml(event.title)}</span></td>
            <td>${escapeHtml(formatDate(event.date))}<br /><span style="color:var(--text-muted);font-size:12px;">${escapeHtml(formatTime(event.time))}</span></td>
            <td><span class="card__cat cat-${escapeHtml(event.category)}">${escapeHtml(event.category)}</span></td>
            <td>${booked} / ${event.totalSeats}</td>
            <td class="col-actions">
              <span class="admin-table__actions">
                <button class="row-action" data-action="open-event-form" data-mode="edit" data-event-id="${escapeHtml(event.id)}">
                  <i class="fa-solid fa-pen" aria-hidden="true"></i> Edit
                </button>
                <button class="row-action row-action--danger" data-action="confirm-delete" data-event-id="${escapeHtml(event.id)}">
                  <i class="fa-solid fa-trash" aria-hidden="true"></i> Delete
                </button>
              </span>
            </td>
          </tr>
        `;
      })
      .join('');
  }

  // ==========================================================================
  // 8. FAVORITES
  // ==========================================================================

  function toggleFavorite(eventId) {
    if (!eventId) return;
    const favorites = getFavorites();
    const idx = favorites.indexOf(eventId);
    let nextFavorites;
    let added;

    if (idx === -1) {
      nextFavorites = favorites.concat(eventId);
      added = true;
    } else {
      nextFavorites = favorites.slice(0, idx).concat(favorites.slice(idx + 1));
      added = false;
    }

    saveFavorites(nextFavorites);
    renderFavoritesBadge();

    if (state.currentView === 'view-events') renderEventsList();
    if (state.currentView === 'view-favorites') renderFavorites();
    if (state.currentView === 'view-event-details') {
      const detailsBtn = document.querySelector(
        '#view-event-details [data-action="open-register"], #view-event-details [data-action="toggle-favorite"]',
      );
      if (detailsBtn) {
        const id = detailsBtn.getAttribute('data-event-id');
        if (id) renderEventDetails(id);
      }
    }

    showToast(added ? 'Saved to your favorites' : 'Removed from favorites', {
      type: added ? 'success' : 'info',
    });
  }

  // ==========================================================================
  // 9. MODAL OPEN / CLOSE
  // ==========================================================================

  function openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    const focusable = modal.querySelector(
      'input, select, textarea, button:not(.modal__close):not(.modal__backdrop)',
    );
    if (focusable) {
      setTimeout(() => focusable.focus(), 50);
    }
  }

  function closeModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.setAttribute('hidden', '');
    const anyOpen = document.querySelectorAll('.modal:not([hidden])').length > 0;
    if (!anyOpen) {
      document.body.style.overflow = '';
    }
    clearFormErrors(modal);
  }

  function clearFormErrors(scope) {
    scope.querySelectorAll('.form__field.has-error').forEach((f) => f.classList.remove('has-error'));
    scope.querySelectorAll('.form__error').forEach((e) => (e.textContent = ''));
  }

  function setFieldError(inputId, message) {
    const input = document.getElementById(inputId);
    if (!input) return;
    const field = input.closest('.form__field');
    if (field) field.classList.add('has-error');
    const errorEl = document.querySelector(`[data-error-for="${inputId}"]`);
    if (errorEl) errorEl.textContent = message;
  }

  function clearFieldError(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;
    const field = input.closest('.form__field');
    if (field) field.classList.remove('has-error');
    const errorEl = document.querySelector(`[data-error-for="${inputId}"]`);
    if (errorEl) errorEl.textContent = '';
  }

  // ==========================================================================
  // 10. REGISTER (booking)
  // ==========================================================================

  function openRegisterModal(eventId) {
    const event = getEvents().find((e) => e.id === eventId);
    if (!event) {
      showToast('Event not found.', { type: 'danger' });
      return;
    }
    if (event.availableSeats <= 0) {
      showToast('This event is sold out.', { type: 'warning' });
      return;
    }

    document.getElementById('register-event-id').value = event.id;
    const summary = document.getElementById('register-summary');
    if (summary) {
      summary.innerHTML = `
        <strong>${escapeHtml(event.title)}</strong>
        <span>${escapeHtml(formatDate(event.date))} · ${escapeHtml(formatTime(event.time))} · ${escapeHtml(event.venue)}</span>
      `;
    }

    document.getElementById('register-form').reset();
    document.getElementById('register-event-id').value = event.id;

    const ticketsSelect = document.getElementById('register-tickets');
    const maxTickets = Math.min(5, event.availableSeats);
    ticketsSelect.innerHTML = '';
    for (let i = 1; i <= maxTickets; i++) {
      const opt = document.createElement('option');
      opt.value = i;
      opt.textContent = i;
      ticketsSelect.appendChild(opt);
    }

    openModal('modal-register');
  }

  function handleRegisterSubmit(e) {
    e.preventDefault();
    const form = e.target;
    clearFormErrors(form);

    const eventId = document.getElementById('register-event-id').value;
    const name = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const phone = document.getElementById('register-phone').value.trim();
    const tickets = parseInt(document.getElementById('register-tickets').value, 10);

    let valid = true;
    if (!name) {
      setFieldError('register-name', 'Please enter your full name.');
      valid = false;
    }
    if (!email) {
      setFieldError('register-email', 'Please enter your email.');
      valid = false;
    } else if (!validateEmail(email)) {
      setFieldError('register-email', 'Please enter a valid email address.');
      valid = false;
    }
    if (!tickets || tickets < 1 || tickets > 5) {
      setFieldError('register-tickets', 'Please select between 1 and 5 tickets.');
      valid = false;
    }
    if (!valid) return;

    const events = getEvents();
    const event = events.find((ev) => ev.id === eventId);
    if (!event) {
      showToast('Event not found.', { type: 'danger' });
      closeModal('modal-register');
      return;
    }
    if (event.availableSeats < tickets) {
      setFieldError('register-tickets', `Only ${event.availableSeats} seats left.`);
      return;
    }

    const bookings = getBookings();
    const duplicate = bookings.find(
      (b) => b.eventId === eventId && b.email.toLowerCase() === email.toLowerCase(),
    );
    if (duplicate) {
      setFieldError(
        'register-email',
        'This email already has a booking for this event.',
      );
      showToast('You already have a booking for this event with this email.', {
        type: 'warning',
        title: 'Duplicate booking',
      });
      return;
    }

    event.availableSeats -= tickets;
    saveEvents(events);

    const booking = {
      id: generateId('bk'),
      eventId,
      fullName: name,
      email,
      phone,
      tickets,
      bookedAt: new Date().toISOString(),
    };
    saveBookings(bookings.concat(booking));

    closeModal('modal-register');
    showToast('Check "My Bookings" for details.', {
      title: 'Registered successfully!',
      type: 'success',
    });

    if (state.currentView === 'view-event-details') {
      renderEventDetails(eventId);
    } else if (state.currentView === 'view-events') {
      renderEventsList();
    } else if (state.currentView === 'view-favorites') {
      renderFavorites();
    } else if (state.currentView === 'view-admin') {
      renderAdminDashboard();
    }
  }

  function cancelBooking(bookingId) {
    if (!bookingId) return;
    const bookings = getBookings();
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return;

    const events = getEvents();
    const event = events.find((e) => e.id === booking.eventId);
    if (event) {
      event.availableSeats = Math.min(
        event.totalSeats,
        event.availableSeats + booking.tickets,
      );
      saveEvents(events);
    }

    const next = bookings.filter((b) => b.id !== bookingId);
    saveBookings(next);

    showToast('Booking cancelled. Seats restored.', { type: 'info' });
    renderBookings();
    if (state.currentView === 'view-admin') renderAdminDashboard();
  }

  // ==========================================================================
  // 11. ADMIN LOGIN / MODE
  // ==========================================================================

  function toggleAdmin() {
    if (state.adminMode) {
      state.adminMode = false;
      writeStore(STORAGE_KEYS.adminMode, false);
      updateAdminChrome();
      showToast('Exited admin mode.', { type: 'info' });
      if (state.currentView === 'view-admin') showView('view-events');
    } else {
      const form = document.getElementById('admin-login-form');
      if (form) form.reset();
      const modal = document.getElementById('modal-admin-login');
      if (modal) clearFormErrors(modal);
      openModal('modal-admin-login');
    }
  }

  function handleAdminLogin(e) {
    e.preventDefault();
    const form = e.target;
    clearFormErrors(form);
    const input = document.getElementById('admin-password');
    const password = input.value;

    if (password !== ADMIN_PASSWORD) {
      setFieldError('admin-password', 'Incorrect password. Try again.');
      const panel = document.querySelector('#modal-admin-login .modal__panel');
      if (panel) {
        panel.classList.remove('is-shaking');
        void panel.offsetWidth;
        panel.classList.add('is-shaking');
      }
      input.focus();
      input.select?.();
      return;
    }

    state.adminMode = true;
    writeStore(STORAGE_KEYS.adminMode, true);
    updateAdminChrome();
    closeModal('modal-admin-login');
    showToast('Welcome, organizer.', { title: 'Admin mode enabled', type: 'success' });
    showView('view-admin');
  }

  function updateAdminChrome() {
    const chip = document.getElementById('admin-chip');
    const link = document.getElementById('nav-admin-link');
    const toggleBtn = document.getElementById('admin-toggle-btn');
    const toggleLabel = document.getElementById('admin-toggle-label');
    const toggleIcon = toggleBtn?.querySelector('i');

    if (state.adminMode) {
      chip?.removeAttribute('hidden');
      link?.removeAttribute('hidden');
      if (toggleLabel) toggleLabel.textContent = 'Exit Admin';
      if (toggleIcon) {
        toggleIcon.classList.remove('fa-lock');
        toggleIcon.classList.add('fa-right-from-bracket');
      }
      toggleBtn?.classList.add('is-active');
    } else {
      chip?.setAttribute('hidden', '');
      link?.setAttribute('hidden', '');
      if (toggleLabel) toggleLabel.textContent = 'Admin Mode';
      if (toggleIcon) {
        toggleIcon.classList.remove('fa-right-from-bracket');
        toggleIcon.classList.add('fa-lock');
      }
      toggleBtn?.classList.remove('is-active');
    }
  }

  // ==========================================================================
  // 12. EVENT FORM (CREATE / EDIT)
  // ==========================================================================

  let eventFormDirty = false;

  function openEventForm(mode, eventId) {
    const form = document.getElementById('event-form');
    if (!form) return;
    const modal = document.getElementById('modal-event-form');
    if (modal) clearFormErrors(modal);
    form.reset();
    eventFormDirty = false;

    const kicker = document.getElementById('event-form-kicker');
    const title = document.getElementById('event-form-title');

    if (mode === 'edit' && eventId) {
      const event = getEvents().find((e) => e.id === eventId);
      if (!event) {
        showToast('Event not found.', { type: 'danger' });
        return;
      }
      if (kicker) kicker.textContent = 'Editing event';
      if (title) title.textContent = `Edit "${event.title}"`;
      document.getElementById('event-id').value = event.id;
      document.getElementById('event-title').value = event.title;
      document.getElementById('event-description').value = event.description;
      document.getElementById('event-date').value = event.date;
      document.getElementById('event-time').value = event.time;
      document.getElementById('event-venue').value = event.venue;
      document.getElementById('event-organizer').value = event.organizer;
      document.getElementById('event-category').value = event.category;
      document.getElementById('event-seats').value = event.totalSeats;
      document.getElementById('event-price').value = event.price;
      document.getElementById('event-image').value = event.imageUrl || '';
    } else {
      if (kicker) kicker.textContent = 'New event';
      if (title) title.textContent = 'Publish to your city';
      document.getElementById('event-id').value = '';
    }

    openModal('modal-event-form');
  }

  function handleEventFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    clearFormErrors(form);

    const id = document.getElementById('event-id').value;
    const title = document.getElementById('event-title').value.trim();
    const description = document.getElementById('event-description').value.trim();
    const date = document.getElementById('event-date').value;
    const time = document.getElementById('event-time').value;
    const venue = document.getElementById('event-venue').value.trim();
    const organizer = document.getElementById('event-organizer').value.trim();
    const category = document.getElementById('event-category').value;
    const totalSeats = parseInt(document.getElementById('event-seats').value, 10);
    const price = parseFloat(document.getElementById('event-price').value);
    const imageUrl = document.getElementById('event-image').value.trim();

    let valid = true;
    if (!title) {
      setFieldError('event-title', 'Title is required.');
      valid = false;
    }
    if (!description) {
      setFieldError('event-description', 'Description is required.');
      valid = false;
    }
    if (!date) {
      setFieldError('event-date', 'Date is required.');
      valid = false;
    }
    if (!time) {
      setFieldError('event-time', 'Time is required.');
      valid = false;
    }
    if (!venue) {
      setFieldError('event-venue', 'Venue is required.');
      valid = false;
    }
    if (!organizer) {
      setFieldError('event-organizer', 'Organizer is required.');
      valid = false;
    }
    if (!category || !CATEGORIES.includes(category)) {
      setFieldError('event-category', 'Please choose a category.');
      valid = false;
    }
    if (!totalSeats || totalSeats < 1) {
      setFieldError('event-seats', 'Total seats must be at least 1.');
      valid = false;
    }
    if (Number.isNaN(price) || price < 0) {
      setFieldError('event-price', 'Price must be 0 or greater.');
      valid = false;
    }
    if (imageUrl && !/^https?:\/\/.+/i.test(imageUrl)) {
      setFieldError('event-image', 'Image URL must start with http(s)://');
      valid = false;
    }
    if (!valid) return;

    const events = getEvents();

    if (id) {
      const idx = events.findIndex((ev) => ev.id === id);
      if (idx === -1) {
        showToast('Event not found.', { type: 'danger' });
        return;
      }
      const existing = events[idx];
      const seatDiff = totalSeats - existing.totalSeats;
      const updated = {
        ...existing,
        title,
        description,
        date,
        time,
        venue,
        organizer,
        category,
        totalSeats,
        availableSeats: Math.max(0, existing.availableSeats + seatDiff),
        price,
        imageUrl: imageUrl || existing.imageUrl,
      };
      events[idx] = updated;
      saveEvents(events);
      eventFormDirty = false;
      closeModal('modal-event-form');
      showToast('Event updated!', { type: 'success' });
    } else {
      const newId = generateId('evt');
      const newEvent = {
        id: newId,
        title,
        description,
        date,
        time,
        venue,
        organizer,
        category,
        totalSeats,
        availableSeats: totalSeats,
        price,
        imageUrl: imageUrl || `https://picsum.photos/seed/${encodeURIComponent(newId)}/800/500`,
        createdAt: new Date().toISOString(),
      };
      saveEvents(events.concat(newEvent));
      eventFormDirty = false;
      closeModal('modal-event-form');
      showToast('Event created!', { type: 'success' });
    }

    if (state.currentView === 'view-admin') renderAdminDashboard();
    if (state.currentView === 'view-events') renderEventsList();
  }

  function attemptCloseEventForm() {
    if (eventFormDirty) {
      const ok = window.confirm('You have unsaved changes. Discard them?');
      if (!ok) return;
    }
    eventFormDirty = false;
    closeModal('modal-event-form');
  }

  // ==========================================================================
  // 13. DELETE EVENT
  // ==========================================================================

  function openDeleteConfirm(eventId) {
    const event = getEvents().find((e) => e.id === eventId);
    if (!event) return;
    const bookings = getBookings().filter((b) => b.eventId === eventId);
    state.pendingDeleteId = eventId;

    const msgEl = document.getElementById('delete-message');
    if (msgEl) {
      msgEl.innerHTML = `Are you sure you want to delete <strong>"${escapeHtml(event.title)}"</strong>? ${
        bookings.length > 0
          ? `This will also cancel <strong>${bookings.length} ${
              bookings.length === 1 ? 'booking' : 'bookings'
            }</strong>.`
          : 'This action cannot be undone.'
      }`;
    }
    openModal('modal-delete');
  }

  function confirmDelete() {
    const id = state.pendingDeleteId;
    if (!id) return;

    const events = getEvents().filter((e) => e.id !== id);
    saveEvents(events);

    const bookings = getBookings().filter((b) => b.eventId !== id);
    saveBookings(bookings);

    const favorites = getFavorites().filter((favId) => favId !== id);
    saveFavorites(favorites);

    state.pendingDeleteId = null;
    closeModal('modal-delete');
    showToast('Event deleted. Bookings and favorites cleaned up.', { type: 'info' });
    renderFavoritesBadge();
    if (state.currentView === 'view-admin') renderAdminDashboard();
    if (state.currentView === 'view-event-details') showView('view-events');
  }

  // ==========================================================================
  // 14. EVENT DELEGATION + LISTENERS
  // ==========================================================================

  function handleDocumentClick(e) {
    const closeTarget = e.target.closest('[data-modal-close]');
    if (closeTarget) {
      const id = closeTarget.getAttribute('data-modal-close');
      closeModal(id);
      return;
    }

    if (
      e.target.closest('#event-form-close') ||
      e.target.closest('#event-form-cancel') ||
      e.target.closest('[data-event-form-backdrop]')
    ) {
      attemptCloseEventForm();
      return;
    }

    if (e.target.closest('#delete-confirm')) {
      confirmDelete();
      return;
    }

    const actionEl = e.target.closest('[data-action]');
    if (!actionEl) return;
    const action = actionEl.getAttribute('data-action');
    const eventId = actionEl.getAttribute('data-event-id');
    const bookingId = actionEl.getAttribute('data-booking-id');
    const mode = actionEl.getAttribute('data-mode');

    switch (action) {
      case 'show-events':
        showView('view-events');
        break;
      case 'show-favorites':
        showView('view-favorites');
        break;
      case 'show-bookings':
        showView('view-bookings');
        break;
      case 'show-admin':
        if (!state.adminMode) {
          openModal('modal-admin-login');
        } else {
          showView('view-admin');
        }
        break;
      case 'toggle-menu': {
        const nav = document.getElementById('nav');
        const isOpen = nav?.classList.toggle('is-open');
        actionEl.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        break;
      }
      case 'toggle-admin':
        toggleAdmin();
        break;
      case 'open-details':
        if (eventId) renderEventDetails(eventId);
        break;
      case 'toggle-favorite':
        e.stopPropagation();
        if (eventId) toggleFavorite(eventId);
        break;
      case 'open-register':
        if (eventId) openRegisterModal(eventId);
        break;
      case 'open-event-form':
        if (!state.adminMode) return;
        openEventForm(mode || 'create', eventId);
        break;
      case 'confirm-delete':
        if (eventId) openDeleteConfirm(eventId);
        break;
      case 'cancel-booking':
        if (bookingId) {
          const ok = window.confirm('Cancel this booking? Your seats will be returned to the pool.');
          if (ok) cancelBooking(bookingId);
        }
        break;
      case 'reset-filters':
        state.search = '';
        state.category = 'all';
        document.getElementById('search-input').value = '';
        document.getElementById('search-clear')?.setAttribute('hidden', '');
        updateChipActive();
        renderEventsList();
        break;
      default:
        break;
    }
  }

  function updateChipActive() {
    document.querySelectorAll('#filter-chips .chip').forEach((chip) => {
      const cat = chip.getAttribute('data-category');
      const isActive = cat === state.category;
      chip.classList.toggle('chip--active', isActive);
      chip.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
  }

  function bindChipClicks() {
    document.querySelectorAll('#filter-chips .chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        const cat = chip.getAttribute('data-category');
        state.category = cat;
        updateChipActive();
        renderEventsList();
      });
    });
  }

  function bindSearch() {
    const input = document.getElementById('search-input');
    const clearBtn = document.getElementById('search-clear');
    if (!input) return;

    input.addEventListener('input', (e) => {
      const value = e.target.value;
      state.search = value;
      if (value && clearBtn) {
        clearBtn.removeAttribute('hidden');
      } else if (clearBtn) {
        clearBtn.setAttribute('hidden', '');
      }
      renderEventsList();
    });

    clearBtn?.addEventListener('click', () => {
      input.value = '';
      state.search = '';
      clearBtn.setAttribute('hidden', '');
      renderEventsList();
      input.focus();
    });
  }

  function bindForms() {
    document
      .getElementById('register-form')
      ?.addEventListener('submit', handleRegisterSubmit);
    document
      .getElementById('admin-login-form')
      ?.addEventListener('submit', handleAdminLogin);
    document
      .getElementById('event-form')
      ?.addEventListener('submit', handleEventFormSubmit);

    [
      'register-name',
      'register-email',
      'register-tickets',
      'admin-password',
      'event-title',
      'event-description',
      'event-date',
      'event-time',
      'event-venue',
      'event-organizer',
      'event-category',
      'event-seats',
      'event-price',
      'event-image',
    ].forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('input', () => clearFieldError(id));
      el.addEventListener('change', () => clearFieldError(id));
    });

    const eventForm = document.getElementById('event-form');
    if (eventForm) {
      eventForm.addEventListener('input', () => {
        eventFormDirty = true;
      });
      eventForm.addEventListener('change', () => {
        eventFormDirty = true;
      });
    }
  }

  function bindKeyboard() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const eventForm = document.getElementById('modal-event-form');
        if (eventForm && !eventForm.hasAttribute('hidden')) {
          attemptCloseEventForm();
          return;
        }
        const openModals = document.querySelectorAll('.modal:not([hidden])');
        if (openModals.length === 0) return;
        const last = openModals[openModals.length - 1];
        closeModal(last.id);
      }
    });
  }

  // ==========================================================================
  // 15. INITIALIZATION
  // ==========================================================================

  function init() {
    seedIfNeeded();

    const yearEl = document.getElementById('footer-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Admin mode resets to false on each fresh load per spec
    state.adminMode = false;
    writeStore(STORAGE_KEYS.adminMode, false);
    updateAdminChrome();

    bindChipClicks();
    bindSearch();
    bindForms();
    bindKeyboard();

    document.addEventListener('click', handleDocumentClick);

    renderFavoritesBadge();
    showView('view-events');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
