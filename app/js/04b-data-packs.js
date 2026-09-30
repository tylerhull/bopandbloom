/* Content packs: bundled sets of items that pack-driven games (Flashcards,
   Memory Match!) draw from. A pack item is {id,label,image?,svg?,pt?,credit?} —
   image is a photo path, svg is inline flag markup; games render whichever is
   present. Read-aloud uses speakText(label), which looks the label up in
   AUDIO_MAP (07-audio-map.js), so no separate audio field is needed here.

   The built-in packs are derived from existing data (letterAnimals, saCountries)
   so there's no duplication — this file must load after 04-data-letters.js and
   02-data-map.js. Future packs can be standalone data files or, later, user
   imports; each just calls registerPack(). Parents choose which packs are active
   per child in the Parent Area (profile.enabledPacks; empty/absent = all). */
var PACKS=[];
function registerPack(p){PACKS.push(p);}
function packById(id){for(var i=0;i<PACKS.length;i++)if(PACKS[i].id===id)return PACKS[i];return null;}
function allPackIds(){return PACKS.map(function(p){return p.id;});}
function activePacks(profile){
 var en=(profile&&profile.enabledPacks&&profile.enabledPacks.length)?profile.enabledPacks:allPackIds();
 return PACKS.filter(function(pk){return en.indexOf(pk.id)>=0;});
}
function activePackItems(profile){
 var items=[];
 activePacks(profile).forEach(function(pk){pk.items.forEach(function(it){items.push(it);});});
 return items;
}
function packItemMedia(it,cls){
 if(it.svg)return '<span class="'+cls+' pack-svg" aria-label="'+esc(it.label)+'">'+it.svg+'</span>';
 return '<img class="'+cls+'" src="'+it.image+'" alt="'+esc(it.label)+'">';
}
/* Register user-imported packs (from the Electron file bridge). These are
   untrusted files a parent chose to add, so only image items are accepted —
   never inline svg — and each image must be a data: URI. Built-in packs are
   never overridden. Called at startup and after an import (see main.js). */
function registerImportedPacks(list){
 var added=0;
 (list||[]).forEach(function(p){
  if(!p||typeof p.id!=='string'||packById(p.id))return;
  var items=(p.items||[]).filter(function(it){
   return it&&typeof it.label==='string'&&typeof it.image==='string'&&it.image.indexOf('data:image/')===0;
  }).map(function(it,i){
   return {id:(typeof it.id==='string'&&it.id)||(p.id+'-'+i),label:it.label,image:it.image,pt:(typeof it.pt==='number'?it.pt:75)};
  });
  if(items.length){registerPack({id:p.id,name:p.name||p.id,blurb:p.blurb||'',tag:p.tag||'Imported',builtin:false,imported:true,items:items});added++;}
 });
 return added;
}

registerPack({
 id:'sa-animals',name:'South American Animals',blurb:'30 real animal photos',tag:'South America',builtin:true,
 items:letterAnimals.map(function(a){return {id:a.id,label:a.name,image:a.photo,pt:a.pt,credit:a.credit};})
});
registerPack({
 id:'sa-flags',name:'South American Flags',blurb:'12 country flags',tag:'South America',builtin:true,
 items:saCountries.filter(function(c){return c.name;}).map(function(c){return {id:c.id,label:c.name,svg:countryFlag(c.id)};})
});
