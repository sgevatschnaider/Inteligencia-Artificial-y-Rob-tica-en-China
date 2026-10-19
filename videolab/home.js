(() => {
  'use strict';
  const dialog = document.getElementById('home-video-player');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const screen = document.getElementById('home-video-screen');
  const title = document.getElementById('home-video-title');
  const source = document.getElementById('home-video-source');
  let trigger;
  document.querySelectorAll('[data-home-video]').forEach(link => {
    link.addEventListener('click', event => {
      // Preserve opening the original link with modifier keys or another button.
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
      const id = link.dataset.homeVideo;
      if (!/^[\w-]{11}$/.test(id)) return;
      event.preventDefault();
      trigger = link;
      const language = document.body.dataset.language === 'en' ? 'en' : 'es';
      title.textContent = link.querySelector('.videolab-title .' + language).textContent;
      source.href = link.href;
      const iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube-nocookie.com/embed/' + id + '?rel=0';
      iframe.title = title.textContent;
      iframe.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.allowFullscreen = true;
      iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      screen.replaceChildren(iframe);
      dialog.showModal();
    });
  });
  document.getElementById('home-video-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    screen.replaceChildren();
    if (trigger) trigger.focus();
  });
  document.querySelectorAll('.videolab-poster img').forEach(img => {
    const hide = () => { img.hidden = true; };
    img.addEventListener('error', hide, { once: true });
    if (img.complete && !img.naturalWidth) hide();
  });
})();
