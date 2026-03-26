// auth-modal.js
window.updateNavUser = function() {
  const lb = document.getElementById('navLoginBtn');
  const ub = document.getElementById('navUserBtn');
  if (!lb || !ub) return;
  if (window.currentUser) {
    lb.style.display = 'none'; ub.style.display = 'flex';
    document.getElementById('navAvatar').textContent = window.currentUser.name[0].toUpperCase();
    document.getElementById('navUserName').textContent = window.currentUser.name;
  } else {
    lb.style.display = 'flex'; ub.style.display = 'none';
  }
};

window.openAuth = (mode) => {
  document.getElementById('authModal').classList.add('open');
  window.switchAuth(mode);
};
window.closeAuth = () => document.getElementById('authModal').classList.remove('open');
window.switchAuth = (mode) => {
  document.getElementById('authLogin').style.display = mode === 'login' ? 'block' : 'none';
  document.getElementById('authRegister').style.display = mode === 'register' ? 'block' : 'none';
  window.generateCaptcha();
};
