// Reuse the academic collection's accessible slide controller unchanged.
// The shared controller reads this module's local slides.json and downloads.
(() => {
  'use strict';
  const english = new URLSearchParams(location.search).get('lang') === 'en';
  document.getElementById('search').placeholder = english ? 'Talent, Tsinghua, energy…' : 'Talento, Tsinghua, energía…';
  document.getElementById('chapters').setAttribute('aria-label', english ? 'Slide contents by chapter' : 'Índice de diapositivas por capítulo');
  document.querySelector('.deck-language').setAttribute('aria-label', english ? 'Interface language' : 'Idioma de la interfaz');
  document.querySelector('.tabs').setAttribute('aria-label', english ? 'Reading format' : 'Formato de lectura');
  document.querySelectorAll('a[href="../../index.html"]').forEach(link => {
    link.href = '../../index.html?lang=' + (english ? 'en' : 'es') + '#infraestructura';
  });
})();
