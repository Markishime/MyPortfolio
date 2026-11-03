const { chromium } = require('playwright-core');
const fs = require('node:fs');
(async () => {
  const path = require('node:path');
  const server = require('node:http').createServer((req,res)=>{
    const file = path.join(process.cwd(),'public',decodeURIComponent(req.url.split('?')[0] === '/' ? '/index.html' : req.url.split('?')[0]));
    if(!file.startsWith(path.join(process.cwd(),'public'))) {res.writeHead(403).end();return;}
    fs.readFile(file,(err,data)=>{if(err){res.writeHead(404).end();return;}res.setHeader('Content-Type',({'.js':'text/javascript','.css':'text/css','.html':'text/html','.svg':'image/svg+xml','.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.mp4':'video/mp4'})[path.extname(file)]||'application/octet-stream');res.end(data)});
  });
  await new Promise(resolve=>server.listen(8123,'127.0.0.1',resolve));
  fs.mkdirSync('output/playwright', {recursive:true});
  const browser = await chromium.launch({executablePath:'C:/Users/markc/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe', headless:true});
  const results = [];
  for (const mode of ['desktop','mobile','reduced']) {
    const context = await browser.newContext({viewport: mode === 'mobile' ? {width:390,height:844} : {width:1440,height:1000}, reducedMotion:mode === 'reduced' ? 'reduce':'no-preference'});
    const page = await context.newPage();
    const errors = []; const failed = [];
    const animationRequests = [];
    page.on('request', r=>{if(/three|gsap|ScrollTrigger|lenis|unpkg|cdnjs/i.test(r.url())) animationRequests.push(r.url())});
    page.on('pageerror',e=>errors.push(e.message));
    page.on('console',m=>{if(m.type()==='error') errors.push(m.text())});
    page.on('requestfailed',r=>failed.push(r.url()));
    if(mode === 'offline-libraries') await page.route(/unpkg|cdnjs/, r=>r.abort());
    await page.goto('http://127.0.0.1:8123', {waitUntil:'networkidle'});
    await page.waitForTimeout(2200);
    await page.screenshot({path:`output/playwright/${mode}-hero.png`});
    if(mode!=='reduced') await page.locator('.motion-toggle').click();
    const before = await page.screenshot();
    await page.waitForTimeout(1600);
    const after = await page.screenshot();
    const staticHero = before.equals(after);
    const sections = await page.locator('main .section[id]').evaluateAll(nodes=>nodes.map(n=>n.id));
    const reveals = [];
    for(const id of sections) {
      await page.locator(`#${id}`).scrollIntoViewIfNeeded();
      await page.waitForTimeout(100);
      reveals.push(await page.locator(`#${id}`).evaluate(el=>({id:el.id, visible:[...el.querySelectorAll('[data-reveal]')].filter(n=>{const r=n.getBoundingClientRect();return r.top<innerHeight*.85&&r.bottom>0}).every(n=>getComputedStyle(n).opacity==='1')})));
      if(id==='projects') await page.screenshot({path:`output/playwright/${mode}-projects.png`});
    }
    const checks = await page.evaluate(()=>({
      overflow:document.documentElement.scrollWidth>innerWidth,
      projects:document.querySelectorAll('.project-card').length,
      brokenImages:[...document.images].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.src),
      badAnchors:[...document.querySelectorAll('a[href^="#"]')].filter(a=>!document.getElementById(a.hash.slice(1))).map(a=>a.hash),
      canvasCount:document.querySelectorAll('canvas').length,
      activeAnimations:document.getAnimations().length,
      titleCount:document.querySelectorAll('h1,h2,h3').length,
      typewriterTitles:[...document.querySelectorAll('h1,h2,h3')].filter(h=>(h.hasAttribute('aria-label')||h.querySelector('button[aria-label]'))&&h.querySelector('.type-char')).length,
      heroLineCount:document.querySelectorAll('.hero-title-line').length,
      heroLineOverflow:[...document.querySelectorAll('.hero-title-line')].some(line=>line.scrollWidth>line.parentElement.clientWidth+1),
      heroPhotoLoaded:Boolean(document.querySelector('.hero-visual img')?.naturalWidth),
      heroPerspective:getComputedStyle(document.querySelector('.hero-visual')).perspective
    }));
    checks.staticHero = staticHero;
    checks.animationRequests = animationRequests;
    if(mode==='mobile') {
      await page.locator('.nav-toggle').click();
      checks.menuOpened=await page.locator('.nav-toggle').getAttribute('aria-expanded')==='true';
      await page.keyboard.press('Escape');
      checks.menuClosed=await page.locator('.nav-toggle').getAttribute('aria-expanded')==='false';
    }
    results.push({mode,errors,failed,checks,reveals});
    await context.close();
  }
  await browser.close();
  server.close();
  fs.writeFileSync('output/playwright/audit.json',JSON.stringify(results,null,2));
  console.log(JSON.stringify(results,null,2));
  if(results.some(r=>r.errors.length || r.failed.length || r.checks.overflow || r.checks.projects!==14 || r.checks.brokenImages.length || r.checks.badAnchors.length || r.checks.canvasCount || r.checks.titleCount!==r.checks.typewriterTitles || r.checks.heroLineCount!==2 || r.checks.heroLineOverflow || !r.checks.heroPhotoLoaded || r.checks.heroPerspective==='none' || !r.checks.staticHero || r.reveals.some(section=>!section.visible))) process.exitCode = 1;
})().catch(e=>{console.error(e);process.exit(1)});
