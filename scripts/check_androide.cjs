'use strict';
// Exercise the published module's real shared viewer, local metadata and assets.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const {chromium} = require('playwright');
const root = path.resolve(__dirname, '..');
const modulePath = '/materiales/androide/';
const data = JSON.parse(fs.readFileSync(path.join(root, modulePath, 'slides.json'), 'utf8'));
assert.equal(data.slides.length, 24, 'The original 24-slide sequence must be retained');
const screenshots = process.env.ANDROIDE_SCREENSHOT_DIR;
const types = {'.html':'text/html;charset=utf-8','.js':'text/javascript;charset=utf-8','.css':'text/css;charset=utf-8','.json':'application/json;charset=utf-8','.webp':'image/webp','.pdf':'application/pdf','.woff':'font/woff','.pptx':'application/vnd.openxmlformats-officedocument.presentationml.presentation'};
const server = http.createServer((req, res) => {
  let file;
  try { file = path.resolve(root, '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname)); }
  catch { return res.writeHead(400).end(); }
  if (file !== root && !file.startsWith(root + path.sep)) return res.writeHead(403).end();
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!fs.existsSync(file)) return res.writeHead(404).end();
  res.writeHead(200, {'Content-Type':types[path.extname(file)] || 'application/octet-stream'});
  fs.createReadStream(file).pipe(res);
});
const normal = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
async function capture(page, name, locator) {
  if (!screenshots) return;
  fs.mkdirSync(screenshots, {recursive:true});
  if (locator) await locator.screenshot({path:path.join(screenshots, name + '.png')});
  else await page.screenshot({path:path.join(screenshots, name + '.png'), fullPage:true});
}
(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = 'http://127.0.0.1:' + server.address().port;
  let browser;
  try {
    try { browser = await chromium.launch({channel:'chrome', headless:true, args:['--no-sandbox']}); }
    catch { browser = await chromium.launch({headless:true, args:['--no-sandbox']}); }
    const context = await browser.newContext();
    await context.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort());
    const errors = [];
    for (const viewport of [{width:1440,height:1000},{width:768,height:1024},{width:390,height:844}]) {
      const page = await context.newPage();
      await page.setViewportSize(viewport);
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(base + modulePath + '?lang=es#1');
      await page.waitForSelector('[data-page="24"]');
      await page.evaluate(() => document.fonts.ready);
      assert(await page.evaluate(() => document.fonts.check('30px AndroideHan', '人形机器人')), 'The local Chinese font did not load');
      assert.equal(await page.locator('[data-page]').count(), 24);
      assert.equal(await page.locator('#page').getAttribute('max'), '24');
      assert(await page.locator('#previous').isDisabled());
      await page.waitForFunction(() => { const im = document.getElementById('slide-image'); return im.complete && im.naturalWidth > 0; });
      await capture(page, 'viewer-' + viewport.width);
      // Desktop walks the complete sequence and checks notes/transcripts/sources against the same slide.
      const sequence = viewport.width === 1440 ? data.slides : [data.slides[0], data.slides[11], data.slides[23]];
      for (const slide of sequence) {
        await page.locator('#tab-slides').click();
        await page.locator('[data-page="' + slide.number + '"]').click();
        await page.waitForFunction(image => { const im = document.getElementById('slide-image'); return im.getAttribute('src') === image && im.complete && im.naturalWidth > 0; }, slide.image);
        assert.equal(await page.locator('#slide-title').textContent(), slide.title);
        assert.equal(await page.locator('#chapter-label').textContent(), slide.chapter);
        assert.equal(await page.locator('#slide-transcript').textContent(), slide.text.join('\n\n'));
        await page.locator('#show-sources').click();
        assert.equal(await page.locator('#speaker-notes').textContent(), slide.notes);
        const actual = await page.locator('#source-links a').evaluateAll(links => links.map(link => link.href));
        assert.deepEqual(actual, slide.source_ids.filter(id => data.source_registry[id]).map(id => data.source_registry[id].url));
      }
      await page.locator('#tab-slides').click();
      await page.locator('#page').fill('999');
      await page.locator('#page').dispatchEvent('change');
      assert.equal(await page.locator('#page').inputValue(), '24');
      assert(await page.locator('#next').isDisabled());
      await page.locator('#page').fill('-10');
      await page.locator('#page').dispatchEvent('change');
      assert.equal(await page.locator('#page').inputValue(), '1');
      await page.locator('#stage').focus();
      await page.keyboard.press('End');
      assert.equal(await page.locator('#page').inputValue(), '24');
      await page.keyboard.press('Home');
      await page.keyboard.press('ArrowRight');
      assert.equal(await page.locator('#page').inputValue(), '2');
      await page.keyboard.press('PageDown');
      await page.keyboard.press('PageUp');
      assert.equal(await page.locator('#page').inputValue(), '2');
      await page.locator('#fullscreen').click();
      await page.waitForFunction(() => !!document.fullscreenElement);
      await page.locator('#fullscreen').click();
      await page.waitForFunction(() => !document.fullscreenElement);
      await page.locator('#next').focus();
      await page.keyboard.press('f');
      await page.waitForFunction(() => !!document.fullscreenElement);
      await page.keyboard.press('f');
      await page.waitForFunction(() => !document.fullscreenElement);
      // Pick a term that appears in a teaching note but is absent from that slide's visible text.
      const candidate = data.slides.flatMap(slide => (slide.notes.match(/[\p{L}]{8,}/gu) || []).filter(word => !normal(slide.title + ' ' + slide.text.join(' ')).includes(normal(word)))).find(Boolean);
      assert(candidate, 'Need a substantive teaching-note search term');
      await page.locator('#search').fill(candidate);
      const expected = data.slides.filter(slide => normal(slide.title + ' ' + slide.text.join(' ') + ' ' + slide.notes).includes(normal(candidate)));
      assert.equal(await page.locator('[data-page]').count(), expected.length, 'Search must include teaching notes');
      await page.locator('#search').fill('zzzzsincoincidencias');
      assert.equal(await page.locator('[data-page]').count(), 0);
      await page.locator('#search').fill('');
      await page.locator('[data-page="12"]').click();
      await page.locator('#show-sources').click();
      await page.locator('#tab-sources').focus();
      await page.keyboard.press('ArrowLeft');
      assert(await page.locator('#pdf-panel').isVisible());
      assert.equal(await page.locator('#tab-pdf').getAttribute('aria-selected'), 'true');
      assert((await page.locator('object').getAttribute('data')).endsWith('#page=12'));
      await page.locator('#tab-slides').click();
      await page.locator('#switch-en').click();
      await page.waitForSelector('[data-page="24"]');
      assert.equal(await page.locator('html').getAttribute('lang'), 'en');
      assert.equal(await page.locator('#page').inputValue(), '12');
      assert((await page.locator('.deck-notice').innerText()).includes('in Spanish'));
      assert((await page.locator('#search').getAttribute('placeholder')).includes('humanoids'));
      assert((await page.locator('#back-home').getAttribute('href')).includes('lang=en#androide'));
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'Viewer horizontal overflow at ' + viewport.width);
      await page.close();
    }
    const deep = await context.newPage();
    await deep.goto(base + modulePath + '?lang=es&view=sources#14');
    await deep.waitForSelector('#speaker-notes');
    await deep.waitForFunction(() => document.getElementById('speaker-notes').textContent.length > 0);
    assert(await deep.locator('#sources-panel').isVisible());
    assert.equal(await deep.locator('#page').inputValue(), '14');
    assert.equal(await deep.locator('#speaker-notes').textContent(), data.slides[13].notes);
    await deep.close();
    for (const slide of data.slides) {
      const response = await context.request.get(base + modulePath + slide.image);
      assert(response.ok(), 'Missing image for slide ' + slide.number);
      assert((await response.body()).length > 1000, 'Empty image for slide ' + slide.number);
    }
    for (const file of ['presentacion.pdf', 'presentacion.pptx', 'fuentes.html']) {
      const response = await context.request.get(base + modulePath + file);
      assert(response.ok(), 'Missing download ' + file);
      const body = await response.body();
      if (file.endsWith('.pdf')) assert.equal(body.subarray(0, 4).toString(), '%PDF');
      if (file.endsWith('.pptx')) assert.equal(body.subarray(0, 2).toString(), 'PK');
    }
    for (const viewport of [{width:1440,height:1000},{width:390,height:844}]) {
      const page = await context.newPage();
      await page.setViewportSize(viewport);
      await page.goto(base + '/?lang=es');
      await page.locator('#androide').scrollIntoViewIfNeeded();
      await page.waitForFunction(() => { const im = document.querySelector('#androide img'); return im.complete && im.naturalWidth > 0; });
      await page.evaluate(() => document.fonts.ready);
      await capture(page, 'home-androide-' + viewport.width, page.locator('#androide'));
      const order = await page.evaluate(() => [document.querySelector('.hero-media'), ...['dragon','androide','transformacion-industrial'].map(id => document.getElementById(id))].map(element => element.getBoundingClientRect().top + scrollY));
      assert(order.every((value, index) => index === 0 || value > order[index - 1]), 'The academic collection order changed: ' + order.join(', '));
      assert.equal(await page.locator('#androide .androide-attribution').textContent(), 'Material elaborado por el profesor Sergio Gevatschnaider');
      assert((await page.locator('a[href*="materiales/infraestructura"]').count()) >= 3, 'The third module must be linked after the Android');
      await page.locator('#lang-en').click();
      assert((await page.locator('[data-androide-link]').first().getAttribute('href')).includes('lang=en'));
      assert((await page.locator('#androide .androide-language.en').innerText()).includes('Spanish content'));
      assert((await page.locator('[data-dragon-link]').first().getAttribute('href')).includes('lang=en'));
      assert((await page.locator('[data-presentation-link]').first().getAttribute('href')).includes('/en/'));
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'Homepage horizontal overflow at ' + viewport.width);
      await page.close();
    }
    for (const route of ['/materiales/dragon/slides.json', '/materiales/transformacion-industrial/slides.json', '/materiales/transformacion-industrial/en/slides.json']) {
      const response = await context.request.get(base + route);
      assert(response.ok());
      const previous = await response.json();
      assert.equal(previous.slides.length, route.includes('dragon') ? 10 : 47, 'An existing module changed');
    }
    assert.deepEqual(errors, [], errors.join('\n'));
    await context.close();
    console.log('Android browser checks passed: all 24 slides, exact transcripts/notes/sources, chapter search, keyboard/fullscreen, ES/EN, downloads, desktop/tablet/mobile and preserved collection.');
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
