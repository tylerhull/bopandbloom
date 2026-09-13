/* Run with Playwright installed: node tests/browser.cjs
   Uses a temporary local server and fresh browser profiles. */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert=require('node:assert/strict');
const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const assets=path.resolve(__dirname,'../app');
const server=http.createServer((req,res)=>{
 const file=path.join(assets,req.url==='/'?'index.html':path.basename(req.url));
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
 await page.locator('[data-action=finish]').click();assert.equal(await page.locator('.result-score').innerText(),'2');await page.locator('[data-action=home]').last().click();
 console.log('PASS mouse, keyboard, pause, finish, and no penalties');
 await page.locator('[data-action=start][data-game=bloom]').click();await page.waitForTimeout(1600);await page.locator('#target-0').click();assert.equal(await page.locator('#score').innerText(),'1');await page.locator('#target-0').click();assert.equal(await page.locator('#score').innerText(),'1');await page.waitForTimeout(1800);await page.locator('#target-0').click();assert.equal(await page.locator('#score').innerText(),'2');await page.locator('[data-action=finish]').click();await page.locator('[data-action=home]').last().click();
 console.log('PASS flower snipping, regrowth, and rapid-click protection');
 await page.locator('[data-action=settings]').click();await page.locator('[data-value=effects]').click();await page.locator('[data-value=music]').click();await page.locator('#volume').fill('37');await page.locator('#pace').selectOption('gentle');await page.locator('[data-value=reduced]').click();await page.reload();
 const st=await page.evaluate(()=>JSON.parse(localStorage.getItem('bop-and-bloom-v1')));assert.equal(st.settings.effects,false);assert.equal(st.settings.music,false);assert.equal(st.settings.volume,37);assert.equal(st.settings.reduced,true);assert.equal(st.profiles[0].mode,'gentle');
 console.log('PASS sound, volume, pace, and reduced-motion persistence');
 await page.clock.install();await page.locator('[data-action=start][data-game=bop]').click();await page.clock.runFor(1000);await page.locator('.target.ready').first().click();
 await page.locator('[data-action=pause]').click();const time=await page.locator('#time').innerText();await page.clock.runFor(10000);assert.equal(await page.locator('#time').innerText(),time);await page.locator('[data-action=resume]').click();await page.clock.runFor(61000);assert.equal(await page.locator('.result-score').innerText(),'1');
 const best=await page.evaluate(()=>JSON.parse(localStorage.getItem('bop-and-bloom-v1')).profiles[0].best.bop);assert.equal(best,1);
 console.log('PASS timed round completion, paused timer, best score');
 await page.locator('[data-action=home]').last().click();await page.setViewportSize({width:640,height:720});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 assert.deepEqual(errors,[]);console.log('PASS compact layout and zero JavaScript errors');
 const touch=await browser.newContext({hasTouch:true,viewport:{width:700,height:800}});const tp=await touch.newPage();await tp.goto(url);await tp.locator('#welcome-name').fill('Touch');await tp.locator('button[type=submit]').tap();await tp.locator('[data-action=start][data-game=bop]').tap();await tp.waitForSelector('.target.ready');await tp.locator('.target.ready').first().tap();assert.equal(await tp.locator('#score').innerText(),'1');
 console.log('PASS touch input');
 const old=await browser.newContext();await old.addInitScript(()=>{window.PointerEvent=undefined;});const op=await old.newPage();await op.goto(url);await op.locator('#welcome-name').fill('Fallback');await op.locator('button[type=submit]').click();await op.locator('[data-action=start][data-game=bop]').click();await op.waitForSelector('.target.ready');await op.locator('.target.ready').first().click();assert.equal(await op.locator('#score').innerText(),'1');console.log('PASS legacy mouse event fallback');
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
