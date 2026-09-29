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

registerPack({
 id:'sa-animals',name:'South American Animals',blurb:'30 real animal photos',tag:'South America',builtin:true,
 items:letterAnimals.map(function(a){return {id:a.id,label:a.name,image:a.photo,pt:a.pt,credit:a.credit};})
});
registerPack({
 id:'sa-flags',name:'South American Flags',blurb:'12 country flags',tag:'South America',builtin:true,
 items:saCountries.filter(function(c){return c.name;}).map(function(c){return {id:c.id,label:c.name,svg:countryFlag(c.id)};})
});
