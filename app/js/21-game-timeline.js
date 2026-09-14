/* Time Traveler!: order historical events. */
function newTimelineRound(g){
 var count=g.diff==='easy'?3:4;
 var pool=timelineEvents.slice();
 for(var i=pool.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=pool[i];pool[i]=pool[j];pool[j]=t;}
 g.timeline={remaining:pool.slice(0,count),placed:[],celebrating:false,total:count};
}
function timelineView(g){
 var t=g.timeline,showYears=g.diff!=='hard';
 if(t.celebrating)return '<div class="timeline-wrap"><div class="maze-celebrate">'+confettiHtml()+'<div class="banner"><h3>In order!</h3><p>A new set of moments is on the way.</p></div></div><div class="timeline-track"></div></div>';
 var placed=t.placed.map(function(e,i){return '<div class="tl-card placed"><span class="tl-num">'+(i+1)+'</span><span class="tl-year">'+e.year+'</span><p>'+esc(e.text)+'</p></div>';}).join('');
 var choices=t.remaining.map(function(e,i){return '<button class="tl-card choice" data-action="timeline-pick" data-idx="'+i+'"><span class="tl-year">'+(showYears?e.year:'?')+'</span><p>'+esc(e.text)+'</p></button>';}).join('');
 return '<div class="timeline-wrap"><p class="hint">Tap the moment that happened <strong>earliest</strong> of the ones left.</p><div class="timeline-track">'+(placed||'<p class="quiet">Nothing placed yet — start with the oldest.</p>')+'</div><div class="tl-choices">'+choices+'</div></div>';
}
function timelinePick(idx){
 if(!game||game.paused||game.ended||game.type!=='timeline'||game.timeline.celebrating)return;
 var g=game,t=g.timeline,pick=t.remaining[idx];
 if(!pick)return;
 var earliest=t.remaining.reduce(function(a,b){return a.year<=b.year?a:b;});
 if(pick.year!==earliest.year){
  tone('nope');
  var el=document.querySelectorAll('.tl-card.choice')[idx];
  if(el){el.classList.add('nope');setTimeout(function(){el.classList.remove('nope');},420);}
  return;
 }
 t.remaining.splice(idx,1);t.placed.push(pick);tone('snip');
 if(!t.remaining.length){
  g.score++;t.celebrating=true;fanfare();
  var scoreEl=$('#score');if(scoreEl)scoreEl.textContent=g.score;
  renderGame();
  setTimeout(function(){if(!game||game!==g||game.ended)return;newTimelineRound(g);renderGame();},1600);
  return;
 }
 renderGame();
}
