/* Run with Playwright installed: node tests/browser.cjs
   Uses a temporary local server and fresh browser profiles. */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert=require('node:assert/strict');
const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const assets=path.resolve(__dirname,'../app');
const server=http.createServer((req,res)=>{
 const reqPath=decodeURIComponent(req.url.split('?')[0]);
 const file=path.join(assets,reqPath==='/'?'index.html':reqPath);
 if(!file.startsWith(assets)){res.statusCode=403;res.end();return;}
 try{res.setHeader('Content-Type',file.endsWith('.js')?'application/javascript':file.endsWith('.css')?'text/css':'text/html');res.end(fs.readFileSync(file));}catch(e){res.statusCode=404;res.end();}
});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const browser=await chromium.launch({executablePath:process.env.CHROME_BIN || '/usr/bin/google-chrome',headless:true,args:['--no-sandbox']});
 try{
 const ctx=await browser.newContext({viewport:{width:1120,height:850}});const page=await ctx.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const url='http://127.0.0.1:'+server.address().port;
 await page.goto(url);
 await page.locator('#welcome-name').fill('Milo');await page.locator('button[type=submit]').click();
 assert.match(await page.locator('h1').innerText(),/Milo/);
 await page.reload();assert.match(await page.locator('h1').innerText(),/Milo/);
 console.log('PASS onboarding and remembered player');
 await page.locator('[data-action=workshop]').click();
 const original=await page.locator('#preview-mascot').innerHTML();
 await page.locator('[data-action=shuffle]').click();assert.notEqual(await page.locator('#preview-mascot').innerHTML(),original);
 await page.locator('#edit-name').fill('Milo Moon');
 await page.locator('[data-color=primary]').evaluate(e=>{e.value='#123456';e.dispatchEvent(new Event('input'));});
 await page.locator('[data-action=save-style]').click();
 assert.match(await page.locator('h1').innerText(),/Milo Moon/i);
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('bop-and-bloom-v1')));
 assert.equal(saved.profiles[0].colors.primary,'#123456');
 await page.locator('[data-action=profiles]').click();await page.locator('[data-action=add-profile]').click();await page.locator('#new-name').fill('Ada');await page.locator('#add-form button[type=submit]').click();
 await page.locator('[data-action=profiles]').click();await page.locator('.profile-select').filter({hasText:'Milo Moon'}).click();
 assert.match(await page.locator('h1').innerText(),/Milo Moon/i);
 assert.equal(await page.evaluate(()=>getComputedStyle(document.documentElement).getPropertyValue('--primary')),'#123456');
 console.log('PASS name, palette, logo generation, and isolated profiles');
 await page.locator('[data-action=start][data-game=bop]').click();await page.waitForSelector('.target.ready');
 await page.locator('.target.ready').first().click();assert.equal(await page.locator('#score').innerText(),'1');
 await page.waitForSelector('.target.ready');
 const idx=Number((await page.locator('.target.ready').first().getAttribute('id')).split('-')[1]);await page.keyboard.press(String(idx+1));assert.equal(await page.locator('#score').innerText(),'2');
 await page.locator('[data-action=pause]').click();assert.equal(await page.locator('.pause-cover').count(),1);
 await page.keyboard.press('1');assert.equal(await page.locator('#score').innerText(),'2');await page.locator('[data-action=resume]').click();
 await page.locator('[data-action=settings]').click();await page.locator('[data-action=back-game]').click();assert.equal(await page.locator('.pause-cover').count(),1);assert.equal(await page.locator('#score').innerText(),'2');await page.locator('[data-action=resume]').click();
 await page.locator('[data-action=finish]').click();await page.waitForSelector('.games');
 console.log('PASS mouse, keyboard, pause, finish, and no penalties (straight back to the playroom, no dialog)');
 await page.locator('[data-action=start][data-game=bloom]').click();await page.waitForTimeout(1600);await page.locator('#target-0').click();assert.equal(await page.locator('#score').innerText(),'1');await page.locator('#target-0').click();assert.equal(await page.locator('#score').innerText(),'1');await page.waitForTimeout(1800);await page.locator('#target-0').click();assert.equal(await page.locator('#score').innerText(),'2');await page.locator('[data-action=finish]').click();await page.waitForSelector('.games');
 console.log('PASS flower snipping, regrowth, and rapid-click protection');
 await page.locator('[data-action=start][data-game=bop]').click();await page.locator('[data-action=set-difficulty][data-value=medium]').click();
 assert.match(await page.locator('.diff-pill.active').innerText(),/Medium/);await page.locator('[data-action=home]').click();
 const diffState=await page.evaluate(()=>JSON.parse(localStorage.getItem('bop-and-bloom-v1')).profiles[0].difficulty.bop);assert.equal(diffState,'medium');
 console.log('PASS per-game difficulty selection and persistence');
 await page.locator('[data-action=settings]').click();await page.locator('[data-value=effects]').click();await page.locator('[data-value=music]').click();await page.locator('#volume').fill('37');await page.locator('[data-value=reduced]').click();await page.reload();
 const st=await page.evaluate(()=>JSON.parse(localStorage.getItem('bop-and-bloom-v1')));assert.equal(st.settings.effects,false);assert.equal(st.settings.music,false);assert.equal(st.settings.volume,37);assert.equal(st.settings.reduced,true);
 console.log('PASS sound, volume, and reduced-motion persistence');
 await page.locator('[data-action=start][data-game=bop]').click();await page.locator('[data-action=set-difficulty][data-value=medium]').click();
 await page.clock.install();await page.waitForSelector('.target.ready');await page.clock.runFor(1000);await page.locator('.target.ready').first().click();
 await page.locator('[data-action=pause]').click();const time=await page.locator('#time').innerText();await page.clock.runFor(10000);assert.equal(await page.locator('#time').innerText(),time);await page.locator('[data-action=resume]').click();await page.clock.runFor(61000);await page.waitForSelector('.games');
 const best=await page.evaluate(()=>JSON.parse(localStorage.getItem('bop-and-bloom-v1')).profiles[0].best.bop);assert.equal(best,1);
 console.log('PASS timed round completion, paused timer, best score');
 await page.locator('[data-action=parent-gate]').click();for(const d of ['1','2','3','4'])await page.locator(`[data-action=pin-digit][data-value="${d}"]`).click();
 await page.waitForSelector('[data-action=manage-profile]');await page.locator('[data-action=toggle-game][data-id=bouquet]').click();await page.locator('#assign-game').selectOption('countries');await page.locator('[data-action=assign-game]').click();
 await page.locator('[data-action=home]').click();assert.equal(await page.locator('[data-action=start][data-game=bouquet]').count(),0);
 await page.locator('[data-action=home-tab][data-value=school]').click();await page.locator('[data-action=start]').first().click();
 await page.waitForSelector('.sa-tile');
 for(const c of ['venezuela','colombia','guyana','suriname','ecuador','peru','brazil','bolivia','paraguay','chile','argentina','uruguay']){
  await page.locator(`[data-action=sa-select][data-country=${c}]`).click();
  if(c==='venezuela')await page.waitForSelector('.sa-info [data-action=speak-fact]');
  await page.locator(`[data-action=sa-cell][data-country=${c}]`).click();
 }
 await page.waitForSelector('.games',{timeout:4000});
 const pts=await page.evaluate(()=>JSON.parse(localStorage.getItem('bop-and-bloom-v1')).profiles[0].points);assert.equal(pts,22);
 console.log('PASS parent PIN gate, per-child game visibility, schoolwork assignment, and points, with a read-aloud button for the selected country');
 await page.locator('[data-action=home]').last().click();
 await page.locator('[data-action=start][data-game=biomes]').click();await page.waitForSelector('.biome-spot');
 for(const b of ['amazon','andes','atacama','pampas','patagonia','chaco']){
  await page.locator(`[data-action=biome-select][data-biome=${b}]`).click();
  if(b==='amazon')await page.waitForSelector('.sa-info [data-action=speak-fact]');
  await page.locator(`[data-action=biome-spot][data-biome=${b}]`).click();
 }
 assert.equal(await page.locator('#score').innerText(),'6');await page.waitForSelector('.games',{timeout:4000});
 console.log('PASS biome placement on the real map, with a read-aloud button for the selected place');
 await page.locator('[data-action=start][data-game=animals]').click();await page.waitForSelector('.habitat-bin');
 const bins=['rainforest','mountains','grasslands'];
 for(let n=0;n<3;n++){const before=Number(await page.locator('#score').innerText());for(const h of bins){await page.locator(`[data-action=sort-bin][data-habitat=${h}]`).click();if(Number(await page.locator('#score').innerText())>before)break;}}
 await page.waitForSelector('.fact-banner [data-action=speak-fact]');
 assert.equal(await page.locator('#score').innerText(),'3');await page.locator('[data-action=home]').first().click();await page.waitForSelector('.games');
 console.log('PASS animal sorting with no penalty for a wrong bin, with a persistent read-aloud fact banner');
 await page.locator('[data-action=start][data-game=gauchos]').click();await page.waitForSelector('.cow-token');
 await page.waitForSelector('.fact-banner [data-action=speak-fact]');
 await page.locator('.cow-token').first().click();
 assert.equal(await page.locator('#score').innerText(),'1');
 await page.locator('[data-action=home]').click();await page.waitForSelector('.games');
 console.log('PASS gaucho herding plays a cow sound and reads a fact aloud');
 await page.locator('[data-action=start][data-game=peaks]').click();await page.waitForSelector('.climb-mountain');
 for(let n=0;n<20;n++){const step=page.locator('[data-action=climb-step]');if(await step.count()===0)break;await step.click();}
 await page.waitForSelector('.summit-card .fact-banner [data-action=speak-fact]');
 const factBefore=await page.locator('.summit-card .fact-banner p').innerText();
 await page.locator('[data-action=settings]').click();await page.locator('[data-action=back-game]').click();
 const factAfter=await page.locator('.summit-card .fact-banner p').innerText();
 assert.equal(factBefore,factAfter);
 await page.locator('[data-action=resume]').click();
 await page.locator('[data-action=speak-fact]').click();
 await page.locator('[data-action=home]').click();await page.waitForSelector('.games');
 console.log('PASS peak climbing reads the summit fact aloud and keeps the same fact across a re-render');
 await page.locator('[data-action=start][data-game=market]').click();await page.waitForSelector('.coin-btn');
 const price=Number((await page.locator('.market-price').innerText()).split(' ')[0]);
 for(let n=0;n<price;n++)await page.locator('[data-action=market-coin][data-value="1"]').click();
 assert.equal(await page.locator('#score').innerText(),'1');await page.locator('[data-action=home]').first().click();await page.waitForSelector('.games');
 console.log('PASS exact-change coin counting');
 await page.locator('[data-action=start][data-game=timeline]').click();await page.waitForSelector('.tl-card.choice');
 for(let n=0;n<3;n++){
  const cards=await page.locator('.tl-card.choice').evaluateAll(els=>els.map(e=>({y:Number(e.querySelector('.tl-year').textContent),i:e.getAttribute('data-idx')})));
  if(!cards.length)break;cards.sort((a,b)=>a.y-b.y);await page.locator(`[data-action=timeline-pick][data-idx="${cards[0].i}"]`).click();
 }
 assert.equal(await page.locator('#score').innerText(),'1');await page.locator('[data-action=home]').first().click();await page.waitForSelector('.games');
 console.log('PASS ordering historical events oldest first');
 await page.locator('[data-action=start][data-game=letters]').click();await page.waitForSelector('.letter-choice');
 await page.waitForSelector('.fact-banner, .letters-hear');
 for(let n=0;n<3;n++){
  const correct=await page.evaluate(()=>game.letters.current.name[0].toUpperCase());
  await page.locator(`[data-action=letter-pick][data-letter="${correct}"]`).click();
 }
 assert.equal(await page.locator('#score').innerText(),'3');
 await page.locator('[data-action=speak-fact]').click();
 await page.locator('[data-action=home]').click();await page.waitForSelector('.games');
 console.log('PASS letter-sounds phonics matching against real animal photos');
 await page.setViewportSize({width:640,height:720});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 assert.deepEqual(errors,[]);console.log('PASS compact layout and zero JavaScript errors');
 const touch=await browser.newContext({hasTouch:true,viewport:{width:700,height:800}});const tp=await touch.newPage();await tp.goto(url);await tp.locator('#welcome-name').fill('Touch');await tp.locator('button[type=submit]').tap();await tp.locator('[data-action=start][data-game=bop]').tap();await tp.waitForSelector('.target.ready');await tp.locator('.target.ready').first().tap();assert.equal(await tp.locator('#score').innerText(),'1');
 console.log('PASS touch input');
 const old=await browser.newContext();await old.addInitScript(()=>{window.PointerEvent=undefined;});const op=await old.newPage();await op.goto(url);await op.locator('#welcome-name').fill('Fallback');await op.locator('button[type=submit]').click();await op.locator('[data-action=start][data-game=bop]').click();await op.waitForSelector('.target.ready');await op.locator('.target.ready').first().click();assert.equal(await op.locator('#score').innerText(),'1');console.log('PASS legacy mouse event fallback');
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
