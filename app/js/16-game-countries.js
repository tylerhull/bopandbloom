/* Country Match!: place countries on the real map. */
function countryById(cid){return saCountries.filter(function(c){return c.id===cid;})[0];}
function puzzleView(g){
 var pz=g.puzzle,showHints=g.diff!=='hard';
 var pathsHtml=saCountries.map(function(c){
  var placed=!!pz.placed[c.id];
  var classes=[placed?'placed':'land'];
  if(!placed&&showHints&&pz.selected===c.id)classes.push('hint');
  return '<path class="sa-country '+classes.join(' ')+'" d="'+c.d+'" '+(c.t?'transform="'+c.t+'" ':'')+'fill="'+(placed?c.color:'#e8dfc4')+'" '+(placed?'':'data-action="sa-cell" ')+'data-country="'+c.id+'" aria-label="'+(placed?c.name+' placed':'unplaced land, tap to place the selected country')+'"></path>';
 }).join('');
 var labelsHtml=saCountries.filter(function(c){return pz.placed[c.id];}).map(function(c){return '<text class="sa-label" x="'+c.cx+'" y="'+c.cy+'" text-anchor="middle">'+esc(c.name)+'</text>';}).join('');
 var trayList=saCountries.filter(function(c){return !pz.placed[c.id];});
 var tray=trayList.map(function(c){return '<button class="pill sa-tile'+(pz.selected===c.id?' selected':'')+'" data-action="sa-select" data-country="'+c.id+'" style="border-color:'+c.color+'">'+c.name+'</button>';}).join('');
 var allPlaced=!trayList.length;
 var overlay=allPlaced?'<div class="maze-celebrate">'+confettiHtml()+'<div class="banner"><h3>All done!</h3><p>Every country is in its place.</p></div></div>':'';
 var selected=pz.selected?countryById(pz.selected):null;
 var infoHtml=selected?'<div class="sa-info">'+countryFlag(selected.id)+'<div><strong>'+esc(selected.name)+'</strong><p>'+esc(pz.fact||'')+'</p></div><button class="icon-button" data-action="speak-fact" aria-label="Read fact aloud">'+icon('sound')+'</button></div>':'';
 return '<div class="sa-wrap">'+overlay+'<svg class="sa-map" viewBox="330 -545 1075 1840" preserveAspectRatio="xMidYMid meet" aria-label="Map of South America">'+pathsHtml+labelsHtml+'</svg><div class="sa-tray">'+infoHtml+'<p class="hint">'+(allPlaced?'Great work, geographer!':'Pick a country, then tap its home on the map.')+'</p><div class="sa-tray-list">'+tray+'</div></div></div>';
}
function saClickCell(cid){
 if(!game||game.paused||game.ended||game.type!=='countries')return;
 var g=game,pz=g.puzzle;
 if(!pz.selected){toast('Pick a country from the list first!');return;}
 if(pz.selected!==cid){
  tone('nope');
  var mapEl=document.querySelector('.sa-map');if(mapEl){mapEl.classList.add('nope');setTimeout(function(){mapEl.classList.remove('nope');},380);}
  return;
 }
 pz.placed[cid]=true;pz.selected=null;pz.fact='';g.fact='';
 g.score++;tone('snip');
 var scoreEl=$('#score');if(scoreEl)scoreEl.textContent=g.score;
 if(Object.keys(pz.placed).length>=saCountries.length){
  tone('finish');
  renderGame();
  setTimeout(function(){if(!game||game!==g||game.ended)return;finishGame();},1800);
  return;
 }
 renderGame();
}
