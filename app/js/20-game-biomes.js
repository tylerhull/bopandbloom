/* Wild Places!: place South American regions on the real map. */
function biomeById(bid){return saBiomes.filter(function(b){return b.id===bid;})[0];}
function biomeView(g){
 var bz=g.biome,showHints=g.diff!=='hard';
 var mapHtml=saCountries.map(function(c){return '<path class="sa-country biome-land" d="'+c.d+'" '+(c.t?'transform="'+c.t+'" ':'')+'fill="#e3dcc6"></path>';}).join('');
 var spots=saBiomes.map(function(b){
  var placed=!!bz.placed[b.id];
  var hint=!placed&&showHints&&bz.selected===b.id;
  return '<circle class="biome-spot'+(placed?' placed':'')+(hint?' hint':'')+'" cx="'+b.cx+'" cy="'+b.cy+'" r="'+b.r+'" fill="'+(placed?b.color:'#fffdf2')+'" fill-opacity="'+(placed?0.6:0.32)+'" stroke="'+(placed?b.color:'#5a4632')+'" stroke-width="6" '+(placed?'':'data-action="biome-spot" ')+'data-biome="'+b.id+'"></circle>';
 }).join('');
 var labels=saBiomes.filter(function(b){return bz.placed[b.id];}).map(function(b){return '<text class="sa-label biome-label" x="'+b.cx+'" y="'+(b.cy+16)+'" text-anchor="middle">'+esc(b.short)+'</text>';}).join('');
 var trayList=saBiomes.filter(function(b){return !bz.placed[b.id];});
 var tray=trayList.map(function(b){return '<button class="pill sa-tile'+(bz.selected===b.id?' selected':'')+'" data-action="biome-select" data-biome="'+b.id+'" style="border-color:'+b.color+'">'+b.name+'</button>';}).join('');
 var allPlaced=!trayList.length;
 var overlay=allPlaced?'<div class="maze-celebrate">'+confettiHtml()+'<div class="banner"><h3>Every wild place found!</h3><p>You really know South America.</p></div></div>':'';
 var sel=bz.selected?biomeById(bz.selected):null;
 var info=sel?'<div class="sa-info"><button class="icon-button" data-action="speak-fact" aria-label="Read this aloud">'+icon('sound')+'</button><div><strong>'+esc(sel.name)+'</strong><p>'+esc(sel.fact)+'</p></div></div>':'';
 return '<div class="sa-wrap">'+overlay+'<div class="sa-map-outer biome-map"><div class="sa-map-frame"><svg class="sa-map" viewBox="310 -570 1620 2200" preserveAspectRatio="xMidYMid meet" aria-label="Map of South America">'+mapHtml+spots+labels+'</svg></div></div><div class="sa-tray">'+info+'<p class="hint">'+(allPlaced?'Wonderful exploring!':'Pick a wild place, then tap where it belongs on the map.')+'</p><div class="sa-tray-list">'+tray+'</div></div></div>';
}
function biomeClickSpot(bid){
 if(!game||game.paused||game.ended||game.type!=='biomes')return;
 var g=game,bz=g.biome;
 if(!bz.selected){toast('Pick a wild place from the list first!');return;}
 if(bz.selected!==bid){
  tone('nope');
  var mapEl=document.querySelector('.sa-map');if(mapEl){mapEl.classList.add('nope');setTimeout(function(){mapEl.classList.remove('nope');},380);}
  return;
 }
 bz.placed[bid]=true;bz.selected=null;g.fact='';
 g.score++;tone('snip');
 var scoreEl=$('#score');if(scoreEl)scoreEl.textContent=g.score;
 if(Object.keys(bz.placed).length>=saBiomes.length){
  tone('finish');
  renderGame();
  setTimeout(function(){if(!game||game!==g||game.ended)return;finishGame();},2200);
  return;
 }
 renderGame();
}
