/* Number Order!: tap the numbers in order, smallest first. No audio, no timer. */
function orderCount(diff){return diff==='hard'?6:diff==='medium'?5:4;}
function makeSeq(diff){
 var count=orderCount(diff),start=1+Math.floor(Math.random()*(diff==='hard'?8:3)),nums=[];
 for(var i=0;i<count;i++)nums.push(start+i);
 return {nums:nums,tiles:shuffleArr2(nums.slice())};
}
function newOrderRound(g){var total=5,q=[];for(var i=0;i<total;i++)q.push(makeSeq(g.diff));g.order={queue:q,current:q.shift(),idx:0,celebrating:false,total:total,done:0};g.score=0;}
function orderView(g){
 var o=g.order;
 if(o.celebrating)return '<div class="math-wrap">'+celebrateInner('In order!','Here comes more.')+'</div>';
 var cur=o.current,nextVal=cur.nums[o.idx];
 var tiles=cur.tiles.map(function(n){var placed=n<nextVal;return '<button class="num-tile'+(placed?' placed':'')+'" data-action="order-pick" data-n="'+n+'"'+(placed?' disabled':'')+'>'+n+'</button>';}).join('');
 return '<div class="math-wrap"><strong>Tap the numbers in order, smallest first!</strong><span class="quiet">'+o.done+' of '+o.total+'</span><div class="num-tiles">'+tiles+'</div></div>';
}
function orderPick(n){
 if(!game||game.paused||game.ended||game.type!=='order'||game.order.celebrating)return;
 var g=game,o=g.order,cur=o.current;
 if(n!==cur.nums[o.idx]){tone('nope');wiggleEl('[data-action=order-pick][data-n="'+n+'"]');return;}
 o.idx++;tone('bop');
 if(o.idx>=cur.nums.length){
  g.score++;o.done++;setScore(g.score);tone('snip');
  if(!o.queue.length){o.celebrating=true;fanfare();renderGame();setTimeout(function(){if(!game||game!==g||game.ended)return;newOrderRound(g);renderGame();},1500);return;}
  o.current=o.queue.shift();o.idx=0;renderGame();return;
 }
 renderGame();
}
