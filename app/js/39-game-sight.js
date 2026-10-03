/* Sight Words!: hear a word, tap the matching word from a few choices. Builds
   recognition of common unsoundable words. Audio: the words. No timer. */
function sightChoiceCount(diff){return diff==='hard'?4:3;}
function makeSight(diff){
 var pool=shuffleArr2(SIGHT_WORDS.slice());
 var target=pool[0];
 var choices=[target].concat(pool.slice(1,sightChoiceCount(diff)));
 return {target:target,choices:shuffleArr2(choices)};
}
function newSightRound(g){
 var total=8,q=[];for(var i=0;i<total;i++)q.push(makeSight(g.diff));
 g.sight={queue:q,current:q.shift(),celebrating:false,total:total,done:0};g.score=0;
 if(g.sight.current){g.fact=g.sight.current.target;speakText(g.fact);}
}
function sightView(g){
 var c=g.sight;
 if(c.celebrating)return '<div class="word-wrap">'+celebrateInner('Word reader!','Here comes more.')+'</div>';
 var cur=c.current;
 var choices=cur.choices.map(function(w){return '<button class="word-choice big" data-action="sight-pick" data-w="'+esc(w)+'">'+esc(w)+'</button>';}).join('');
 return '<div class="word-wrap"><p class="hint">Tap the word you hear.</p><button class="big-button" data-action="speak-fact">'+icon('sound')+'Say it again</button><span class="quiet">'+c.done+' of '+c.total+'</span><div class="word-choices">'+choices+'</div></div>';
}
function sightPick(w){
 if(!game||game.paused||game.ended||game.type!=='sight'||game.sight.celebrating)return;
 var g=game,c=g.sight;
 if(w!==c.current.target){tone('nope');wiggleEl('[data-action=sight-pick][data-w="'+w+'"]');return;}
 g.score++;c.done++;tone('snip');setScore(g.score);
 if(!c.queue.length){c.celebrating=true;g.fact='';fanfare();renderGame();setTimeout(function(){if(!game||game!==g||game.ended)return;newSightRound(g);renderGame();},1500);return;}
 c.current=c.queue.shift();g.fact=c.current.target;speakText(g.fact);renderGame();
}
