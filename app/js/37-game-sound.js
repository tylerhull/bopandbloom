/* Sound It Out!: a CVC word shown as letter tiles — tap each letter to light it,
   then tap "Say the word" to blend it, then Next. A guided read-along (no wrong
   answers). Audio: the whole word. No timer. */
function newSoundRound(g){
 var words=shuffleArr2(CVC_WORDS.slice()),q=words.slice(0,10);
 g.sound={queue:q,current:q.shift(),lit:0,celebrating:false,total:q.length,done:0};g.score=0;
}
function soundView(g){
 var s=g.sound;
 if(s.celebrating)return '<div class="sound-wrap">'+celebrateInner('You read them!','Here comes more.')+'</div>';
 var w=s.current.toUpperCase();
 var tiles=w.split('').map(function(ch,i){return '<button class="sound-tile'+(i<s.lit?' lit':'')+'" data-action="sound-letter" data-i="'+i+'">'+ch+'</button>';}).join('');
 return '<div class="sound-wrap"><p class="hint">Tap each letter, then say the word!</p><div class="sound-letters">'+tiles+'</div>'
  +'<button class="big-button sound-say" data-action="sound-say">'+icon('sound')+'Say the word</button>'
  +'<span class="quiet">'+s.done+' of '+s.total+'</span>'
  +'<button class="pill" data-action="sound-next">'+icon('play')+'Next word</button></div>';
}
function soundLetter(i){
 if(!game||game.paused||game.ended||game.type!=='sound'||game.sound.celebrating)return;
 var s=game.sound;
 if(i===s.lit){s.lit++;tone('bop');renderGame();}
 else if(i<s.lit){/* already lit, ignore */}
}
function soundSay(){
 if(!game||game.type!=='sound'||game.sound.celebrating)return;
 game.sound.lit=game.sound.current.length;
 speakText(game.sound.current);
 renderGame();
}
function soundNext(){
 if(!game||game.paused||game.ended||game.type!=='sound'||game.sound.celebrating)return;
 var g=game,s=g.sound;
 g.score++;s.done++;tone('snip');setScore(g.score);
 if(!s.queue.length){s.celebrating=true;fanfare();renderGame();setTimeout(function(){if(!game||game!==g||game.ended)return;newSoundRound(g);renderGame();},1500);return;}
 s.current=s.queue.shift();s.lit=0;renderGame();
}
