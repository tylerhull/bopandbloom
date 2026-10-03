/* More or Less!: tap the group with more (or fewer). No audio, no timer. */
function moreMax(diff){return diff==='hard'?12:diff==='medium'?9:6;}
function makeMore(diff,i){
 var max=moreMax(diff),a=1+Math.floor(Math.random()*max),b,gap=diff==='easy'?2:1;
 do{b=1+Math.floor(Math.random()*max);}while(b===a||Math.abs(a-b)<gap);
 var sh=SORT_SHAPES[Math.floor(Math.random()*SORT_SHAPES.length)].id;
 return {a:a,b:b,wantMore:i%2===0,shape:sh,colorA:SORT_COLORS[Math.floor(Math.random()*SORT_COLORS.length)].hex,colorB:SORT_COLORS[Math.floor(Math.random()*SORT_COLORS.length)].hex};
}
function newMoreRound(g){var total=8,q=[];for(var i=0;i<total;i++)q.push(makeMore(g.diff,i));g.more={queue:q,current:q.shift(),celebrating:false,total:total,done:0};g.score=0;}
function moreView(g){
 var c=g.more;
 if(c.celebrating)return '<div class="math-wrap">'+celebrateInner('Well compared!','Here comes more.')+'</div>';
 var p=c.current;
 return '<div class="math-wrap"><strong>Which group has '+(p.wantMore?'MORE':'FEWER')+'?</strong><span class="quiet">'+c.done+' of '+c.total+'</span>'
  +'<div class="more-groups"><button class="more-group" data-action="more-pick" data-side="a"><div class="count-objs">'+mathObjs(p.a,p.shape,p.colorA)+'</div></button>'
  +'<button class="more-group" data-action="more-pick" data-side="b"><div class="count-objs">'+mathObjs(p.b,p.shape,p.colorB)+'</div></button></div></div>';
}
function morePick(side){
 if(!game||game.paused||game.ended||game.type!=='more'||game.more.celebrating)return;
 var g=game,c=g.more,p=c.current;
 var correct=p.wantMore?(p.a>p.b?'a':'b'):(p.a<p.b?'a':'b');
 if(side!==correct){tone('nope');wiggleEl('[data-action=more-pick][data-side="'+side+'"]');return;}
 g.score++;c.done++;tone('snip');setScore(g.score);
 roundAdvance(c,g,function(){newMoreRound(g);});
}
