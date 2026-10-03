/* Generic game engine: start/pause/resume/finish, the per-frame tick loop, and difficulty. */
/* Shared helpers for the tap-to-answer games (count/add/more/order/build). */
function shuffleArr2(a){for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t;}return a;}
function numChoices(correct,min,max,want){
 var set={};set[correct]=1;var guard=0;
 while(Object.keys(set).length<want&&guard++<200){var d=correct+(Math.floor(Math.random()*5)-2);if(d>=min&&d<=max)set[d]=1;}
 for(var i=min;i<=max&&Object.keys(set).length<want;i++)set[i]=1;
 return shuffleArr2(Object.keys(set).map(Number));
}
function celebrateInner(msg,sub){return '<div class="maze-celebrate">'+confettiHtml()+'<div class="banner"><h3>'+msg+'</h3><p>'+(sub||'')+'</p></div></div>';}
function wiggleEl(sel){var b=document.querySelector(sel);if(b){b.classList.add('nope');setTimeout(function(){b.classList.remove('nope');},420);}}
function setScore(n){var s=$('#score');if(s)s.textContent=n;}
function roundAdvance(sub,g,onNew){
 if(!sub.queue.length){sub.celebrating=true;fanfare();renderGame();setTimeout(function(){if(!game||game!==g||game.ended)return;onNew();renderGame();},1500);return;}
 sub.current=sub.queue.shift();renderGame();
}
function diffToMode(type,d){if(['trace','memory','shapes','patterns','flash','build','count','add','more','order'].indexOf(type)>=0)return 'relaxed';if(type==='scurry')return d==='hard'?'speedy':'relaxed';return d==='hard'?'speedy':d==='medium'?'gentle':'relaxed';}
function startGame(type,assignmentId){
 stopGame();uiScreen='game';var p=current();
 var diff=(p.difficulty&&p.difficulty[type])||'easy';
 game={type:type,diff:diff,score:0,elapsed:0,paused:false,mode:diffToMode(type,diff),last:performance.now(),frame:null,ended:false,spawn:0,spawned:0,assignmentId:assignmentId||null};
 if(type==='bop'){game.slots=[];for(var i=0;i<9;i++)game.slots.push({active:false,until:0,cut:0});}
 else if(type==='bloom'){game.slots=[];for(var j=0;j<9;j++)game.slots.push(newFlowerSlot());}
 else if(type==='bouquet'){game.slots=[];for(var k=0;k<9;k++)game.slots.push(newFlowerSlot());newBouquetRound(game);}
 else if(type==='scurry'){game.mazeSize=mazeSizeFor(diff);newMazeRound(game);}
 else if(type==='countries'){game.puzzle={placed:{},selected:null};}
 else if(type==='gauchos'){newHerdRound(game);}
 else if(type==='peaks'){newClimbRound(game);}
 else if(type==='biomes'){game.biome={placed:{},selected:null};}
 else if(type==='animals'){newSortRound(game);}
 else if(type==='market'){newMarketRound(game);}
 else if(type==='timeline'){newTimelineRound(game);}
 else if(type==='letters'){newLetterRound(game);}
 else if(type==='trace'){newTraceRound(game);}
 else if(type==='flags'){newFlagRound(game);}
 else if(type==='memory'){newMemoryRound(game);}
 else if(type==='shapes'){newShapeRound(game);}
 else if(type==='patterns'){newPatternRound(game);}
 else if(type==='flash'){newFlashRound(game);}
 else if(type==='build'){newBuildRound(game);}
 else if(type==='count'){newCountRound(game);}
 else if(type==='add'){newAddRound(game);}
 else if(type==='more'){newMoreRound(game);}
 else if(type==='order'){newOrderRound(game);}
 render();game.frame=requestAnimationFrame(tick);
}
function difficultyRow(g){
 if(g.type==='trace')return '';
 var p=current(),enabled=p.enabledDifficulties||DIFF_LEVELS;
 if(enabled.length<2)return '';
 return '<div class="diff-row">'+DIFF_LEVELS.filter(function(d){return enabled.indexOf(d)>=0;}).map(function(d){return '<button class="diff-pill'+(g.diff===d?' active':'')+'" data-action="set-difficulty" data-value="'+d+'">'+diffLabels[d]+'</button>';}).join('')+'</div>';
}
function renderGame(){
 if(!game)return;
 var g=game,timed=g.mode!=='relaxed';
 var prompt={bop:'Bop a mouse when it peeks out!',bloom:'Snip the flowers. Watch them grow again!',scurry:'Drop cheese to guide the mouse home!',bouquet:'Snip the matching flowers for the bouquet!',countries:'Match each country to its place on the map!',gauchos:'Round up the wandering herd and bring them home!',peaks:'Guide the climber up the route to the summit!',biomes:'Find each wild place on the map of South America!',animals:'Send each animal home to the right wild place!',market:'Count out the right coins to buy the treat!',timeline:'Put these moments in order, oldest first!',letters:'Look, listen, and match the letter it starts with!',trace:'Trace the letter or number with your finger!',flags:'Listen for the country, then tap its flag!',memory:'Flip two cards to find a matching pair!',shapes:'Sort each shape into the right bin!',patterns:'Look at the pattern — what comes next?',flash:'Look and listen — tap Next for another card!',build:'Spell the picture’s name — tap the letters in order!',count:'Count the things, then tap how many!',add:'Work out the answer, then tap the number!',more:'Tap the group the question asks for!',order:'Tap the numbers in order, smallest first!'}[g.type];
 var bodies={scurry:mazeView,countries:puzzleView,gauchos:herdView,peaks:climbView,biomes:biomeView,animals:sortView,market:marketView,timeline:timelineView,letters:letterView,trace:traceView,flags:flagView,memory:memoryView,shapes:shapeView,patterns:patternView,flash:flashView,build:buildView,count:countView,add:addView,more:moreView,order:orderView};
 var body=(bodies[g.type]||classicField)(g);
 var tips={scurry:'Click, tap, or use arrow keys / W A S D to drop cheese.',countries:'Tap a country from the list, then tap its spot on the map.',gauchos:'Tap a cow to send it home to the corral.',peaks:'Tap the next dot up the route.',biomes:'Tap a wild place, then tap its circle on the map.',animals:'Tap the habitat where this animal lives.',market:'Tap coins until they add up to the price.',timeline:'Tap the card that happened earliest.',letters:'Tap the speaker to hear its name again, then tap a letter.',trace:'Draw over the shape. Tap Clear to redo, Next for a new one.',flags:'Tap the speaker to hear the country again, then tap its flag.',memory:'Tap a card to flip it. Find both halves of each pair.',shapes:'Look at the shape, then tap the bin that matches.',patterns:'Find the pattern, then tap the shape that comes next.',flash:'Tap the speaker to hear the name, or Next for another card.',build:'Tap the letter tiles in order to spell the word.',count:'Count the pictures, then tap the matching number.',add:'Count what you see, then tap the answer.',more:'Tap the group with more (or fewer) pictures.',order:'Tap the smallest number first, then the next.'};
 var tip=tips[g.type]||'Click or tap to play. Keyboard: Q W E / A S D / Z X C, or 1–9.';
 shell('<main><div class="game-header"><div class="game-heading"><button class="icon-button" data-action="home" aria-label="Back to playroom">'+icon('home')+'</button><h1>'+esc(current().name)+'’s '+gameNames[g.type]+'</h1></div><div class="scoreboard"><div class="score"><small>'+gameScores[g.type]+'</small><span id="score">'+g.score+'</span></div><div class="score"><small>'+(timed?'SECONDS':'YOUR PACE')+'</small><span id="time">'+(timed?Math.ceil(60-g.elapsed):'∞')+'</span></div><button class="icon-button" data-action="pause" aria-label="Pause game">'+icon('pause')+'</button></div></div>'+difficultyRow(g)+'<div class="progress-track"><div id="progress" class="progress-bar"></div></div><div class="playfield '+g.type+'-field"><div class="field-top"><span>'+prompt+'</span><strong>'+(timed?'Let’s explore':'No hurry. Just play.')+'</strong></div>'+body+'<div id="pause-layer"></div></div><div class="field-footer"><span class="game-tip">'+tip+'</span><button class="pill" data-action="finish">'+icon('check')+'All done</button></div></main>');
 if(g.type==='trace')setupTraceCanvas(g);
 if(g.paused)showPause();
}
function tick(now){
 if(!game)return;
 var g=game,elapsed=Math.max(0,(now-g.last)/1000),dt=Math.min(elapsed,.1);
 g.last=now;
 if(!g.paused&&!g.ended){
  g.elapsed+=elapsed;
  if(g.mode!=='relaxed'&&g.elapsed>=60){finishGame();return;}
  if(g.type==='bop'){
   var active=0;
   g.slots.forEach(function(s,i){if(s.active){active++;if(g.mode!=='relaxed'&&g.elapsed>s.until){s.active=false;var el=$('#target-'+i);if(el)el.classList.remove('ready');}}});
   g.spawn-=dt;var max=g.mode==='speedy'?4:g.mode==='gentle'?3:2;
   if(g.spawn<=0&&active<max){
    var available=[];g.slots.forEach(function(s,i){if(!s.active&&g.elapsed>s.cut)available.push(i);});
    if(available.length){var index=available[Math.floor(Math.random()*available.length)],slot=g.slots[index];slot.active=true;slot.until=g.elapsed+(g.mode==='speedy'?1.6:3.3);g.spawned=(g.spawned||0)+1;var el=$('#target-'+index);if(el){el.className='target ready';el.setAttribute('aria-label','Bop mouse '+(index+1));}}
    g.spawn=g.mode==='speedy'?.4:.75;
   }
  } else if(g.type==='bloom'||g.type==='bouquet'){
   g.slots.forEach(function(s,i){
    if(g.elapsed<s.cut)return;
    s.growth=Math.min(1,s.growth+dt/(g.mode==='speedy'?2.5:4.5));
    var el=$('#target-'+i);
    if(el){el.querySelector('svg').innerHTML=flowerArt(s.species,s.hue,s.growth);el.setAttribute('aria-label',(s.growth>=.95?'Blooming flower ':'Growing flower ')+(i+1));if(g.type==='bouquet')el.classList.toggle('wanted',s.growth>=.95&&matchTargetIndex(g,s)>=0);}
   });
   if(g.type==='bouquet')tickBouquetTimeout(g,dt);
  } else if(g.type==='gauchos'&&g.herd&&g.herd.speed&&!g.herd.celebrating){
   g.herd.cows.forEach(function(c){
    c.retarget-=dt;
    if(c.retarget<=0){c.vx=(Math.random()*2-1)*g.herd.speed;c.vy=(Math.random()*2-1)*g.herd.speed;c.retarget=1.5+Math.random()*2;}
    c.x+=c.vx*dt*10;c.y+=c.vy*dt*10;
    if(c.x<6){c.x=6;c.vx=Math.abs(c.vx);}if(c.x>78){c.x=78;c.vx=-Math.abs(c.vx);}
    if(c.y<8){c.y=8;c.vy=Math.abs(c.vy);}if(c.y>86){c.y=86;c.vy=-Math.abs(c.vy);}
    var el=document.getElementById('cow-'+c.id);
    if(el){el.style.left=c.x+'%';el.style.top=c.y+'%';}
   });
  }
  if(g.mode!=='relaxed'){var t=$('#time');if(t)t.textContent=Math.max(0,Math.ceil(60-g.elapsed));var pr=$('#progress');if(pr)pr.style.width=(Math.max(0,1-g.elapsed/60)*100)+'%';}
 }
 g.frame=requestAnimationFrame(tick);
}
function hit(index){
 if(!game||game.paused||game.ended)return;
 var g=game,s=g.slots[index],el=$('#target-'+index);
 if(!el)return;
 if(g.type==='bop'){
  if(!s.active)return;
  s.active=false;s.cut=g.elapsed+.4;el.classList.remove('ready');el.classList.add('hit');el.setAttribute('aria-label','Empty mouse path '+(index+1));
  tone('bop');
 } else if(g.type==='bloom'){
  if(s.growth<.28||g.elapsed<s.cut)return;
  var fresh=newFlowerSlot();s.growth=0;s.cut=g.elapsed+.35;s.species=fresh.species;s.hue=fresh.hue;
  el.querySelector('svg').innerHTML=flowerArt(s.species,s.hue,0);
  tone('snip');
 } else if(g.type==='bouquet'){
  if(s.growth<.28||g.elapsed<s.cut)return;
  var ti=matchTargetIndex(g,s);
  if(ti<0){el.classList.add('nope');tone('nope');setTimeout(function(){el.classList.remove('nope');},420);return;}
  g.vase[ti]=true;
  var fresh2=newFlowerSlot();s.growth=0;s.cut=g.elapsed+.35;s.species=fresh2.species;s.hue=fresh2.hue;
  tone('snip');
  if(g.vase.every(function(v){return v;})){
   g.score++;
   tone('finish');toast('Bouquet complete! A new one is waiting.');
   newBouquetRound(g);
  }
  renderGame();
  return;
 } else return;
 var pop=document.createElement('span');pop.className='pop-score';pop.textContent=g.type==='bop'?'★':'✂';el.appendChild(pop);
 setTimeout(function(){if(pop.parentNode)pop.parentNode.removeChild(pop);},650);
 g.score++;var scoreEl=$('#score');if(scoreEl)scoreEl.textContent=g.score;
}
function pauseGame(){if(!game||game.paused)return;game.paused=true;showPause();audioSync();}
function showPause(){var layer=$('#pause-layer');if(layer)layer.innerHTML='<div class="pause-cover"><div><h2>A little breather.</h2><p>Your garden will wait for you.</p><button class="big-button" data-action="resume">'+icon('play')+'Keep playing</button></div></div>';}
function resumeGame(){if(!game)return;game.paused=false;game.last=performance.now();$('#pause-layer').innerHTML='';audioSync();}
function stopGame(){if(game&&game.frame)cancelAnimationFrame(game.frame);game=null;}
function completeAssignment(g){
 if(!g.assignmentId)return 0;
 var p=current();
 var a=(p.assignments||[]).filter(function(x){return x.id===g.assignmentId;})[0];
 if(!a||(a.completed&&!a.recurring))return 0;
 var earned=10+g.score;
 a.completedAt=Date.now();a.score=g.score;a.timesPlayed=(a.timesPlayed||0)+1;
 if(!a.recurring)a.completed=true;
 p.points=(p.points||0)+earned;
 save();
 return earned;
}
function finishGame(){
 if(!game||game.ended)return;
 game.ended=true;
 cancelAnimationFrame(game.frame);
 var g=game,p=current(),best=false;
 if(g.mode!=='relaxed'&&g.score>p.best[g.type]){p.best[g.type]=g.score;best=true;save();}
 logActivity(g.type,g.score,Math.round(g.elapsed));
 var earned=completeAssignment(g);
 tone('finish');
 var resultText=g.type==='bop'?(g.score+' of '+(g.spawned||g.score)+' mice caught'):(g.score+' '+gameLabels[g.type]);
 var bestText=g.mode!=='relaxed'?' · best '+p.best[g.type]:'';
 toast((best?'New personal best! ':'')+resultText+bestText+'. Lovely playing, '+p.name+'!'+(earned?' +'+earned+' points!':''));
 stopGame();draft=null;closeModal();uiScreen='home';render();
}
