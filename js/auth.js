// ===========================================================
// SahakarSeva — client-side auth (demo only)
// This simulates login/session state with localStorage so the
// three role-based screens can be demoed end-to-end without a
// backend yet. Swap ssLogin()'s body for a real POST /auth/login
// call once the Node/Express API exists — everything else
// (guards, nav rendering) can stay as-is.
// ===========================================================

const SS_SESSION_KEY = 'sahakarseva_session';

const SS_DESTINATIONS = {
  customer: 'booking.html',
  worker: 'worker-dashboard.html',
  admin: 'admin.html',
};

const SS_ROLE_LABELS = {
  customer: 'Customer',
  worker: 'Cooperative Worker',
  admin: 'Federation Admin',
};

function ssGetSession() {
  try {
    const raw = localStorage.getItem(SS_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function ssLogin(role, name) {
  const session = { role, name, loggedInAt: new Date().toISOString() };
  localStorage.setItem(SS_SESSION_KEY, JSON.stringify(session));
  return session;
}

function ssLogout() {
  localStorage.removeItem(SS_SESSION_KEY);
  window.location.href = 'login.html';
}

// Call at the top of a protected page. If there's no session, or the
// session's role doesn't match what the page requires, redirect to
// login with that role pre-selected.
function ssGuard(requiredRole) {
  const session = ssGetSession();
  if (!session || session.role !== requiredRole) {
    window.location.href = `login.html?role=${requiredRole}`;
    return null;
  }
  return session;
}

// Fill a name/avatar pair from the session, falling back to a demo
// value on pages opened directly without going through login.html.
function ssFillName(nameElId, avatarElId, fallbackName) {
  const session = ssGetSession();
  const name = (session && session.name) ? session.name : fallbackName;
  const nameEl = document.getElementById(nameElId);
  const avatarEl = document.getElementById(avatarElId);
  if (nameEl) nameEl.textContent = name;
  if (avatarEl) {
    const initials = name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();
    avatarEl.textContent = initials;
  }
}

function ssFillFirstName(elId) {
  const session = ssGetSession();
  const name = (session && session.name) ? session.name : 'Ramesh';
  const el = document.getElementById(elId);
  if (el) el.textContent = `, ${name.split(' ')[0]}`;
}

// Landing page nav: swap "Login" for "Hi, <name> · Logout" if a
// session already exists.
function ssReflectNav(loginLinkId) {
  const session = ssGetSession();
  const el = document.getElementById(loginLinkId);
  if (!el) return;
  if (session) {
    el.textContent = `Hi, ${session.name.split(' ')[0]} · Logout`;
    el.href = '#';
    el.addEventListener('click', (e) => { e.preventDefault(); ssLogout(); });
  } else {
    el.textContent = 'Login';
    el.href = 'login.html';
  }
}

// Booking page nav: render either an avatar (logged in) or a Login
// button (not logged in) into the given container.
function ssRenderAccountArea(containerId, expectedRole) {
  const session = ssGetSession();
  const container = document.getElementById(containerId);
  if (!container) return;

  if (session && session.role === expectedRole) {
    const initials = session.name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();
    container.innerHTML = `
      <div style="display:flex; align-items:center; gap:8px;">
        <div class="nav-avatar">${initials}</div>
        <button class="btn btn-outline btn-sm" onclick="ssLogout()">Logout</button>
      </div>`;
  } else {
    container.innerHTML = `<a href="login.html?role=${expectedRole}" class="btn btn-primary btn-sm">Login</a>`;
  }
}
