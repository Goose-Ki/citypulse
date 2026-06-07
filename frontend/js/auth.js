const SESSION_KEY = 'session';

function getSession() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch { return null; }
}

function setSession(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

function isLoggedIn() { return !!getSession(); }
function isAdmin()    { return getSession()?.role === 'admin'; }

function updateNavbar() {
  const session  = getSession();
  const navAuth  = document.getElementById('nav-auth');
  const navUser  = document.getElementById('nav-user');
  const adminLink = document.getElementById('nav-admin');

  if (!navAuth) return;

  if (session) {
    navAuth.style.display = 'none';
    if (navUser) {
      navUser.style.display = 'flex';
      const el = navUser.querySelector('.nav-username');
      const rl = navUser.querySelector('.nav-role');
      if (el) el.textContent = session.name;
      if (rl) { rl.textContent = session.role; rl.className = `nav-role badge badge-${session.role}`; }
    }
    if (adminLink) adminLink.style.display = session.role === 'admin' ? 'inline-flex' : 'none';
  } else {
    navAuth.style.display = 'flex';
    if (navUser)  navUser.style.display  = 'none';
    if (adminLink) adminLink.style.display = 'none';
  }
}
