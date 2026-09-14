// ===========================================================
// SahakarSeva — client-side auth & prototype demo logins
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

// 2 Unique Demo Accounts Per Role for Prototype Demo
const SS_DEMO_ACCOUNTS = {
  customer: [
    { email: 'customer1@sahakarseva.in', pass: 'demo123', name: 'Rajesh Sharma' },
    { email: 'customer2@sahakarseva.in', pass: 'demo123', name: 'Pooja Verma' }
  ],
  worker: [
    { email: 'worker1@sahakarseva.in', pass: 'demo123', name: 'Ramesh Kumar' },
    { email: 'worker2@sahakarseva.in', pass: 'demo123', name: 'Rohit Plumber' }
  ],
  admin: [
    { email: 'admin1@sahakarseva.gov.in', pass: 'demo123', name: 'S. K. Kadam' },
    { email: 'admin2@sahakarseva.gov.in', pass: 'demo123', name: 'Anita Deshmukh' }
  ]
};

function ssGetSession() {
  try {
    const raw = localStorage.getItem(SS_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function ssLogin(role, name, email) {
  const session = { role, name, email: email || '', loggedInAt: new Date().toISOString() };
  localStorage.setItem(SS_SESSION_KEY, JSON.stringify(session));
  return session;
}

function ssLogout() {
  localStorage.removeItem(SS_SESSION_KEY);
  window.location.href = 'login.html';
}

function ssGuard(requiredRole) {
  const session = ssGetSession();
  if (!session || session.role !== requiredRole) {
    window.location.href = `login.html?role=${requiredRole}`;
    return null;
  }
  return session;
}

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
