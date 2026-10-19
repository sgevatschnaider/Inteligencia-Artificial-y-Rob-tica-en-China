(() => {
  'use strict';
  const cover = document.getElementById('intro-play');
  const video = document.getElementById('intro-video');
  const error = document.getElementById('intro-error');
  if (!cover || !video || typeof video.play !== 'function') return;

  // The cover is also a working direct link when JavaScript is unavailable.
  function restoreCover() {
    video.pause();
    video.hidden = true;
    cover.hidden = false;
    error.hidden = false;
    cover.focus();
  }
  cover.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    error.hidden = true;
    if (!video.getAttribute('src')) video.src = cover.href;
    cover.hidden = true;
    video.hidden = false;
    video.focus();
    const playback = video.play();
    if (playback && typeof playback.catch === 'function') playback.catch(restoreCover);
  });
  video.addEventListener('error', restoreCover);
  document.addEventListener('visibilitychange', () => { if (document.hidden) video.pause(); });
  document.querySelectorAll('[data-home-video]').forEach(link => link.addEventListener('click', () => video.pause()));
})();
