/* Flashcards!: browse the child's active content packs one card at a time —
   a big picture (photo or flag), its name read aloud, and a Next button. No
   timer, no wrong answers; it's a calm look-and-listen game. Pack-driven, so it
   grows automatically as packs are added. See 04b-data-packs.js. */
function newFlashRound(g){
 var pool=activePackItems(current()).slice();
 for(var i=pool.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=pool[i];pool[i]=pool[j];pool[j]=t;}
 g.flash={queue:pool,current:null,celebrating:false,total:pool.length,seen:0};
 g.score=0;
 nextFlashCard(g);
}
function nextFlashCard(g){
 var fl=g.flash;
 fl.current=fl.queue.shift();
 g.fact=fl.current?fl.current.label:'';
 if(g.fact)speakText(g.fact);
}
function flashView(g){
 var fl=g.flash;
 if(fl.celebrating)return '<div class="flash-wrap"><div class="maze-celebrate">'+confettiHtml()+'<div class="banner"><h3>You saw them all!</h3><p>Shuffling a fresh set…</p></div></div></div>';
 var it=fl.current;
 if(!it)return '<div class="flash-wrap"><p class="hint">No content packs are turned on. Ask a grown-up to choose some in the Parent Area.</p></div>';
 return '<div class="flash-wrap"><div class="flash-card">'+packItemMedia(it,'flash-media')+'</div>'
  +'<div class="flash-word"><strong>'+esc(it.label)+'</strong><button class="icon-button" data-action="speak-fact" aria-label="Hear the name">'+icon('sound')+'</button></div>'
  +'<span class="quiet">'+(fl.seen+1)+' of '+fl.total+'</span>'
  +'<button class="big-button" data-action="flash-next">'+icon('play')+'Next card</button></div>';
}
function flashNext(){
 if(!game||game.paused||game.ended||game.type!=='flash'||game.flash.celebrating)return;
 var g=game,fl=g.flash;
 g.score++;fl.seen++;tone('bop');
 var scoreEl=$('#score');if(scoreEl)scoreEl.textContent=g.score;
 if(!fl.queue.length){
  fl.celebrating=true;g.fact='';fanfare();renderGame();
  setTimeout(function(){if(!game||game!==g||game.ended)return;newFlashRound(g);renderGame();},1500);
  return;
 }
 nextFlashCard(g);
 renderGame();
}
