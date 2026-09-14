// ===========================================================
// SahakarSeva — Persistent User Database & Strict Auth Validation
// ===========================================================

const SS_SESSION_KEY = 'sahakarseva_session';
const SS_USERS_KEY = 'sahakarseva_users_db';

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

// Initial Seed Users in Database (Valid Email Formats)
const SS_INITIAL_USERS = [
  { name: 'Rajesh Sharma', email: 'rajesh.sharma@gmail.com', pass: 'password123', role: 'customer' },
  { name: 'Pooja Verma', email: 'pooja.verma@gmail.com', pass: 'password123', role: 'customer' },
  { name: 'Ramesh Kumar', email: 'ramesh.kumar@gmail.com', pass: 'password123', role: 'worker' },
  { name: 'Rohit Plumber', email: 'rohit.plumber@gmail.com', pass: 'password123', role: 'worker' },
  { name: 'S. K. Kadam', email: 'sk.kadam@sahakarseva.gov.in', pass: 'password123', role: 'admin' },
  { name: 'Anita Deshmukh', email: 'anita.deshmukh@sahakarseva.gov.in', pass: 'password123', role: 'admin' }
];

// Initialize persistent user database in localStorage if not present
function ssGetUsersDB() {
  try {
    const raw = localStorage.getItem(SS_USERS_KEY);
    if (!raw) {
      localStorage.setItem(SS_USERS_KEY, JSON.stringify(SS_INITIAL_USERS));
      return SS_INITIAL_USERS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return SS_INITIAL_USERS;
  }
}

function ssSaveUsersDB(users) {
  try {
    localStorage.setItem(SS_USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save users database');
  }
}

// Validate Email Format Regex
function ssIsValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

// Authenticate user against database
function ssAuthenticateUser(role, email, password) {
  if (!email || !ssIsValidEmail(email)) {
    return { success: false, error: 'Please enter a valid email address (e.g. name@gmail.com).' };
  }
  if (!password) {
    return { success: false, error: 'Please enter your password.' };
  }

  const users = ssGetUsersDB();
  const matched = users.find(u => 
    u.email.toLowerCase() === email.trim().toLowerCase() && 
    u.pass === password && 
    u.role === role
  );

  if (matched) {
    ssLogin(matched.role, matched.name, matched.email);
    return { success: true, user: matched };
  }

  return { 
    success: false, 
    error: 'Invalid email or password. Please check your credentials or click "Create New Account" below to register.' 
  };
}

// Register new user into persistent database
function ssRegisterUser(name, email, role, password) {
  if (!name || name.trim().length < 2) {
    return { success: false, error: 'Please enter your full name.' };
  }
  if (!email || !ssIsValidEmail(email)) {
    return { success: false, error: 'Please enter a valid email address (e.g. name@gmail.com).' };
  }
  if (!password || password.length < 4) {
    return { success: false, error: 'Password must be at least 4 characters.' };
  }

  const users = ssGetUsersDB();
  const existing = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
  if (existing) {
    return { success: false, error: 'This email is already registered. Please log in instead.' };
  }

  const newUser = {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    pass: password,
    role: role
  };

  users.push(newUser);
  ssSaveUsersDB(users);

  // Auto login after registration
  ssLogin(newUser.role, newUser.name, newUser.email);
  return { success: true, user: newUser };
}

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
