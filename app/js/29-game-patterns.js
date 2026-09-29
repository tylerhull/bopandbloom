/* Pattern Play!: a repeating pattern of colorful shapes with the next one hidden —
   tap what comes next. Reuses shapeArt()/SORT_SHAPES/SORT_COLORS/colorHex from
   game-shapes.js. No audio, no timer. */
function patternElements(){
 var out=[];
 SORT_SHAPES.forEach(function(s){SORT_COLORS.forEach(function(c){out.push({shape:s.id,color:c.id});});});
 return out;
}
function patternKey(el){return el.shape+'-'+el.color;}
function patternUnitSize(diff){return diff==='hard'?4:diff==='medium'?3:2;}
function patternChoiceCount(diff){return diff==='hard'?4:3;}
function shuffleArr(a){for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t;}return a;}
function makePattern(diff){
 var u=patternUnitSize(diff);
 var pool=shuffleArr(patternElements().slice());
 var unit=pool.slice(0,u);
 var p=Math.floor(Math.random()*u);              // partial length after two full repeats
 var seq=[];
 for(var i=0;i<u*2+p;i++)seq.push(unit[i%u]);
 var answer=unit[(u*2+p)%u];
 // choices: the answer plus other unit members, topped up from the pool if needed
 var want=Math.min(patternChoiceCount(diff),patternElements().length);
 var choices=[answer];
 var rest=shuffleArr(unit.filter(function(e){return patternKey(e)!==patternKey(answer);}));
 rest.forEach(function(e){if(choices.length<want)choices.push(e);});
 shuffleArr(pool).forEach(function(e){if(choices.length<want&&!choices.some(function(c){return patternKey(c)===patternKey(e);}))choices.push(e);});
 return {seq:seq,answer:answer,choices:shuffleArr(choices)};
}
function newPatternRound(g){
 var count=6;
 var queue=[];for(var i=0;i<count;i++)queue.push(makePattern(g.diff));
 g.patterns={queue:queue,current:queue.shift(),celebrating:false,total:count,done:0};
 g.score=0;
}
function patternTile(el){return '<span class="pat-tile">'+shapeArt(el.shape,colorHex(el.color))+'</span>';}
function patternView(g){
 var pt=g.patterns;
 if(pt.celebrating)return '<div class="pat-wrap"><div class="maze-celebrate">'+confettiHtml()+'<div class="banner"><h3>You did it!</h3><p>More patterns are on the way.</p></div></div><div class="pat-stage"></div></div>';
 var cur=pt.current;
 var seq=cur.seq.map(patternTile).join('')+'<span class="pat-tile pat-slot">?</span>';
 var choices=cur.choices.map(function(el,i){return '<button class="pat-choice" data-action="pattern-pick" data-index="'+i+'" aria-label="Choice">'+shapeArt(el.shape,colorHex(el.color))+'</button>';}).join('');
 return '<div class="pat-wrap"><div class="pat-row">'+seq+'</div><strong>What comes next?</strong><span class="quiet">'+pt.done+' of '+pt.total+' done</span><div class="pat-choices">'+choices+'</div></div>';
}
function patternPick(index){
 if(!game||game.paused||game.ended||game.type!=='patterns'||game.patterns.celebrating)return;
 var g=game,pt=g.patterns,pick=pt.current.choices[index];
 if(!pick)return;
 if(patternKey(pick)!==patternKey(pt.current.answer)){
  tone('nope');
  var btn=document.querySelector('[data-action=pattern-pick][data-index="'+index+'"]');
  if(btn){btn.classList.add('nope');setTimeout(function(){btn.classList.remove('nope');},420);}
  return;
 }
 g.score++;pt.done++;tone('snip');
 var scoreEl=$('#score');if(scoreEl)scoreEl.textContent=g.score;
 if(!pt.queue.length){
  pt.celebrating=true;fanfare();renderGame();
  setTimeout(function(){if(!game||game!==g||game.ended)return;newPatternRound(g);renderGame();},1500);
  return;
 }
 pt.current=pt.queue.shift();
 renderGame();
}
