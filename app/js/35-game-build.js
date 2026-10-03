/* Build the Word!: spell a pack picture's name by tapping letter tiles in order.
   Pack-driven; forgiving (only the correct next letter is accepted). No timer.
   Difficulty: easy shows the word as a guide; hard adds distractor letters. */
function firstOpenSlot(slots,from){for(var i=from;i<slots.length;i++)if(!slots[i].filled)return i;return -1;}
function setupWord(b,diff){
 var label=b.current.label.toUpperCase();
 b.slots=label.split('').map(function(ch){var space=!/[A-Z0-9]/.test(ch);return {ch:ch,fixed:space,filled:space};});
 var letters=label.split('').filter(function(ch){return /[A-Z0-9]/.test(ch);});
 var tray=letters.slice();
 if(diff==='hard'){var alpha='ABCDEFGHIJKLMNOPQRSTUVWXYZ';for(var i=0;i<3;i++)tray.push(alpha[Math.floor(Math.random()*26)]);}
 shuffleArr2(tray);
 b.tray=tray.map(function(ch,i){return {ch:ch,id:i,used:false};});
 b.nextSlot=firstOpenSlot(b.slots,0);
 b.showGuide=diff==='easy';
}
function newBuildRound(g){var pool=shuffleArr2(activePackItems(current()).slice());g.build={queue:pool,current:null,celebrating:false,total:pool.length,done:0};g.score=0;nextBuild(g);}
function nextBuild(g){var b=g.build;b.current=b.queue.shift();if(b.current){setupWord(b,g.diff);g.fact=b.current.label;speakText(b.current.label);}else g.fact='';}
function buildView(g){
 var b=g.build;
 if(b.celebrating)return '<div class="build-wrap">'+celebrateInner('All spelled!','A fresh set is coming.')+'</div>';
 var it=b.current;
 if(!it)return '<div class="build-wrap"><p class="hint">No content packs are turned on. Ask a grown-up to choose some in the Parent Area.</p></div>';
 var slots=b.slots.map(function(s,i){
  var inside=s.fixed?'':(s.filled?s.ch:(b.showGuide?'<span class="wguide">'+s.ch+'</span>':''));
  return '<span class="wslot'+(s.fixed?' wspace':'')+(i===b.nextSlot?' wnext':'')+(s.filled&&!s.fixed?' wfilled':'')+'">'+inside+'</span>';
 }).join('');
 var tray=b.tray.map(function(t){return '<button class="wtile" data-action="build-tap" data-id="'+t.id+'"'+(t.used?' disabled':'')+'>'+t.ch+'</button>';}).join('');
 return '<div class="build-wrap"><div class="build-card">'+packItemMedia(it,'build-media')+'<button class="icon-button build-hear" data-action="speak-fact" aria-label="Hear the word">'+icon('sound')+'</button></div>'
  +'<div class="wslots">'+slots+'</div><span class="quiet">'+b.done+' of '+b.total+'</span><div class="wtray">'+tray+'</div></div>';
}
function buildTap(id){
 if(!game||game.paused||game.ended||game.type!=='build'||game.build.celebrating)return;
 var g=game,b=g.build,tile=null;
 for(var i=0;i<b.tray.length;i++)if(b.tray[i].id===id)tile=b.tray[i];
 if(!tile||tile.used)return;
 var slot=b.slots[b.nextSlot];
 if(!slot||tile.ch!==slot.ch){tone('nope');wiggleEl('[data-action=build-tap][data-id="'+id+'"]');return;}
 tile.used=true;slot.filled=true;b.nextSlot=firstOpenSlot(b.slots,b.nextSlot+1);tone('bop');
 if(b.nextSlot<0){
  g.score++;b.done++;setScore(g.score);tone('snip');toast('You spelled '+b.current.label+'!');
  if(!b.queue.length){b.celebrating=true;g.fact='';fanfare();renderGame();setTimeout(function(){if(!game||game!==g||game.ended)return;newBuildRound(g);renderGame();},1500);return;}
  nextBuild(g);renderGame();return;
 }
 renderGame();
}
