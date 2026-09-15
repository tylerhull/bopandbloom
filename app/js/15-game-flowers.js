/* Bloom! and Bouquet!: flower art, vases, and the classic target-grid renderer shared with Bop!. */
function flowerHead(species,hue,cy){
 var cx=100,out='',outline='stroke="rgba(41,59,54,.35)" stroke-width="1.6"';
 if(species==='tulip'){
  var top=cy-30;
  out+='<path d="M'+(cx-15)+' '+cy+'Q'+(cx-15)+' '+(top-4)+' '+cx+' '+top+'Q'+(cx+15)+' '+(top-4)+' '+(cx+15)+' '+cy+'Q'+cx+' '+(cy+10)+' '+(cx-15)+' '+cy+'Z" fill="'+hue.petal+'" '+outline+'/><path d="M'+cx+' '+cy+'V'+top+'" stroke="'+shade(hue.petal,-15)+'" stroke-width="2" opacity=".6"/>';
 } else if(species==='sunflower'){
  for(var a=0;a<10;a++)out+='<ellipse cx="'+cx+'" cy="'+(cy-20)+'" rx="6" ry="21" transform="rotate('+(a*36)+' '+cx+' '+cy+')" fill="'+hue.petal+'" '+outline+'/>';
  out+='<circle cx="'+cx+'" cy="'+cy+'" r="14" fill="'+hue.center+'" '+outline+'/>';
 } else if(species==='rose'){
  out+='<circle cx="'+cx+'" cy="'+cy+'" r="18" fill="'+shade(hue.petal,10)+'" '+outline+'/><circle cx="'+cx+'" cy="'+(cy-2)+'" r="13" fill="'+hue.petal+'"/><circle cx="'+cx+'" cy="'+(cy-4)+'" r="7" fill="'+hue.center+'"/>';
 } else {
  for(var b=0;b<6;b++)out+='<ellipse cx="'+cx+'" cy="'+(cy-14)+'" rx="11" ry="17" transform="rotate('+(b*60)+' '+cx+' '+cy+')" fill="'+hue.petal+'" '+outline+'/>';
  out+='<circle cx="'+cx+'" cy="'+cy+'" r="12" fill="'+hue.center+'" '+outline+'/><circle cx="'+(cx-4)+'" cy="'+(cy-1)+'" r="1.7" fill="#464731"/><circle cx="'+(cx+4)+'" cy="'+(cy-1)+'" r="1.7" fill="#464731"/><path d="M'+(cx-4)+' '+(cy+4)+'q4 4 8 0" stroke="#464731" fill="none" stroke-width="1.3"/>';
 }
 return out;
}
function flowerBloom(species,hue){
 return '<svg viewBox="55 15 90 175" class="bloom-icon" aria-hidden="true"><path d="M100 185V85" stroke="#567a48" stroke-width="5" stroke-linecap="round"/><path d="M100 150q-17-13-16-3 3 9 16 8m0-20q17-13 16-3-3 9-16 9" fill="#78a063"/>'+flowerHead(species,hue,60)+'</svg>';
}
function vaseShape(fillColor){return '<svg viewBox="0 0 140 110" class="vase-shape" aria-hidden="true"><ellipse cx="70" cy="8" rx="30" ry="6" fill="'+shade(fillColor,-12)+'" stroke="rgba(41,59,54,.4)" stroke-width="2.5"/><path d="M40 8h60l-9 32q11 8 11 27c0 23-19 33-43 33s-43-10-43-33c0-19 10-23 11-27z" fill="'+fillColor+'" stroke="rgba(41,59,54,.4)" stroke-width="3"/></svg>';}
function bouquetVase(items,kind){
 var color=kind==='target-vase'?'#e7d2a6':'#cfe0d6';
 var rotate=[-12,0,12],lift=[8,-8,6];
 var flowers=items.map(function(item,i){
  if(!item)return '<span class="vase-flower-slot empty"></span>';
  return '<span class="vase-flower-slot filled" style="transform:translateY('+lift[i%3]+'px) rotate('+rotate[i%3]+'deg)" aria-label="'+item.hue.key+' '+item.species+'">'+flowerBloom(item.species,item.hue)+'</span>';
 }).join('');
 return '<div class="vase-graphic '+kind+'">'+vaseShape(color)+'<span class="vase-flowers">'+flowers+'</span></div>';
}
function flowerArt(species,hue,growth){
 var height=25+growth*55,cy=105-height,size=.28+growth*.72;
 var s='<ellipse cx="100" cy="112" rx="40" ry="8" fill="#91b17d" opacity=".45"/><path d="M100 110V'+cy+'" stroke="#567a48" stroke-width="5" stroke-linecap="round"/><path d="M100 97q-31-28-30-8 5 15 30 13m0-17q29-24 27-7-3 14-27 14" fill="#78a063"/><g transform="translate('+(100*(1-size))+' '+(cy*(1-size))+') scale('+size+')">'+flowerHead(species,hue,cy)+'</g>';
 if(growth>=.95)s+='<path d="M142 36v10m-5-5h10" stroke="#fffef1" stroke-width="3" stroke-linecap="round"/>';
 return s;
}
function flowerTypeKey(f){return f.species+':'+f.hue.key;}
function randomSpecies(){return flowerSpecies[Math.floor(Math.random()*flowerSpecies.length)];}
function randomHue(){return flowerHues[Math.floor(Math.random()*flowerHues.length)];}
function newFlowerSlot(){return {growth:.12+Math.random()*.7,cut:0,species:randomSpecies(),hue:randomHue()};}
function bouquetTimeLimit(diff){return diff==='hard'?24:diff==='medium'?30:0;}
function newBouquetRound(g){
 var need=g.diff==='hard'?4:3;
 var picks=[],tries=0;
 while(picks.length<need&&tries<50){
  tries++;
  var cand={species:randomSpecies(),hue:randomHue()};
  if(!picks.some(function(p){return flowerTypeKey(p)===flowerTypeKey(cand);}))picks.push(cand);
 }
 g.target=picks;g.vase=picks.map(function(){return false;});
 var slotIdx=[0,1,2,3,4,5,6,7,8];
 for(var i=slotIdx.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=slotIdx[i];slotIdx[i]=slotIdx[j];slotIdx[j]=t;}
 for(var k=0;k<picks.length;k++){var slot=g.slots[slotIdx[k]];slot.species=picks[k].species;slot.hue=picks[k].hue;slot.growth=Math.min(slot.growth,.5);}
 g.bouquetLimit=bouquetTimeLimit(g.diff);
 g.bouquetTimer=g.bouquetLimit;
}
function tickBouquetTimeout(g,dt){
 if(!g.bouquetLimit)return;
 g.bouquetTimer-=dt;
 var el=$('#bouquet-timer');
 if(el)el.textContent=Math.max(0,Math.ceil(g.bouquetTimer));
 if(g.bouquetTimer<=0){
  g.timeouts=(g.timeouts||0)+1;
  tone('nope');
  toast('Time\'s up! A new bouquet is ready.');
  newBouquetRound(g);
  renderGame();
 }
}
function matchTargetIndex(g,s){var sk=flowerTypeKey(s);for(var i=0;i<g.target.length;i++){if(!g.vase[i]&&flowerTypeKey(g.target[i])===sk)return i;}return -1;}
function classicField(g){
 var isMouse=g.type==='bop';
 var extra='';
 if(g.type==='bouquet'){
  var collectItems=g.target.map(function(t,i){return g.vase[i]?t:null;});
  var stats='';
  if(g.bouquetLimit)stats+='<span class="bouquet-stat">⏱ <span id="bouquet-timer">'+Math.max(0,Math.ceil(g.bouquetTimer))+'</span>s</span>';
  if(g.timeouts)stats+='<span class="bouquet-stat">'+g.timeouts+' timeout'+(g.timeouts===1?'':'s')+'</span>';
  extra=(stats?'<div class="bouquet-stats">'+stats+'</div>':'')+'<div class="bouquet-vases"><div class="vase-block"><div class="vase-label">Match this bouquet</div>'+bouquetVase(g.target,'target-vase')+'</div><div class="vase-block"><div class="vase-label">Your bouquet</div>'+bouquetVase(collectItems,'collect-vase')+'</div></div>';
 }
 return extra+'<div class="target-grid">'+g.slots.map(function(s,i){return '<button class="target'+((g.type==='bouquet'&&s.growth>=.95&&matchTargetIndex(g,s)>=0)?' wanted':'')+'" id="target-'+i+'" data-action="hit" data-index="'+i+'" aria-label="'+(isMouse?'Mouse path':'Flower')+' '+(i+1)+'"><svg viewBox="0 0 200 125" aria-hidden="true">'+(isMouse?mouseArt():flowerArt(s.species,s.hue,s.growth))+'</svg><span class="keycap" aria-hidden="true">'+['Q · 1','W · 2','E · 3','A · 4','S · 5','D · 6','Z · 7','X · 8','C · 9'][i]+'</span></button>';}).join('')+'</div>';
}
