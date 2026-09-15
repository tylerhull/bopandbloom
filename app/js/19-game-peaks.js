/* Peak Climber!: route up a real Patagonian/Andean peak. */
function climberIcon(){return '<svg viewBox="0 0 30 30" aria-hidden="true"><circle cx="15" cy="6" r="4" fill="#8a5a2b"/><path d="M15 10v9m0-6l-8 3m8-3l8 3m-8 6l-6 8m6-8l6 8" stroke="#293b36" stroke-width="3" stroke-linecap="round" fill="none"/><path d="M15 10v6" stroke="#d9614f" stroke-width="4" stroke-linecap="round"/></svg>';}
function flagIcon(){return '<svg viewBox="0 0 30 30" aria-hidden="true"><path d="M8 2v26" stroke="#5a4632" stroke-width="2.5" stroke-linecap="round"/><path d="M8 3l16 6-16 6z" fill="#e8a33d"/></svg>';}
function mountainScene(g){
 var route=climbWaypoints.map(function(p){return p[0]+','+p[1];}).join(' L ');
 var head=climbWaypoints[g.climb.progress];
 var summit=climbWaypoints[climbWaypoints.length-1];
 var p=g.climb.peak;
 return '<div class="climb-photo-outer"><div class="climb-photo-wrap" style="padding-top:'+(p.pt||75)+'%">'
  +'<img class="climb-photo" src="'+p.photo+'" alt="'+esc(p.name)+'">'
  +'<svg class="climb-mountain" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" aria-label="Route up '+esc(p.name)+'">'
  +'<path d="M '+route+'" stroke="#fffdf4" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity=".8"/>'
  +'<path d="M '+route+'" stroke="#5a4632" stroke-width="1" stroke-dasharray="2.4 2.2" stroke-linecap="round" fill="none"/>'
  +climbWaypoints.map(function(p2,i){
   var isLast=i===climbWaypoints.length-1;
   var isNext=i===g.climb.progress+1;
   var isPast=i<=g.climb.progress;
   var showHint=isNext&&g.diff!=='hard'&&!g.climb.celebrating;
   var clickable=isNext&&!g.climb.celebrating;
   var r=isLast?(clickable?8:0):(clickable?6:(isPast?3.6:2.6));
   if(isLast&&!clickable)return '';
   return '<circle cx="'+p2[0]+'" cy="'+p2[1]+'" r="'+r+'" fill="'+(isLast?'transparent':(isPast?'#78a063':'#fffdf4'))+'" stroke="'+(isLast?'none':'#5a4632')+'" stroke-width="1" class="'+(showHint?'climb-hint':'')+'" '+(clickable?'data-action="climb-step" data-idx="'+i+'"':'')+'/>';
  }).join('')
  +'<g transform="translate('+(summit[0]-4)+' '+(summit[1]-13)+') scale(0.9)">'+flagIcon()+'</g>'
  +'<g transform="translate('+(head[0]-5)+' '+(head[1]-11)+') scale(0.9)">'+climberIcon()+'</g>'
  +'</svg></div></div>';
}
function newClimbRound(g){
 var pool=peaks.filter(function(p){return !g.climb||p.id!==g.climb.peak.id;});
 var peak=pool[Math.floor(Math.random()*pool.length)]||peaks[0];
 g.climb={peak:peak,progress:0,celebrating:false};
}
function climbView(g){
 var c=g.climb;
 if(c.celebrating){
  var p=c.peak;
  return '<div class="summit-card">'+confettiHtml()+'<img src="'+p.photo+'" alt="'+esc(p.name)+'" class="summit-photo"><h2>'+esc(p.name)+'</h2><p class="quiet">'+esc(p.location)+' · '+esc(p.height)+'</p><div class="fact-banner"><button class="icon-button" data-action="speak-fact" aria-label="Read fact aloud">'+icon('sound')+'</button><p>'+esc(c.fact)+'</p></div><p class="hint">'+esc(p.credit)+'</p><button class="big-button" data-action="next-peak">'+icon('play')+'Climb the next peak!</button></div>';
 }
 return '<div class="climb-wrap"><div class="climb-info"><strong>'+esc(c.peak.name)+'</strong><span class="quiet">'+esc(c.peak.location)+' · '+esc(c.peak.height)+'</span></div>'+mountainScene(g)+'</div>';
}
function climbStep(idx){
 if(!game||game.paused||game.ended||game.type!=='peaks'||game.climb.celebrating)return;
 var g=game,c=game.climb;
 if(idx!==c.progress+1)return;
 c.progress=idx;
 tone('snip');
 if(c.progress>=climbWaypoints.length-1){
  g.score++;
  c.celebrating=true;
  c.fact=c.peak.facts[Math.floor(Math.random()*c.peak.facts.length)];
  g.fact=c.fact;
  fanfare();
  var scoreEl=$('#score');if(scoreEl)scoreEl.textContent=g.score;
  renderGame();
  speakText(c.fact);
  return;
 }
 renderGame();
}
