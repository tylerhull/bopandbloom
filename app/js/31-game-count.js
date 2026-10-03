/* Count It!: how many objects? Tap the number. No audio, no timer. */
function countMax(diff){return diff==='hard'?20:diff==='medium'?10:5;}
function countChoiceCount(diff){return diff==='hard'?4:3;}
function mathObjs(n,shape,color,goneFrom){var s='';for(var i=0;i<n;i++)s+='<span class="count-obj'+(goneFrom!=null&&i>=goneFrom?' gone':'')+'">'+shapeArt(shape,color)+'</span>';return s;}
function makeCount(diff){var max=countMax(diff),n=1+Math.floor(Math.random()*max);return {n:n,shape:SORT_SHAPES[Math.floor(Math.random()*SORT_SHAPES.length)].id,color:SORT_COLORS[Math.floor(Math.random()*SORT_COLORS.length)].hex,choices:numChoices(n,1,max,countChoiceCount(diff))};}
function newCountRound(g){var total=8,q=[];for(var i=0;i<total;i++)q.push(makeCount(g.diff));g.count={queue:q,current:q.shift(),celebrating:false,total:total,done:0};g.score=0;}
function countView(g){
 var c=g.count;
 if(c.celebrating)return '<div class="math-wrap">'+celebrateInner('Great counting!','Here comes more.')+'</div>';
 var cur=c.current;
 var choices=cur.choices.map(function(n){return '<button class="num-choice" data-action="count-pick" data-n="'+n+'">'+n+'</button>';}).join('');
 return '<div class="math-wrap"><div class="count-objs">'+mathObjs(cur.n,cur.shape,cur.color)+'</div><strong>How many?</strong><span class="quiet">'+c.done+' of '+c.total+'</span><div class="num-choices">'+choices+'</div></div>';
}
function countPick(n){
 if(!game||game.paused||game.ended||game.type!=='count'||game.count.celebrating)return;
 var g=game,c=g.count;
 if(n!==c.current.n){tone('nope');wiggleEl('[data-action=count-pick][data-n="'+n+'"]');return;}
 g.score++;c.done++;tone('snip');setScore(g.score);
 roundAdvance(c,g,function(){newCountRound(g);});
}
