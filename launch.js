(() => {
  const panel = document.getElementById('launch-panel');
  const title = document.getElementById('launch-title');
  const message = document.getElementById('launch-message');
  const direct = document.getElementById('launch-direct');
  const cancel = document.getElementById('launch-cancel');
  if (!panel || !title || !message || !direct || !cancel) return;

  let current = null;
  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
  const ready = async (destination, signal) => {
    const timer = setTimeout(() => signal.abort(), 12000);
    try {
      const response = await fetch(new URL('/healthz', destination), {
        mode: 'cors', credentials: 'omit', cache: 'no-store', signal: signal.signal
      });
      if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) return false;
      return (await response.json()).ok === true;
    } catch { return false; }
    finally { clearTimeout(timer); }
  };

  const stop = () => {
    if (current) current.controller.abort();
    current = null;
    panel.hidden = true;
  };
  cancel.addEventListener('click', stop);

  for (const link of document.querySelectorAll('a.open[href^="https://"]')) {
    link.addEventListener('click', async event => {
      if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      const useMobile = window.matchMedia('(max-width: 700px)').matches;
      // On desktop, follow the link's target="_blank". Navigating this PWA to another
      // origin makes Chrome show its browser-owned address bar above the application.
      if (!useMobile) return;
      const destination = new URL(useMobile && link.dataset.mobileHref ? link.dataset.mobileHref : link.href);
      if (destination.hostname !== 'main-courante-web.onrender.com' && destination.hostname !== 'plan-de-crise-web.onrender.com' && destination.hostname !== 'registre-de-securite-web.onrender.com') return;
      event.preventDefault();
      stop();
      const task = { controller: new AbortController() };
      current = task;
      const name = link.closest('.card')?.querySelector('.name')?.textContent?.trim() || 'l’application';
      title.textContent = `Ouverture de ${name}`;
      message.textContent = 'Vérification du service… Un premier démarrage peut prendre environ une minute.';
      direct.href = destination.href;
      panel.hidden = false;
      cancel.focus();
      const deadline = Date.now() + 120000;
      while (current === task && Date.now() < deadline) {
        const attempt = new AbortController();
        const onAbort = () => attempt.abort();
        task.controller.signal.addEventListener('abort', onAbort, { once: true });
        const serviceReady = await ready(destination, attempt);
        task.controller.signal.removeEventListener('abort', onAbort);
        if (serviceReady) {
          if (current === task) window.location.assign(destination.href);
          return;
        }
        if (current !== task) return;
        message.textContent = 'L’application démarre sur Render. Vous pouvez continuer à attendre ou l’ouvrir directement.';
        await wait(4000);
      }
      if (current === task) message.textContent = 'Le service tarde à répondre. Réessayez plus tard ou ouvrez-le directement.';
    });
  }
})();
