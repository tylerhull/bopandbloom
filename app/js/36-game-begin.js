/* Beginning Sounds!: hear a letter, tap the picture that starts with it.
   Pack-driven (pictures from the child's active packs). Audio: the letter prompt
   and, on success, the picture's name. No timer. */
function beginChoices(diff){return diff==='hard'?4:diff==='medium'?4:3;}
function makeBegin(pool,diff){
 var correct=pool[Math.floor(Math.random()*pool.length)],L=firstLetter(correct.label);
 var others=shuffleArr2(pool.filter(function(it){return firstLetter(it.label)!==L;}));
 var items=others.slice(0,beginChoices(diff)-1);items.push(correct);
 return {letter:L,correctId:correct.id,items:shuffleArr2(items)};
}
function newBeginRound(g){
 var pool=activePackItems(current()).slice();
 var total=Math.min(10,pool.length),q=[];
 for(var i=0;i<total;i++)q.push(makeBegin(pool,g.diff));
 g.begin={queue:q,current:q.shift(),celebrating:false,total:total,done:0};g.score=0;
 if(g.begin.current){g.fact='The letter '+g.begin.current.letter;speakText(g.fact);}
}
function beginView(g){
 var c=g.begin;
 if(c.celebrating)return '<div class="begin-wrap">'+celebrateInner('Great listening!','Here comes more.')+'</div>';
 var cur=c.current;
 if(!cur)return '<div class="begin-wrap"><p class="hint">No content packs are turned on. Ask a grown-up to choose some in the Parent Area.</p></div>';
 var choices=cur.items.map(function(it){return '<button class="begin-choice" data-action="begin-pick" data-id="'+esc(it.id)+'" aria-label="'+esc(it.label)+'">'+packItemMedia(it,'begin-media')+'</button>';}).join('');
 return '<div class="begin-wrap"><div class="begin-letter"><strong>'+cur.letter+'</strong><button class="icon-button" data-action="speak-fact" aria-label="Hear the letter">'+icon('sound')+'</button></div><p class="hint">Which one starts with '+cur.letter+'?</p><span class="quiet">'+c.done+' of '+c.total+'</span><div class="begin-choices">'+choices+'</div></div>';
}
function beginPick(id){
 if(!game||game.paused||game.ended||game.type!=='begin'||game.begin.celebrating)return;
 var g=game,c=g.begin,cur=c.current;
 if(id!==cur.correctId){tone('nope');wiggleEl('[data-action=begin-pick][data-id="'+id+'"]');return;}
 var item=null;cur.items.forEach(function(it){if(it.id===id)item=it;});
 g.score++;c.done++;tone('snip');setScore(g.score);
 if(item){toast(item.label+' starts with '+cur.letter+'!');}
 if(!c.queue.length){c.celebrating=true;g.fact='';fanfare();renderGame();setTimeout(function(){if(!game||game!==g||game.ended)return;newBeginRound(g);renderGame();},1500);return;}
 c.current=c.queue.shift();g.fact='The letter '+c.current.letter;speakText(g.fact);renderGame();
}
