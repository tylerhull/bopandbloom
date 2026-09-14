/* Animal Sort!: sort animals into their habitats. */
function animalIcon(id){
 var a={
  jaguar:'<path d="M20 42v5M40 42v5" stroke="#d99a3d" stroke-width="5" stroke-linecap="round"/><ellipse cx="32" cy="32" rx="19" ry="12" fill="#e8b055"/><path d="M50 30q9-5 6 9" stroke="#e8b055" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="16" cy="22" r="11" fill="#e8b055"/><path d="M7 14l4 7 5-4zM25 14l-4 7-5-4z" fill="#e8b055"/><g fill="#6b4b25" opacity=".75"><circle cx="30" cy="27" r="2.2"/><circle cx="39" cy="33" r="2"/><circle cx="31" cy="37" r="1.7"/><circle cx="44" cy="29" r="1.8"/></g><circle cx="12" cy="21" r="1.8" fill="#3a3226"/><circle cx="20" cy="21" r="1.8" fill="#3a3226"/><path d="M14 27q2 2 4 0" stroke="#3a3226" stroke-width="1.4" fill="none"/>',
  toucan:'<path d="M26 46v3M34 46v3" stroke="#e8a33d" stroke-width="3" stroke-linecap="round"/><ellipse cx="32" cy="30" rx="15" ry="16" fill="#2f2b28"/><circle cx="26" cy="18" r="10" fill="#2f2b28"/><path d="M20 15q-16 1-16 7 0 5 16 5z" fill="#f2a13d"/><path d="M20 17q-12 1-12 5" stroke="#d9614f" stroke-width="2" fill="none"/><circle cx="26" cy="15" r="2.4" fill="#fffdf2"/><circle cx="26" cy="15" r="1.2" fill="#2f2b28"/><path d="M30 36q10 2 12 10" stroke="#2f2b28" stroke-width="4" fill="none" stroke-linecap="round"/><ellipse cx="24" cy="24" rx="6" ry="3" fill="#f5e06a"/>',
  sloth:'<path d="M10 10q12 4 22 0" stroke="#7a5a35" stroke-width="4" stroke-linecap="round" fill="none"/><ellipse cx="32" cy="32" rx="14" ry="13" fill="#a98c62"/><circle cx="32" cy="20" r="10" fill="#c4ab84"/><path d="M22 16q-8-2-9-7M42 16q8-2 9-7" stroke="#a98c62" stroke-width="5" fill="none" stroke-linecap="round"/><ellipse cx="27" cy="19" rx="3.4" ry="3" fill="#6b5433"/><ellipse cx="37" cy="19" rx="3.4" ry="3" fill="#6b5433"/><circle cx="27" cy="19" r="1.3" fill="#fffdf2"/><circle cx="37" cy="19" r="1.3" fill="#fffdf2"/><path d="M29 26q3 3 6 0" stroke="#6b5433" stroke-width="1.6" fill="none"/>',
  llama:'<path d="M22 44v5M34 44v5M28 44v5M40 44v5" stroke="#e6d7bd" stroke-width="4" stroke-linecap="round"/><ellipse cx="32" cy="34" rx="15" ry="11" fill="#e0c9a0"/><path d="M20 30q-5-12-4-18" stroke="#e0c9a0" stroke-width="9" stroke-linecap="round" fill="none"/><ellipse cx="15" cy="11" rx="7" ry="6" fill="#e0c9a0"/><path d="M11 5l-1-6 4 4zM19 5l1-6-4 4z" fill="#e0c9a0"/><circle cx="12" cy="10" r="1.6" fill="#3a3226"/><ellipse cx="10" cy="14" rx="3" ry="2" fill="#d6bfa0"/>',
  condor:'<path d="M30 24q-26-14-28 2 12 8 26 6z" fill="#3a3630"/><path d="M34 24q26-14 28 2-12 8-26 6z" fill="#3a3630"/><ellipse cx="32" cy="30" rx="8" ry="12" fill="#2f2b28"/><ellipse cx="32" cy="20" rx="7" ry="4" fill="#fffdf2"/><circle cx="32" cy="14" r="6" fill="#8a6a4a"/><path d="M32 10q4 0 4 4" stroke="#e8a33d" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="30" cy="13" r="1.3" fill="#2f2b28"/><path d="M28 42l-2 6M36 42l2 6" stroke="#2f2b28" stroke-width="3" stroke-linecap="round"/>',
  chinchilla:'<ellipse cx="30" cy="34" rx="14" ry="12" fill="#b8b4bd"/><circle cx="28" cy="21" r="10" fill="#c9c5cf"/><ellipse cx="19" cy="13" rx="6" ry="8" fill="#b8b4bd" transform="rotate(-20 19 13)"/><ellipse cx="37" cy="13" rx="6" ry="8" fill="#b8b4bd" transform="rotate(20 37 13)"/><circle cx="24" cy="21" r="2" fill="#3a3226"/><circle cx="33" cy="21" r="2" fill="#3a3226"/><ellipse cx="28.5" cy="25" rx="2" ry="1.4" fill="#d9868f"/><path d="M22 26q-8 1-11 3M35 26q8 1 11 3" stroke="#8e8a96" stroke-width="1" fill="none"/><path d="M43 32q12-4 10 10" stroke="#b8b4bd" stroke-width="7" fill="none" stroke-linecap="round"/>',
  capybara:'<path d="M20 42v6M32 42v6M42 42v6" stroke="#8a6a45" stroke-width="5" stroke-linecap="round"/><ellipse cx="33" cy="32" rx="19" ry="13" fill="#9c7a52"/><path d="M14 24h16v14H14q-6-7 0-14z" fill="#9c7a52"/><ellipse cx="13" cy="31" rx="6" ry="6" fill="#9c7a52"/><ellipse cx="9" cy="31" rx="3" ry="2.4" fill="#6b4f33"/><circle cx="17" cy="25" r="1.8" fill="#3a3226"/><ellipse cx="21" cy="21" rx="3" ry="2.6" fill="#6b4f33"/>',
  rhea:'<path d="M30 38v10M38 38v10" stroke="#b3ad9c" stroke-width="3" stroke-linecap="round"/><path d="M27 48h-6M35 48h6" stroke="#b3ad9c" stroke-width="3" stroke-linecap="round"/><ellipse cx="34" cy="30" rx="15" ry="12" fill="#c8c2b0"/><path d="M24 22q-6-12-4-16" stroke="#c8c2b0" stroke-width="6" stroke-linecap="round" fill="none"/><ellipse cx="19" cy="6" rx="6" ry="5" fill="#c8c2b0"/><path d="M14 6q-5 1-5 3l5 1z" fill="#9c8e6a"/><circle cx="17" cy="5" r="1.5" fill="#3a3226"/><path d="M40 24q10 2 8 12" stroke="#b3ad9c" stroke-width="4" fill="none" stroke-linecap="round"/>',
  armadillo:'<path d="M22 42v5M34 42v5" stroke="#8a7d6a" stroke-width="4" stroke-linecap="round"/><path d="M12 38q2-22 22-22t20 22z" fill="#a89a83"/><g stroke="#6e6252" stroke-width="1.6" fill="none"><path d="M20 20v18M28 16v22M36 16v22M44 20v18"/></g><ellipse cx="9" cy="34" rx="8" ry="5" fill="#bdb09a"/><path d="M2 34q-1 0-1 1" stroke="#6e6252" stroke-width="1.4"/><circle cx="7" cy="32" r="1.5" fill="#3a3226"/><path d="M52 36q10 2 7 10" stroke="#a89a83" stroke-width="3.5" fill="none" stroke-linecap="round"/>',
  penguin:'<ellipse cx="30" cy="30" rx="14" ry="18" fill="#2f2f38"/><ellipse cx="30" cy="33" rx="9" ry="13" fill="#fffdf6"/><circle cx="30" cy="14" r="9" fill="#2f2f38"/><circle cx="26" cy="13" r="1.8" fill="#fffdf6"/><circle cx="34" cy="13" r="1.8" fill="#fffdf6"/><path d="M30 16l-4 3 4 3 4-3z" fill="#e8a33d"/><path d="M16 26q-5 8 0 14M44 26q5 8 0 14" stroke="#2f2f38" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M24 47l-5 3M36 47l5 3" stroke="#e8a33d" stroke-width="3.5" stroke-linecap="round"/>',
  sealion:'<path d="M14 36q4-16 22-14 18 2 22 14z" fill="#8a6f52"/><ellipse cx="34" cy="38" rx="24" ry="7" fill="#7a6047"/><circle cx="16" cy="24" r="9" fill="#8a6f52"/><ellipse cx="9" cy="26" rx="4" ry="3" fill="#5c4835"/><circle cx="14" cy="21" r="1.7" fill="#2f2b28"/><path d="M10 28q-7 1-9 3M10 30q-7 3-8 5" stroke="#5c4835" stroke-width="1" fill="none"/><path d="M52 34q10 0 8 10" stroke="#8a6f52" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M30 42q-4 8 4 6" stroke="#7a6047" stroke-width="4" fill="none" stroke-linecap="round"/>',
  whale:'<path d="M6 30q14-14 30-10 14 4 16 12-12 10-28 8Q10 38 6 30z" fill="#4a6a86"/><path d="M10 32q14 8 32 6" stroke="#7fa3bd" stroke-width="4" fill="none"/><path d="M52 32q8-8 7 4 6-4 1 8z" fill="#4a6a86"/><circle cx="18" cy="24" r="1.8" fill="#fffdf2"/><path d="M20 16q0-8 4-10 2 4 0 6" stroke="#a9d3e8" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M14 34q6 4 12 2" stroke="#33536b" stroke-width="1.6" fill="none"/>'
 };
 return '<svg viewBox="0 0 60 50" width="60" height="50" class="animal-art" aria-hidden="true">'+(a[id]||'')+'</svg>';
}
function habitatIcon(id){
 var h={
  rainforest:'<path d="M30 46V28" stroke="#6b4a2b" stroke-width="5"/><path d="M30 4l14 16H16zM30 14l17 18H13z" fill="#3f8f4f"/>',
  mountains:'<path d="M4 44L22 14l12 18 8-12 14 24z" fill="#8a7a6a"/><path d="M22 14l6 9-6 3-5-4z" fill="#fff"/>',
  grasslands:'<path d="M2 44h56" stroke="#9ec96a" stroke-width="5" stroke-linecap="round"/><path d="M12 44q-2-14 4-20M24 44q0-16 6-20M38 44q2-14 8-18M50 44q0-10 4-14" stroke="#7fae4d" stroke-width="4" fill="none" stroke-linecap="round"/>',
  coast:'<circle cx="47" cy="12" r="7" fill="#f2c14e"/><path d="M2 30q8-8 15 0t15 0 15 0 11 0" stroke="#4a90a4" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M2 40q8-8 15 0t15 0 15 0 11 0" stroke="#6fa8d6" stroke-width="5" fill="none" stroke-linecap="round"/>'
 };
 return '<svg viewBox="0 0 60 50" width="60" height="50" class="habitat-art" aria-hidden="true">'+(h[id]||'')+'</svg>';
}
function habitatsFor(diff){return diff==='easy'?saHabitats.slice(0,3):saHabitats;}
function newSortRound(g){
 var hs=habitatsFor(g.diff).map(function(h){return h.id;});
 var queue=saAnimals.filter(function(a){return hs.indexOf(a.habitat)>=0;});
 for(var i=queue.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=queue[i];queue[i]=queue[j];queue[j]=t;}
 var total=queue.length;
 g.sort={queue:queue,current:queue.shift(),celebrating:false,total:total,done:0,fact:null,factName:null};
 g.fact='';
}
function sortView(g){
 var s=g.sort,showLabels=g.diff!=='hard';
 if(s.celebrating)return '<div class="sort-wrap"><div class="maze-celebrate">'+confettiHtml()+'<div class="banner"><h3>All sorted!</h3><p>A new bunch of animals is wandering in.</p></div></div><div class="sort-stage"></div></div>';
 var a=s.current;
 var bins=habitatsFor(g.diff).map(function(h){return '<button class="habitat-bin" id="bin-'+h.id+'" data-action="sort-bin" data-habitat="'+h.id+'" style="border-color:'+h.color+'" aria-label="'+h.name+'">'+habitatIcon(h.id)+(showLabels?'<span>'+h.name+'</span>':'')+'</button>';}).join('');
 var fact=s.fact?'<div class="fact-banner"><button class="icon-button" data-action="speak-fact" aria-label="Read fact aloud">'+icon('sound')+'</button><p><strong>'+esc(s.factName)+':</strong> '+esc(s.fact)+'</p></div>':'';
 return '<div class="sort-wrap">'+fact+'<div class="sort-stage">'+animalIcon(a.id)+'<strong>'+esc(a.name)+'</strong><span class="quiet">'+s.done+' of '+s.total+' sorted</span></div><div class="habitat-bins">'+bins+'</div></div>';
}
function sortPick(hid){
 if(!game||game.paused||game.ended||game.type!=='animals'||game.sort.celebrating)return;
 var g=game,s=g.sort,a=s.current;
 if(a.habitat!==hid){
  tone('nope');
  var bin=document.getElementById('bin-'+hid);
  if(bin){bin.classList.add('nope');setTimeout(function(){bin.classList.remove('nope');},420);}
  return;
 }
 g.score++;s.done++;tone('snip');
 s.fact=a.fact;s.factName=a.name;g.fact=a.fact;speakText(a.name+'. '+a.fact);
 var scoreEl=$('#score');if(scoreEl)scoreEl.textContent=g.score;
 if(!s.queue.length){
  s.celebrating=true;fanfare();renderGame();
  setTimeout(function(){if(!game||game!==g||game.ended)return;newSortRound(g);renderGame();},1400);
  return;
 }
 s.current=s.queue.shift();
 renderGame();
}
