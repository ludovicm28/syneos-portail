(() => {
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => {});
  const bar = document.getElementById('install-bar');
  const copy = document.getElementById('install-copy');
  const install = document.getElementById('install-button');
  const close = document.getElementById('install-close');
  if (!bar || !copy || !install || !close) return;
  const standalone = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  if (standalone || sessionStorage.getItem('syneos-install-dismissed')) return;
  let prompt = null;
  const iphone = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (iphone) {
    copy.textContent = 'Pour installer SYNÉOS sur cet iPhone : ouvrez cette adresse dans l’application Safari (pas depuis Caméra), puis touchez Partager et « Sur l’écran d’accueil ».';
    install.hidden = true;
    bar.hidden = false;
  }
  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    prompt = event;
    copy.textContent = 'Installez SYNÉOS sur l’écran d’accueil pour accéder plus vite aux applications.';
    install.hidden = false;
    bar.hidden = false;
  });
  install.addEventListener('click', async () => {
    if (!prompt) return;
    prompt.prompt();
    await prompt.userChoice;
    prompt = null;
    bar.hidden = true;
  });
  close.addEventListener('click', () => {
    bar.hidden = true;
    sessionStorage.setItem('syneos-install-dismissed', '1');
  });
  window.addEventListener('appinstalled', () => { bar.hidden = true; });
})();
