/* Trace It!: trace big letters and numbers with finger/mouse. No audio, no timer.
   Drawing happens directly on a <canvas>; setupTraceCanvas() re-binds after every
   renderGame() (the canvas element is recreated each render, so old listeners die
   with it). traceView() only returns markup — the canvas is wired up by the
   engine's post-render hook in renderGame(). */
var TRACE_SETS={
 upper:'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
 lower:'abcdefghijklmnopqrstuvwxyz'.split(''),
 digits:'0123456789'.split('')
};
var TRACE_SET_LABELS={upper:'ABC',lower:'abc',digits:'123'};
function newTraceRound(g){g.trace={set:'upper',idx:0,redraw:null};g.score=0;}
function traceGlyph(g){var arr=TRACE_SETS[g.trace.set];return arr[g.trace.idx%arr.length];}
function traceView(g){
 var t=g.trace,glyph=traceGlyph(g);
 var sets=Object.keys(TRACE_SETS).map(function(k){return '<button class="pill trace-set'+(t.set===k?' active':'')+'" data-action="trace-set" data-set="'+k+'">'+TRACE_SET_LABELS[k]+'</button>';}).join('');
 return '<div class="trace-wrap"><div class="trace-sets">'+sets+'</div>'
  +'<div class="trace-stage"><canvas id="trace-canvas" class="trace-canvas" width="520" height="520" aria-label="Tracing area for '+esc(glyph)+'"></canvas></div>'
  +'<div class="trace-controls"><button class="pill" data-action="trace-clear">'+icon('retry')+'Clear</button>'
  +'<span class="trace-now">Trace <strong>'+esc(glyph)+'</strong></span>'
  +'<button class="big-button" data-action="trace-next">'+icon('check')+'Next</button></div>'
  +'<p class="hint">Trace the shape with your finger. Tap Clear to try again, or Next for a new one.</p></div>';
}
function setupTraceCanvas(g){
 var canvas=document.getElementById('trace-canvas');
 if(!canvas)return;
 var ctx=canvas.getContext('2d');
 var glyph=traceGlyph(g);
 function guide(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.save();
  ctx.fillStyle='rgba(41,59,54,.13)';
  ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.font='900 400px Georgia, "Times New Roman", serif';
  ctx.fillText(glyph,canvas.width/2,canvas.height/2+12);
  ctx.restore();
 }
 guide();
 g.trace.redraw=guide;
 var stroke=(getComputedStyle(document.documentElement).getPropertyValue('--primary')||'#5755c9').trim();
 ctx.lineWidth=28;ctx.lineCap='round';ctx.lineJoin='round';ctx.strokeStyle=stroke;
 var drawing=false,lastX=0,lastY=0;
 function pos(e){var r=canvas.getBoundingClientRect();var src=(e.touches&&e.touches[0])||e;return {x:(src.clientX-r.left)*(canvas.width/r.width),y:(src.clientY-r.top)*(canvas.height/r.height)};}
 function start(e){drawing=true;var p=pos(e);lastX=p.x;lastY=p.y;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x+.01,p.y+.01);ctx.stroke();if(e.cancelable)e.preventDefault();}
 function move(e){if(!drawing)return;var p=pos(e);ctx.beginPath();ctx.moveTo(lastX,lastY);ctx.lineTo(p.x,p.y);ctx.stroke();lastX=p.x;lastY=p.y;if(e.cancelable)e.preventDefault();}
 function end(){drawing=false;}
 if(window.PointerEvent){
  canvas.addEventListener('pointerdown',start);
  canvas.addEventListener('pointermove',move);
  canvas.addEventListener('pointerup',end);
  canvas.addEventListener('pointerleave',end);
 } else {
  canvas.addEventListener('mousedown',start);
  canvas.addEventListener('mousemove',move);
  window.addEventListener('mouseup',end);
  canvas.addEventListener('touchstart',start,{passive:false});
  canvas.addEventListener('touchmove',move,{passive:false});
  canvas.addEventListener('touchend',end);
 }
}
function traceSet(set){
 if(!game||game.type!=='trace'||!TRACE_SETS[set])return;
 game.trace.set=set;game.trace.idx=0;renderGame();
}
function traceClear(){if(game&&game.trace&&game.trace.redraw)game.trace.redraw();}
function traceNext(){
 if(!game||game.type!=='trace')return;
 var g=game;g.score++;g.trace.idx++;tone('snip');
 var scoreEl=$('#score');if(scoreEl)scoreEl.textContent=g.score;
 renderGame();
}
