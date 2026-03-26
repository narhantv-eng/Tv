// auth.js
import { auth } from './firebase-config.js';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged }
  from 'https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js';
import './auth-captcha.js';
import './auth-modal.js';

window.currentUser = null;

onAuthStateChanged(auth, (user) => {
  window.currentUser = user?.email
    ? { name: user.email.split('@')[0], email: user.email }
    : null;
  window.updateNavUser();
});

window.doLogin = async () => {
  const email   = document.getElementById('loginEmail').value.trim();
  const pass    = document.getElementById('loginPass').value;
  const captcha = parseInt(document.getElementById('captchaAnswerLogin').value);
  if (!email || !pass) return window.toast('Мэдээллээ бүрэн оруулна уу');
  if (isNaN(captcha) || captcha !== window.currentCaptchaAnswer) {
    window.generateCaptcha(); return window.toast('❌ Хамгаалалтын тоог буруу бодсон байна!');
  }
  try {
    await signInWithEmailAndPassword(auth, email, pass);
    window.closeAuth(); window.toast('Амжилттай нэвтэрлээ 👋');
  } catch { window.generateCaptcha(); window.toast('❌ И-мэйл эсвэл нууц үг буруу байна!'); }
};

window.doRegister = async () => {
  const email   = document.getElementById('regEmail').value.trim();
  const pass    = document.getElementById('regPass').value;
  const captcha = parseInt(document.getElementById('captchaAnswerReg').value);
  if (!email || pass.length < 6) return window.toast('Нууц үг 6-аас дээш тэмдэгт байх ёстой');
  if (isNaN(captcha) || captcha !== window.currentCaptchaAnswer) {
    window.generateCaptcha(); return window.toast('❌ Хамгаалалтын тоог буруу бодсон байна!');
  }
  try {
    await createUserWithEmailAndPassword(auth, email, pass);
    window.closeAuth(); window.toast('Амжилттай бүртгүүллээ 🎉');
  } catch { window.generateCaptcha(); window.toast('❌ Бүртгэл үүсгэхэд алдаа гарлаа'); }
};

window.logoutUser = async () => {
  if (!confirm('Гарах уу?')) return;
  await signOut(auth); window.toast('Амжилттай гарлаа');
};
