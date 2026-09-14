/* Gaucho Herd!: round up wandering cows. */
function cowIcon(){return '<svg viewBox="0 0 60 50" aria-hidden="true"><ellipse cx="30" cy="30" rx="24" ry="16" fill="#fdfaf3"/><path d="M10 24q6-10 10 0" fill="#3a3226" opacity=".85"/><path d="M40 20q8 4 6 14" fill="#3a3226" opacity=".7"/><circle cx="14" cy="28" r="10" fill="#3a3226"/><circle cx="46" cy="28" r="10" fill="#3a3226"/><ellipse cx="30" cy="20" rx="14" ry="11" fill="#fdfaf3"/><ellipse cx="24" cy="19" rx="3" ry="4" fill="#3a3226"/><ellipse cx="36" cy="19" rx="3" ry="4" fill="#3a3226"/><path d="M20 27h20" stroke="#3a3226" stroke-width="2" stroke-linecap="round"/><ellipse cx="30" cy="44" rx="10" ry="6" fill="#e7c9a0"/></svg>';}
function corralIcon(){return '<svg viewBox="0 0 140 100" aria-hidden="true"><rect x="6" y="30" width="128" height="60" rx="10" fill="#c9a877" opacity=".35"/><g stroke="#7a5a35" stroke-width="5" stroke-linecap="round"><path d="M10 40h120M10 60h120M10 80h120"/><path d="M10 30v60M40 30v60M70 30v60M100 30v60M130 30v60"/></g></svg>';}
function newHerdRound(g){
 var count=g.mode==='speedy'?7:g.mode==='gentle'?6:5;
 var speed=g.diff==='hard'?1.6:g.diff==='medium'?0.7:0;
 var cows=[];
 for(var i=0;i<count;i++)cows.push({id:i,x:8+Math.random()*62,y:12+Math.random()*70,vx:(Math.random()*2-1)*speed,vy:(Math.random()*2-1)*speed,retarget:1.5+Math.random()*2});
 g.herd={cows:cows,total:count,corralled:0,celebrating:false,speed:speed};
 g.fact=gauchoFacts[Math.floor(Math.random()*gauchoFacts.length)];
 speakText(g.fact);
}
function herdView(g){
 var h=g.herd;
 var cowsHtml=h.cows.map(function(c){return '<button class="cow-token" id="cow-'+c.id+'" style="left:'+c.x+'%;top:'+c.y+'%" data-action="herd-cow" data-id="'+c.id+'" aria-label="Cow">'+cowIcon()+'</button>';}).join('');
 var overlay=h.celebrating?'<div class="maze-celebrate">'+confettiHtml()+'<div class="banner"><h3>Herd’s home!</h3><p>A new herd is wandering in.</p></div></div>':'';
 var fact=g.fact?'<div class="fact-banner"><button class="icon-button" data-action="speak-fact" aria-label="Read fact aloud">'+icon('sound')+'</button><p>'+esc(g.fact)+'</p></div>':'';
 return '<div class="herd-wrap">'+overlay+fact+'<div class="herd-field">'+cowsHtml+'<div class="corral"><div class="corral-count">'+h.corralled+' / '+h.total+'</div>'+corralIcon()+'</div></div></div>';
}
function herdClickCow(cowId){
 if(!game||game.paused||game.ended||game.type!=='gauchos'||game.herd.celebrating)return;
 var g=game,h=g.herd,idx=-1;
 for(var i=0;i<h.cows.length;i++)if(h.cows[i].id===cowId){idx=i;break;}
 if(idx<0)return;
 h.cows.splice(idx,1);h.corralled++;g.score++;
 moo();
 var scoreEl=$('#score');if(scoreEl)scoreEl.textContent=g.score;
 if(!h.cows.length){
  h.celebrating=true;
  fanfare();
  toast('The whole herd is home! A new herd is on its way.');
  renderGame();
  setTimeout(function(){if(!game||game!==g||game.ended)return;newHerdRound(g);renderGame();},1150);
  return;
 }
 renderGame();
}
