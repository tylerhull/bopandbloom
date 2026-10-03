/* Add & Take!: picture addition and subtraction. No audio, no timer. */
function addMax(diff){return diff==='easy'?5:10;}
function makeAdd(diff){
 var max=addMax(diff),sub=diff!=='easy'&&Math.random()<0.45,a,b,ans,op;
 if(sub){a=2+Math.floor(Math.random()*(max-1));b=1+Math.floor(Math.random()*(a-1));ans=a-b;op='-';}
 else{a=1+Math.floor(Math.random()*(max-1));b=1+Math.floor(Math.random()*(max-a));ans=a+b;op='+';}
 return {a:a,b:b,op:op,ans:ans,shape:SORT_SHAPES[Math.floor(Math.random()*SORT_SHAPES.length)].id,color:SORT_COLORS[Math.floor(Math.random()*SORT_COLORS.length)].hex,choices:numChoices(ans,0,max,diff==='hard'?4:3)};
}
function newAddRound(g){var total=8,q=[];for(var i=0;i<total;i++)q.push(makeAdd(g.diff));g.add={queue:q,current:q.shift(),celebrating:false,total:total,done:0};g.score=0;}
function addView(g){
 var c=g.add;
 if(c.celebrating)return '<div class="math-wrap">'+celebrateInner('Super math!','Here comes more.')+'</div>';
 var p=c.current,scene,prompt;
 if(p.op==='+'){scene='<div class="count-objs">'+mathObjs(p.a,p.shape,p.color)+'</div><span class="add-op">+</span><div class="count-objs">'+mathObjs(p.b,p.shape,p.color)+'</div>';prompt='How many altogether?';}
 else{scene='<div class="count-objs">'+mathObjs(p.a,p.shape,p.color,p.a-p.b)+'</div>';prompt='How many are left?';}
 var choices=p.choices.map(function(n){return '<button class="num-choice" data-action="add-pick" data-n="'+n+'">'+n+'</button>';}).join('');
 return '<div class="math-wrap"><div class="add-scene">'+scene+'</div><strong>'+prompt+'</strong><span class="quiet">'+c.done+' of '+c.total+'</span><div class="num-choices">'+choices+'</div></div>';
}
function addPick(n){
 if(!game||game.paused||game.ended||game.type!=='add'||game.add.celebrating)return;
 var g=game,c=g.add;
 if(n!==c.current.ans){tone('nope');wiggleEl('[data-action=add-pick][data-n="'+n+'"]');return;}
 g.score++;c.done++;tone('snip');setScore(g.score);
 roundAdvance(c,g,function(){newAddRound(g);});
}
