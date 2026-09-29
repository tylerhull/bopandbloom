/* Memory Match!: flip cards two at a time to find matching pairs of animal photos.
   No audio, no timer. Reuses letterAnimals photos (app/animals/). Difficulty sets
   how many pairs are on the board. */
function memoryPairCount(diff){return diff==='hard'?8:diff==='medium'?6:3;}
function newMemoryRound(g){
 var pool=letterAnimals.slice();
 for(var i=pool.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=pool[i];pool[i]=pool[j];pool[j]=t;}
 var pairs=Math.min(memoryPairCount(g.diff),pool.length);
 var chosen=pool.slice(0,pairs);
 var cards=[];
 chosen.forEach(function(a){
  cards.push({key:a.id,photo:a.photo,name:a.name,flipped:false,matched:false});
  cards.push({key:a.id,photo:a.photo,name:a.name,flipped:false,matched:false});
 });
 for(var k=cards.length-1;k>0;k--){var m=Math.floor(Math.random()*(k+1)),tt=cards[k];cards[k]=cards[m];cards[m]=tt;}
 g.memory={cards:cards,first:null,second:null,lock:false,pairs:pairs,matched:0,celebrating:false};
 g.score=0;
}
function memoryView(g){
 var mem=g.memory;
 if(mem.celebrating)return '<div class="mem-wrap"><div class="maze-celebrate">'+confettiHtml()+'<div class="banner"><h3>All matched!</h3><p>A fresh set of cards is on its way.</p></div></div></div>';
 var cols=mem.cards.length<=6?3:4;
 var tiles=mem.cards.map(function(c,i){
  var open=c.flipped||c.matched;
  var inner=open
   ? '<img class="mem-photo" src="'+c.photo+'" alt="'+esc(c.name)+'">'
   : '<span class="mem-back" aria-hidden="true">'+icon('leaf')+'</span>';
  return '<button class="mem-card'+(c.matched?' matched':'')+(open?' open':'')+'" data-action="mem-flip" data-index="'+i+'" aria-label="'+(open?esc(c.name):'Hidden card')+'"><span class="mem-face">'+inner+'</span></button>';
 }).join('');
 return '<div class="mem-wrap"><span class="quiet">'+mem.matched+' of '+mem.pairs+' pairs found</span><div class="mem-grid" style="grid-template-columns:repeat('+cols+',1fr)">'+tiles+'</div></div>';
}
function memoryFlip(index){
 if(!game||game.paused||game.ended||game.type!=='memory')return;
 var g=game,mem=g.memory;
 if(mem.celebrating||mem.lock)return;
 var card=mem.cards[index];
 if(!card||card.matched||card.flipped)return;
 card.flipped=true;
 if(mem.first===null){mem.first=index;tone('bop');renderGame();return;}
 mem.second=index;
 renderGame();
 var a=mem.cards[mem.first],b=mem.cards[mem.second];
 if(a.key===b.key){
  a.matched=true;b.matched=true;mem.matched++;g.score++;
  mem.first=null;mem.second=null;
  tone('snip');
  var scoreEl=$('#score');if(scoreEl)scoreEl.textContent=g.score;
  if(mem.matched>=mem.pairs){
   mem.celebrating=true;fanfare();renderGame();
   setTimeout(function(){if(!game||game!==g||game.ended)return;newMemoryRound(g);renderGame();},1600);
  } else {
   renderGame();
  }
  return;
 }
 mem.lock=true;tone('nope');
 setTimeout(function(){
  if(!game||game!==g||game.ended)return;
  a.flipped=false;b.flipped=false;mem.first=null;mem.second=null;mem.lock=false;
  renderGame();
 },850);
}
