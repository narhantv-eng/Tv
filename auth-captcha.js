// auth-captcha.js
window.currentCaptchaAnswer = 0;

window.generateCaptcha = () => {
  const n1 = Math.floor(Math.random() * 10) + 1;
  const n2 = Math.floor(Math.random() * 10) + 1;
  window.currentCaptchaAnswer = n1 + n2;
  const qL = document.getElementById('captchaQuestionLogin');
  const qR = document.getElementById('captchaQuestionReg');
  if (qL) qL.textContent = `${n1} + ${n2} = ?`;
  if (qR) qR.textContent = `${n1} + ${n2} = ?`;
};
