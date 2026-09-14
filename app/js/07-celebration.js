/* Shared celebration effects (confetti, fireworks, lasers, fountains) used across games. */
var CELEBRATION_THEMES=['confetti','fireworks','fountain','lasers','cheese'];
function celebrationParticles(theme){
 if(theme==='lasers'){
  var out='';
  for(var i=0;i<8;i++){
   var angle=Math.round((i/8)*360);
   var hue=['#f2c14e','#e78aa0','#6fa8d6','#78a063','#a680c9','#f0805a'][i%6];
   out+='<span class="laser-beam" style="--ang:'+angle+'deg;background:'+hue+'"></span>';
  }
  return out;
 }
 var sets={
  confetti:{glyphs:['★','✦','✿','●'],cols:['#f2c14e','#e78aa0','#6fa8d6','#78a063']},
  fireworks:{glyphs:['✦','★','✷','✹'],cols:['#f2c14e','#e78aa0','#6fa8d6','#f0805a','#a680c9']},
  fountain:{glyphs:['●','○','◆'],cols:['#6fa8d6','#8fd0e0','#bfe6f0']},
  cheese:{glyphs:['cheese'],cols:['#f2c14e']}
 };
 var set=sets[theme]||sets.confetti;
 var count=theme==='fireworks'?12:8;
 var radius=theme==='fountain'?55:theme==='fireworks'?110:90;
 var out='';
 for(var j=0;j<count;j++){
  var a=(j/count)*2*Math.PI;
  var dx=Math.round(Math.cos(a)*radius),dy=Math.round(Math.sin(a)*radius);
  var glyph=set.glyphs[j%set.glyphs.length];
  var content=glyph==='cheese'?mazeCheeseIcon():glyph;
  var cls='confetti'+(theme==='fountain'?' confetti-fountain':'')+(glyph==='cheese'?' confetti-cheese':'');
  out+='<span class="'+cls+'" style="--dx:'+dx+'px;--dy:'+dy+'px;color:'+set.cols[j%set.cols.length]+(theme==='fireworks'?';animation-delay:'+(j%3*70)+'ms':'')+'">'+content+'</span>';
 }
 return out;
}
function mazeCelebrationHtml(g){
 if(!g.celebrationTheme)g.celebrationTheme=CELEBRATION_THEMES[Math.floor(Math.random()*CELEBRATION_THEMES.length)];
 var theme=g.celebrationTheme;
 var titles={confetti:'Home safe!',fireworks:'Home safe! Fireworks!',fountain:'Home safe! Splash!',lasers:'Home safe! Zoom!',cheese:'Home safe! Cheese party!'};
 return '<div class="maze-celebrate theme-'+theme+'">'+celebrationParticles(theme)+'<div class="banner"><h3>'+titles[theme]+'</h3><p>A new maze is on its way.</p></div></div>';
}
function confettiHtml(){
 var glyphs=['★','✦','✿','●'],cols=['#f2c14e','#e78aa0','#6fa8d6','#78a063'],out='';
 for(var i=0;i<8;i++){
  var angle=(i/8)*2*Math.PI,dx=Math.round(Math.cos(angle)*90),dy=Math.round(Math.sin(angle)*90);
  out+='<span class="confetti" style="--dx:'+dx+'px;--dy:'+dy+'px;color:'+cols[i%4]+'">'+glyphs[i%4]+'</span>';
 }
 return out;
}
