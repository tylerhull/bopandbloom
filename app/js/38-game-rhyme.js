/* Rhyme Time!: hear a word, tap the word that rhymes with it. Audio: the words.
   No timer. */
function rhymeChoiceCount(diff){return diff==='hard'?4:3;}
function makeRhyme(diff){
 var fam=RHYME_FAMILIES[Math.floor(Math.random()*RHYME_FAMILIES.length)];
 var fw=shuffleArr2(fam.words.slice());
 var target=fw[0],rhyme=fw[1];
 var others=[];RHYME_FAMILIES.forEach(function(f){if(f.end!==fam.end)f.words.forEach(function(w){others.push(w);});});
 shuffleArr2(others);
 var choices=[rhyme].concat(others.slice(0,rhymeChoiceCount(diff)-1));
 return {target:target,answer:rhyme,choices:shuffleArr2(choices)};
}
function newRhymeRound(g){
 var total=8,q=[];for(var i=0;i<total;i++)q.push(makeRhyme(g.diff));
 g.rhyme={queue:q,current:q.shift(),celebrating:false,total:total,done:0};g.score=0;
 if(g.rhyme.current){g.fact=g.rhyme.current.target;speakText(g.fact);}
}
function rhymeView(g){
 var c=g.rhyme;
 if(c.celebrating)return '<div class="word-wrap">'+celebrateInner('Rhyme star!','Here comes more.')+'</div>';
 var cur=c.current;
 var choices=cur.choices.map(function(w){return '<button class="word-choice" data-action="rhyme-pick" data-w="'+esc(w)+'">'+esc(w)+'</button>';}).join('');
 return '<div class="word-wrap"><div class="word-target"><strong>'+esc(cur.target)+'</strong><button class="icon-button" data-action="speak-fact" aria-label="Hear the word">'+icon('sound')+'</button></div><p class="hint">Which word rhymes with '+esc(cur.target)+'?</p><span class="quiet">'+c.done+' of '+c.total+'</span><div class="word-choices">'+choices+'</div></div>';
}
function rhymePick(w){
 if(!game||game.paused||game.ended||game.type!=='rhyme'||game.rhyme.celebrating)return;
 var g=game,c=g.rhyme;
 if(w!==c.current.answer){tone('nope');speakText(w);wiggleEl('[data-action=rhyme-pick][data-w="'+w+'"]');return;}
 g.score++;c.done++;tone('snip');setScore(g.score);toast(c.current.target+' rhymes with '+w+'!');
 if(!c.queue.length){c.celebrating=true;g.fact='';fanfare();renderGame();setTimeout(function(){if(!game||game!==g||game.ended)return;newRhymeRound(g);renderGame();},1500);return;}
 c.current=c.queue.shift();g.fact=c.current.target;speakText(g.fact);renderGame();
}
