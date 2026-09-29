/* Shape Sort!: a colorful shape drops in; tap the bin it belongs in. Rounds
   alternate between sorting by shape and by color, so it teaches both. No audio,
   no timer — a gentle toddler game. */
var SORT_SHAPES=[
 {id:'circle',name:'Circle'},
 {id:'square',name:'Square'},
 {id:'triangle',name:'Triangle'},
 {id:'star',name:'Star'},
 {id:'heart',name:'Heart'}
];
var SORT_COLORS=[
 {id:'red',name:'Red',hex:'#e0524d'},
 {id:'blue',name:'Blue',hex:'#4a90d0'},
 {id:'yellow',name:'Yellow',hex:'#f0c53a'},
 {id:'green',name:'Green',hex:'#5bb56a'},
 {id:'purple',name:'Purple',hex:'#8a6fc0'}
];
function shapeArt(shapeId,hex){
 var s={
  circle:'<circle cx="30" cy="30" r="23"/>',
  square:'<rect x="8" y="8" width="44" height="44" rx="7"/>',
  triangle:'<polygon points="30,6 55,53 5,53"/>',
  star:'<polygon points="30,5 37,23 56,23 41,35 46,54 30,42 14,54 19,35 4,23 23,23"/>',
  heart:'<path d="M30 52C8 36 10 16 24 16c5 0 6 4 6 4s1-4 6-4c14 0 16 20-6 36z"/>'
 };
 return '<svg viewBox="0 0 60 60" class="shape-art" aria-hidden="true"><g fill="'+hex+'">'+(s[shapeId]||'')+'</g></svg>';
}
function shapeCount(diff){return diff==='hard'?5:diff==='medium'?4:3;}
function newShapeRound(g){
 var prev=g.shapes&&g.shapes.mode;
 var mode=prev==='shape'?'color':'shape';
 var n=shapeCount(g.diff);
 var shapes=SORT_SHAPES.slice(0,n),colors=SORT_COLORS.slice(0,n);
 var queue=[];
 var count=n*2;
 for(var i=0;i<count;i++){
  queue.push({shape:shapes[Math.floor(Math.random()*shapes.length)].id,color:colors[Math.floor(Math.random()*colors.length)].id});
 }
 g.shapes={mode:mode,shapes:shapes,colors:colors,queue:queue,current:queue.shift(),celebrating:false,total:count,done:0};
 g.score=0;
}
function colorHex(id){for(var i=0;i<SORT_COLORS.length;i++)if(SORT_COLORS[i].id===id)return SORT_COLORS[i].hex;return '#999';}
function shapeView(g){
 var sh=g.shapes;
 if(sh.celebrating)return '<div class="shape-wrap"><div class="maze-celebrate">'+confettiHtml()+'<div class="banner"><h3>All sorted!</h3><p>A fresh pile of shapes is tumbling in.</p></div></div><div class="shape-stage"></div></div>';
 var item=sh.current,hex=colorHex(item.color);
 var prompt=sh.mode==='shape'?'Which shape is it?':'Which color is it?';
 var bins;
 if(sh.mode==='shape'){
  bins=sh.shapes.map(function(s){return '<button class="shape-bin" id="sbin-'+s.id+'" data-action="shape-bin" data-bin="'+s.id+'" aria-label="'+s.name+'">'+shapeArt(s.id,'#b9b3a7')+'<span>'+s.name+'</span></button>';}).join('');
 } else {
  bins=sh.colors.map(function(c){return '<button class="shape-bin" id="sbin-'+c.id+'" data-action="shape-bin" data-bin="'+c.id+'" aria-label="'+c.name+'"><span class="color-swatch" style="background:'+c.hex+'"></span><span>'+c.name+'</span></button>';}).join('');
 }
 return '<div class="shape-wrap"><div class="shape-stage"><div class="shape-hero">'+shapeArt(item.shape,hex)+'</div><strong>'+prompt+'</strong><span class="quiet">'+sh.done+' of '+sh.total+' sorted</span></div><div class="shape-bins">'+bins+'</div></div>';
}
function shapePick(binId){
 if(!game||game.paused||game.ended||game.type!=='shapes'||game.shapes.celebrating)return;
 var g=game,sh=g.shapes,item=sh.current;
 var correct=sh.mode==='shape'?item.shape:item.color;
 if(binId!==correct){
  tone('nope');
  var bin=document.getElementById('sbin-'+binId);
  if(bin){bin.classList.add('nope');setTimeout(function(){bin.classList.remove('nope');},420);}
  return;
 }
 g.score++;sh.done++;tone('snip');
 var scoreEl=$('#score');if(scoreEl)scoreEl.textContent=g.score;
 if(!sh.queue.length){
  sh.celebrating=true;fanfare();renderGame();
  setTimeout(function(){if(!game||game!==g||game.ended)return;newShapeRound(g);renderGame();},1500);
  return;
 }
 sh.current=sh.queue.shift();
 renderGame();
}
