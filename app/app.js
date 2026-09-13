(function () {
'use strict';
var $ = function(s) { return document.querySelector(s); };
var root = $('#app'), modalRoot = $('#modal-root');
var storageKey = 'bop-and-bloom-v1';
var palettes = [
 {name:'Blueberry meadow',primary:'#5755c9',secondary:'#ee945b',background:'#faf7ef',surface:'#fffdf8',ink:'#293b36',garden:'#90b99a'},
 {name:'Strawberry picnic',primary:'#b63f62',secondary:'#edb950',background:'#fff6ed',surface:'#fffdf8',ink:'#543841',garden:'#96bc8e'},
 {name:'Ocean explorer',primary:'#237e91',secondary:'#f19b66',background:'#edf7f7',surface:'#fbffff',ink:'#234750',garden:'#91bbac'},
 {name:'Space garden',primary:'#7855ad',secondary:'#c6b955',background:'#f2eef9',surface:'#fffcff',ink:'#423654',garden:'#a3b891'},
 {name:'Sunny orange',primary:'#b95b29',secondary:'#e7bb49',background:'#fff8e5',surface:'#fffdf5',ink:'#4b432e',garden:'#a3bb83'},
 {name:'Forest treasure',primary:'#34755b',secondary:'#dfa66c',background:'#f1f5e9',surface:'#fffff8',ink:'#30483a',garden:'#a6c987'},
 {name:'Cherry rocket',primary:'#a74749',secondary:'#75b5cd',background:'#fbf1ed',surface:'#fffaf7',ink:'#4b353c',garden:'#a6bd96'},
 {name:'Moonbeam',primary:'#42699e',secondary:'#dba1b4',background:'#f2f4fc',surface:'#fdfdff',ink:'#303d56',garden:'#a6c6b5'},
 {name:'Lavender fields',primary:'#6a5ea8',secondary:'#e0a3c9',background:'#f5f1fb',surface:'#fffcff',ink:'#3c3350',garden:'#a9bfa0'},
 {name:'Citrus splash',primary:'#d9781f',secondary:'#4f9d69',background:'#fff4e3',surface:'#fffdf8',ink:'#4a3420',garden:'#9dc08a'},
 {name:'Mint cocoa',primary:'#3f8f7a',secondary:'#b5773f',background:'#eef8f3',surface:'#fffefb',ink:'#2c473d',garden:'#9ec9ab'},
 {name:'Rosewood',primary:'#9c4f5a',secondary:'#5f8fae',background:'#fbeef0',surface:'#fffbfb',ink:'#452e33',garden:'#9bbf9e'},
 {name:'Golden pond',primary:'#c69a1f',secondary:'#3e7ea6',background:'#fbf8e8',surface:'#fffefa',ink:'#4a4326',garden:'#93b98d'}
];
var colorKeys=['primary','secondary','background','surface','ink','garden'];
var mascots=['flower','mouse','star','rocket','butterfly','dino','sprout','sun','cat','bird','fish','robot'];
var styles=['pop','soft','block','sparkle','stamp','outline','mono','bubble'];
var styleLabels=['Bouncy','Storybook','Super bold','Sparkly','Stamp','Outline','Typewriter','Bubble'];
var patterns=['dots','stripes','sprinkles','grid','plain'];
var patternLabels=['Dots','Stripes','Sprinkles','Grid','Plain'];
var flowerSpecies=['daisy','tulip','sunflower','rose'];
var flowerHues=[
 {key:'blush',petal:'#e78aa0',center:'#f6dd86'},
 {key:'sky',petal:'#6fa8d6',center:'#fef6d8'},
 {key:'sunshine',petal:'#f2c14e',center:'#8a5a2b'},
 {key:'violet',petal:'#a680c9',center:'#fbeec7'},
 {key:'coral',petal:'#f0805a',center:'#fff3d0'},
 {key:'snow',petal:'#fbfbfb',center:'#f0b64c'}
];
var MAZE_SIZE=5;
var mazeKeyDirs={arrowup:'n',w:'n',arrowdown:'s',s:'s',arrowleft:'w',a:'w',arrowright:'e',d:'e'};
var gameNames={bop:'Bop!',bloom:'Bloom!',scurry:'Scurry!',bouquet:'Bouquet!'};
var gameScores={bop:'BOPS',bloom:'FLOWERS',scurry:'MICE',bouquet:'BOUQUETS'};
var gameLabels={bop:'happy little bops',bloom:'flowers snipped',scurry:'mice guided home',bouquet:'bouquets made'};
var defaults={muted:false,music:true,effects:true,volume:65,musicVolume:25,effectsVolume:75,reduced:false};
var state={version:1,active:null,profiles:[],settings:copy(defaults)};
var screen='home', draft=null, game=null, lastFocus=null;
function copy(x){return JSON.parse(JSON.stringify(x));}
function esc(x){return String(x).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function clamp(n,min,max){return Math.max(min,Math.min(max,Number(n)||0));}
function id(){return 'p'+Date.now().toString(36)+Math.random().toString(36).slice(2,9);}
function colors(c){var out=copy(palettes[0]);colorKeys.forEach(function(k){if(c&&/^#[0-9a-f]{6}$/i.test(c[k]))out[k]=c[k];});return out;}
function sanitize(raw){
 if(!raw||raw.version!==1||!Array.isArray(raw.profiles))return;
 state.profiles=raw.profiles.slice(0,24).filter(function(p){return p&&typeof p.name==='string'&&p.name.trim();}).map(function(p){return {id:typeof p.id==='string'?p.id:id(),name:p.name.trim().slice(0,24),colors:colors(p.colors),mascot:mascots.indexOf(p.mascot)>=0?p.mascot:'flower',style:styles.indexOf(p.style)>=0?p.style:'pop',pattern:patterns.indexOf(p.pattern)>=0?p.pattern:'dots',mode:['relaxed','gentle','speedy'].indexOf(p.mode)>=0?p.mode:'relaxed',best:{bop:clamp(p.best&&p.best.bop,0,999999),bloom:clamp(p.best&&p.best.bloom,0,999999),scurry:clamp(p.best&&p.best.scurry,0,999999),bouquet:clamp(p.best&&p.best.bouquet,0,999999)}};});
 state.active=state.profiles.some(function(p){return p.id===raw.active;})?raw.active:(state.profiles[0]||{}).id||null;
 var s=raw.settings||{};Object.keys(defaults).forEach(function(k){state.settings[k]=typeof defaults[k]==='boolean'?(typeof s[k]==='boolean'?s[k]:defaults[k]):(typeof s[k]==='number'?clamp(s[k],0,100):defaults[k]);});
}
try{sanitize(window.__BOP_DATA__||JSON.parse(localStorage.getItem(storageKey)||'null'));}catch(e){}
function save(){
 try{
  if(window.webkit&&window.webkit.messageHandlers&&window.webkit.messageHandlers.save){window.webkit.messageHandlers.save.postMessage(JSON.stringify(state));}
  else localStorage.setItem(storageKey,JSON.stringify(state));
 }catch(e){toast('Your changes could not be saved. Please check free disk space.');}
}
window.bopSaveError=function(){toast('Could not save your profile. Please check free disk space.');};
function current(){return state.profiles.filter(function(p){return p.id===state.active;})[0];}
function contrast(hex){var a=hex.slice(1).match(/../g).map(function(v){v=parseInt(v,16)/255;return v<=.04045?v/12.92:Math.pow((v+.055)/1.055,2.4);});return a[0]*.2126+a[1]*.7152+a[2]*.0722>.39?'#24382e':'#ffffff';}
function shade(hex,percent){var num=parseInt(hex.slice(1),16),r=(num>>16)+Math.round(2.55*percent),g=((num>>8)&255)+Math.round(2.55*percent),b=(num&255)+Math.round(2.55*percent);r=Math.max(0,Math.min(255,r));g=Math.max(0,Math.min(255,g));b=Math.max(0,Math.min(255,b));return '#'+(r<16?'0':'')+r.toString(16)+(g<16?'0':'')+g.toString(16)+(b<16?'0':'')+b.toString(16);}
function theme(p){var c=colors(p&&p.colors);colorKeys.forEach(function(k){document.documentElement.style.setProperty('--'+k,c[k]);});['primary','secondary','garden','surface'].forEach(function(k){document.documentElement.style.setProperty('--on-'+k,contrast(c[k]));});document.body.classList.toggle('reduced',state.settings.reduced);document.body.setAttribute('data-pattern',(p&&p.pattern)||'dots');}
function icon(name){var paths={play:'<path d="M8 5l12 7-12 7z" fill="currentColor" stroke="none"/>',back:'<path d="M15 5l-7 7 7 7M8 12h13"/>',gear:'<path d="M9 3h6l1 4 4 1v7l-4 1-1 5H9l-1-5-4-1V8l4-1z"/><circle cx="12" cy="12" r="3"/>',sound:'<path d="M4 9h4l5-4v14l-5-4H4zM17 8q6 4 0 8"/>',mute:'<path d="M4 9h4l5-4v14l-5-4H4zM17 9l5 6m0-6l-5 6"/>',spark:'<path d="M12 2l3 7 7 3-7 3-3 7-3-7-7-3 7-3zM20 2v4m-2-2h4"/>',check:'<path d="M4 12l5 5L20 6"/>',pause:'<path d="M8 5v14M16 5v14" stroke-width="5"/>',home:'<path d="M3 11l9-8 9 8M6 9v12h12V9M10 21v-7h4v7"/>',close:'<path d="M5 5l14 14M19 5L5 19"/>',leaf:'<path d="M5 19C-2 4 14 2 21 3c0 15-10 20-16 16zm0 0L16 8"/>',people:'<circle cx="9" cy="7" r="3"/><path d="M2 21v-3a7 7 0 0114 0v3M17 4a3 3 0 010 6m1 4q5 0 5 7"/>'};return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(paths[name]||paths.spark)+'</svg>';}
function brand(){return '<div class="brand"><svg viewBox="0 0 44 44" aria-hidden="true"><rect width="44" height="44" rx="14" fill="#f0eacb"/><path d="M15 32V20" stroke="#457359" stroke-width="3"/><circle cx="14" cy="16" r="7" fill="#7773b1"/><circle cx="14" cy="16" r="3" fill="#f6ce70"/><circle cx="28" cy="26" r="8" fill="#a47958"/><circle cx="24" cy="19" r="4" fill="#a47958"/><circle cx="33" cy="20" r="4" fill="#a47958"/><circle cx="26" cy="26" r="1" fill="#293b36"/><circle cx="31" cy="26" r="1" fill="#293b36"/><path d="M28 29h2" stroke="#efd1bb" stroke-width="2"/></svg><span>bop & bloom</span></div>';}
function mascot(type,c){c=colors(c);var body='';
 if(type==='flower')body='<path d="M60 112V62m0 32Q20 65 27 94q10 16 33 10m0-13q39-28 36-1-9 19-36 14" fill="'+c.garden+'" stroke="'+c.garden+'" stroke-width="6"/><g fill="'+c.primary+'"><ellipse cx="60" cy="32" rx="16" ry="24"/><ellipse cx="60" cy="70" rx="16" ry="24"/><ellipse cx="40" cy="51" rx="24" ry="16"/><ellipse cx="80" cy="51" rx="24" ry="16"/></g><circle cx="60" cy="51" r="19" fill="'+c.secondary+'"/><circle cx="54" cy="49" r="2" fill="#293b36"/><circle cx="66" cy="49" r="2" fill="#293b36"/><path d="M55 57q5 5 10 0" fill="none" stroke="#293b36" stroke-width="2"/>';
 if(type==='mouse')body='<path d="M85 91q35 9 23-24" fill="none" stroke="'+c.secondary+'" stroke-width="5"/><circle cx="32" cy="35" r="23" fill="'+c.primary+'"/><circle cx="87" cy="35" r="23" fill="'+c.primary+'"/><circle cx="32" cy="35" r="13" fill="'+c.secondary+'"/><circle cx="87" cy="35" r="13" fill="'+c.secondary+'"/><ellipse cx="60" cy="76" rx="38" ry="36" fill="'+c.primary+'"/><ellipse cx="60" cy="89" rx="23" ry="20" fill="#f6e4ce"/><circle cx="47" cy="67" r="4" fill="#273931"/><circle cx="73" cy="67" r="4" fill="#273931"/><path d="M54 83q6-7 12 0l-6 6z" fill="'+c.secondary+'"/>';
 if(type==='star')body='<path d="M60 7l16 32 36 6-26 26 6 37-32-17-32 17 6-37L8 45l36-6z" fill="'+c.primary+'"/><circle cx="48" cy="60" r="4" fill="'+contrast(c.primary)+'"/><circle cx="72" cy="60" r="4" fill="'+contrast(c.primary)+'"/><path d="M50 73q10 10 20 0" fill="none" stroke="'+contrast(c.primary)+'" stroke-width="3"/><circle cx="36" cy="71" r="6" fill="'+c.secondary+'"/><circle cx="84" cy="71" r="6" fill="'+c.secondary+'"/>';
 if(type==='rocket')body='<path d="M44 82q-4 28 16 36 20-14 16-36" fill="'+c.secondary+'"/><path d="M35 62L14 98l28-8m43-28 21 36-28-8" fill="'+c.garden+'"/><path d="M60 4Q23 32 38 88h44Q97 32 60 4" fill="'+c.primary+'"/><circle cx="60" cy="47" r="17" fill="#fcf8ec"/><circle cx="60" cy="47" r="11" fill="'+c.secondary+'"/><path d="M48 77h24" stroke="#fcf8ec" stroke-width="4"/>';
 if(type==='butterfly')body='<path d="M56 56C6-14-9 66 41 73-3 113 48 131 58 79M64 56c50-70 65 10 15 17 44 40-7 58-17 6" fill="'+c.primary+'"/><circle cx="28" cy="47" r="12" fill="'+c.secondary+'"/><circle cx="92" cy="47" r="12" fill="'+c.secondary+'"/><path d="M58 42l-8-16m12 16 8-16M60 49v42" stroke="#425c41" stroke-width="7" stroke-linecap="round"/><circle cx="60" cy="43" r="10" fill="'+c.garden+'"/>';
 if(type==='dino')body='<path d="M25 94L8 68l28 11V47q0-27 29-27h21q22 0 21 22v16H73v18q1 29-24 29H28z" fill="'+c.primary+'"/><path d="M36 48l-14-6 14-13 5-15 12 10" fill="'+c.secondary+'"/><path d="M40 99v14m22-16v16" stroke="'+c.primary+'" stroke-width="13" stroke-linecap="round"/><circle cx="82" cy="36" r="4" fill="'+contrast(c.primary)+'"/><path d="M90 49h16" stroke="'+contrast(c.primary)+'" stroke-width="3"/>';
 if(type==='sprout')body='<ellipse cx="60" cy="101" rx="38" ry="13" fill="'+c.garden+'" opacity=".5"/><path d="M60 105V48" stroke="'+c.primary+'" stroke-width="8" stroke-linecap="round"/><path d="M60 70Q22 38 20 75q8 24 40 10m0-18q40-39 44 0-4 30-44 22" fill="'+c.garden+'"/><circle cx="51" cy="44" r="5" fill="'+c.secondary+'"/><circle cx="69" cy="44" r="5" fill="'+c.secondary+'"/><path d="M52 57q8 8 16 0" stroke="'+c.ink+'" stroke-width="3" fill="none"/>';
 if(type==='sun')body='<circle cx="60" cy="62" r="34" fill="'+c.secondary+'"/><g stroke="'+c.primary+'" stroke-width="8" stroke-linecap="round"><path d="M60 10v16M60 98v16M8 62h16M96 62h16M23 25l12 12M85 87l12 12M97 25L85 37M35 87L23 99"/></g><circle cx="49" cy="57" r="4" fill="'+c.ink+'"/><circle cx="71" cy="57" r="4" fill="'+c.ink+'"/><path d="M49 72q11 10 22 0" stroke="'+c.ink+'" stroke-width="3" fill="none"/>';
 if(type==='cat')body='<path d="M28 30L18 6l24 14z" fill="'+c.primary+'"/><path d="M92 30l10-24-24 14z" fill="'+c.primary+'"/><circle cx="60" cy="58" r="42" fill="'+c.primary+'"/><path d="M40 55q4 10 0 16m40-16q-4 10 0 16" stroke="'+c.secondary+'" stroke-width="4" fill="none"/><circle cx="47" cy="55" r="5" fill="'+c.ink+'"/><circle cx="73" cy="55" r="5" fill="'+c.ink+'"/><path d="M55 68q5 5 10 0" stroke="'+c.ink+'" stroke-width="3" fill="none"/><path d="M60 63l-16-3m16 7l-17 4m33-8l16-3m-16 7l17 4" stroke="'+c.ink+'" stroke-width="1.6"/><ellipse cx="60" cy="106" rx="30" ry="16" fill="'+c.secondary+'"/>';
 if(type==='bird')body='<ellipse cx="55" cy="70" rx="36" ry="40" fill="'+c.primary+'"/><path d="M88 68l20-8-6 20z" fill="'+c.secondary+'"/><circle cx="66" cy="56" r="5" fill="'+c.ink+'"/><path d="M30 70q-18 4-8 22 18 4 22-14" fill="'+c.garden+'"/><path d="M40 108l-6 12m20-10l-2 14m20-14l4 12" stroke="'+c.secondary+'" stroke-width="4" stroke-linecap="round"/>';
 if(type==='fish')body='<path d="M20 62q40-38 78-8-6 10 0 18-38 30-78-8 8-10 0-2z" fill="'+c.primary+'"/><path d="M98 54l20-14-4 22 4 22-20-14z" fill="'+c.secondary+'"/><circle cx="42" cy="55" r="5" fill="'+c.ink+'"/><path d="M30 70q10 6 20 0" stroke="'+c.ink+'" stroke-width="2" fill="none"/><path d="M55 50q10-8 20 0m-10 30q10 8 20 0" stroke="'+c.garden+'" stroke-width="4" fill="none"/>';
 if(type==='robot')body='<rect x="30" y="40" width="60" height="55" rx="14" fill="'+c.primary+'"/><rect x="46" y="14" width="28" height="24" rx="8" fill="'+c.secondary+'"/><circle cx="60" cy="8" r="5" fill="'+c.secondary+'"/><circle cx="47" cy="63" r="6" fill="'+contrast(c.primary)+'"/><circle cx="73" cy="63" r="6" fill="'+contrast(c.primary)+'"/><rect x="46" y="78" width="28" height="6" rx="3" fill="'+contrast(c.primary)+'"/><rect x="14" y="55" width="14" height="28" rx="6" fill="'+c.garden+'"/><rect x="92" y="55" width="14" height="28" rx="6" fill="'+c.garden+'"/>';
 return '<svg class="mascot" viewBox="0 0 120 125" aria-hidden="true">'+body+'</svg>';
}
function mouseArt(){return '<ellipse cx="100" cy="106" rx="67" ry="12" fill="#759b62" opacity=".3"/><ellipse cx="100" cy="97" rx="56" ry="16" fill="#655341"/><ellipse cx="100" cy="94" rx="49" ry="11" fill="#413e32"/><g class="mouse-art"><path d="M139 80q40 5 24-21" fill="none" stroke="#ca9b87" stroke-width="4"/><circle cx="71" cy="37" r="20" fill="#ad8b70"/><circle cx="129" cy="37" r="20" fill="#ad8b70"/><circle cx="71" cy="37" r="12" fill="#e6b5a5"/><circle cx="129" cy="37" r="12" fill="#e6b5a5"/><ellipse cx="100" cy="72" rx="38" ry="32" fill="#ad8b70"/><ellipse cx="100" cy="84" rx="25" ry="19" fill="#ecddc3"/><circle cx="86" cy="63" r="4" fill="#303b31"/><circle cx="114" cy="63" r="4" fill="#303b31"/><circle cx="87" cy="62" r="1.1" fill="white"/><circle cx="115" cy="62" r="1.1" fill="white"/><path d="M95 77q5-6 10 0l-5 6z" fill="#b66a68"/><path d="M100 82v5m0 0q-5 4-8 0m8 0q5 4 8 0M80 79l-20-4m20 11-19 3m59-10 20-4m-20 11 19 3" stroke="#655341" stroke-width="1.5" fill="none"/><ellipse cx="78" cy="98" rx="11" ry="6" fill="#c7a389"/><ellipse cx="122" cy="98" rx="11" ry="6" fill="#c7a389"/></g><path d="M43 104l-3-16 11 11 3-13 6 16m83 2 7-19 3 13 11-8-4 16" fill="#80a267"/>';}
function mazeHoleIcon(){return '<svg viewBox="0 0 40 40" aria-hidden="true"><ellipse cx="20" cy="26" rx="16" ry="10" fill="#4a3626"/><ellipse cx="20" cy="24" rx="12" ry="7" fill="#241a12"/></svg>';}
function mazeMouseIcon(){return '<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="12" cy="14" r="7" fill="#ad8b70"/><circle cx="28" cy="14" r="7" fill="#ad8b70"/><ellipse cx="20" cy="24" rx="13" ry="11" fill="#ad8b70"/><circle cx="16" cy="22" r="1.6" fill="#303b31"/><circle cx="24" cy="22" r="1.6" fill="#303b31"/><path d="M17 27q3 3 6 0" stroke="#303b31" stroke-width="1.2" fill="none"/></svg>';}
function mazeCheeseIcon(){return '<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M6 28L20 10l14 18z" fill="#f2c14e"/><circle cx="18" cy="24" r="1.6" fill="#c99a2e"/><circle cx="23" cy="21" r="1.3" fill="#c99a2e"/></svg>';}
function flowerHead(species,hue,cy){
 var cx=100,out='';
 if(species==='tulip'){
  var top=cy-30;
  out+='<path d="M'+(cx-15)+' '+cy+'Q'+(cx-15)+' '+(top-4)+' '+cx+' '+top+'Q'+(cx+15)+' '+(top-4)+' '+(cx+15)+' '+cy+'Q'+cx+' '+(cy+10)+' '+(cx-15)+' '+cy+'Z" fill="'+hue.petal+'"/><path d="M'+cx+' '+cy+'V'+top+'" stroke="'+shade(hue.petal,-15)+'" stroke-width="2" opacity=".6"/>';
 } else if(species==='sunflower'){
  for(var a=0;a<10;a++)out+='<ellipse cx="'+cx+'" cy="'+(cy-20)+'" rx="6" ry="21" transform="rotate('+(a*36)+' '+cx+' '+cy+')" fill="'+hue.petal+'"/>';
  out+='<circle cx="'+cx+'" cy="'+cy+'" r="14" fill="'+hue.center+'"/>';
 } else if(species==='rose'){
  out+='<circle cx="'+cx+'" cy="'+cy+'" r="18" fill="'+shade(hue.petal,10)+'"/><circle cx="'+cx+'" cy="'+(cy-2)+'" r="13" fill="'+hue.petal+'"/><circle cx="'+cx+'" cy="'+(cy-4)+'" r="7" fill="'+hue.center+'"/>';
 } else {
  for(var b=0;b<6;b++)out+='<ellipse cx="'+cx+'" cy="'+(cy-14)+'" rx="11" ry="17" transform="rotate('+(b*60)+' '+cx+' '+cy+')" fill="'+hue.petal+'"/>';
  out+='<circle cx="'+cx+'" cy="'+cy+'" r="12" fill="'+hue.center+'"/><circle cx="'+(cx-4)+'" cy="'+(cy-1)+'" r="1.7" fill="#464731"/><circle cx="'+(cx+4)+'" cy="'+(cy-1)+'" r="1.7" fill="#464731"/><path d="M'+(cx-4)+' '+(cy+4)+'q4 4 8 0" stroke="#464731" fill="none" stroke-width="1.3"/>';
 }
 return out;
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
function scene(type){var b='<svg viewBox="0 0 520 210" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="520" height="210" fill="'+(type==='bop'?'#e8ecdb':'#f4e7cd')+'"/><circle cx="430" cy="41" r="23" fill="#f8d981"/><path d="M-20 144Q105 54 275 140T570 100V220H-20" fill="'+(type==='bop'?'#b9c9a1':'#c4cba0')+'"/><path d="M-20 196Q130 119 290 178T560 151V230H-20" fill="'+(type==='bop'?'#9bb789':'#a3bb86')+'"/><path d="M56 40h42m-17-9h36M300 40h36" stroke="#fffdf4" stroke-width="11" stroke-linecap="round"/>';
 if(type==='bop')b+='<g class="ready"><g transform="translate(60 47) scale(1.05)">'+mouseArt()+'</g><g transform="translate(262 91) scale(.7)">'+mouseArt()+'</g></g>';
 else if(type==='scurry')b+='<g transform="translate(50 100) scale(.6)">'+mouseArt()+'</g><path d="M95 154H180V100H280V150H370" stroke="#fff7d0" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity=".85" stroke-dasharray="14 10"/><g transform="translate(200 88) scale(1.6)">'+mazeCheeseIcon()+'</g><g transform="translate(355 132) scale(1.6)">'+mazeHoleIcon()+'</g>';
 else for(var i=0;i<4;i++)b+='<g transform="translate('+(22+i*113)+' '+(i%2?79:48)+') scale(.85)">'+flowerArt(flowerSpecies[i%flowerSpecies.length],flowerHues[(i*2)%flowerHues.length],1)+'</g>';
 return b+'<path d="M28 201l4-14 7 13m421 2 7-19 5 18m-256 4 4-12 7 11" fill="#708f5a"/></svg>';}
function topbar(){var p=current();return '<header class="topbar">'+brand()+'<div class="top-actions"><button class="pill" data-action="profiles" aria-label="Switch player"><span class="profile-dot">'+esc(p.name.charAt(0).toUpperCase())+'</span>'+'<span class="player-name">'+esc(p.name)+'</span> '+icon('people')+'</button><button class="icon-button" data-action="mute" aria-label="'+(state.settings.muted?'Turn sound on':'Mute all sound')+'" aria-pressed="'+state.settings.muted+'">'+icon(state.settings.muted?'mute':'sound')+'</button><button class="icon-button" data-action="settings" aria-label="Settings">'+icon('gear')+'</button></div></header>';}
function footer(){return '<footer class="footer"><span>'+icon('leaf')+'Made for little moments of wonder.</span><button class="text-button" data-action="workshop">Make it yours '+String.fromCharCode(8599)+'</button></footer>';}
function shell(content){root.innerHTML='<div class="shell">'+topbar()+content+'</div>';}
function render(){theme(current());audioSync();if(!current()){welcome();return;}if(screen==='home')home();else if(screen==='workshop')workshop();else if(screen==='settings')settings();else if(screen==='game')renderGame();}
function home(){var p=current();shell('<main><section class="hero"><span class="little-spark" aria-hidden="true">✳</span><p class="eyebrow">A little world, all yours</p><div class="name-lockup">'+mascot(p.mascot,p.colors)+'<h1 class="name-title '+p.style+'">'+esc(p.name)+'’s playroom</h1></div><p class="hero-sub">Big discoveries. Little adventures. Let’s play.</p><span class="little-spark right" aria-hidden="true">✦</span></section><div class="section-heading"><h2>Pick your adventure</h2><span class="quiet">4 games · endless smiles</span></div><section class="games" aria-label="Games">'+card('bop','Bop!','Peekaboo, little mice. Can you catch them?','01')+card('bloom','Bloom!','Grow a little garden. Snip a bunch of flowers.','02')+card('scurry','Scurry!','A new maze appears every time. Drop cheese to guide a field mouse home.','03')+card('bouquet','Bouquet!','A bouquet appears — snip the matching flowers and fill the vase to match it.','04')+'</section></main>'+footer());}
function card(type,title,description,num){var labels={bop:'PEEK · BOP · GIGGLE',bloom:'GROW · SNIP · SMILE',scurry:'CHEESE · MAZE · HOME',bouquet:'MATCH · SNIP · BUNCH'};return '<article class="game-card"><div class="scene">'+scene(type)+'<span class="scene-label">'+labels[type]+'</span></div><div class="card-body"><div class="card-title-row"><h2>'+title+'</h2><span class="game-number">'+num+'</span></div><p>'+description+'</p><button class="big-button wide '+(type==='bloom'||type==='bouquet'?'secondary-button':'')+'" data-action="start" data-game="'+type+'">'+icon('play')+'Let’s '+type.replace('bouquet','bunch')+'!</button></div></article>';}
function welcome(){root.innerHTML='<main class="onboarding"><div class="welcome">'+brand()+'<div class="welcome-art">'+scene('bloom')+'</div><p class="eyebrow">Small people. Big adventures.</p><h1>Who’s ready to play?</h1><p>Your name. Your colors. Your own little world.<br>Let’s make a playroom just for you.</p><form id="welcome-form"><label class="sr-only" for="welcome-name">Your name</label><input id="welcome-name" name="name" type="text" maxlength="24" placeholder="Type your name" autocomplete="off" required><button class="big-button wide" type="submit">Make my playroom '+icon('spark')+'</button><div class="error" id="name-error" role="alert"></div></form><p class="hint">Grown-ups can help with this bit.<br>Names and settings stay on this computer.</p></div></main>';$('#welcome-form').onsubmit=function(e){e.preventDefault();createProfile($('#welcome-name').value);};}
function createProfile(name){name=name.trim().slice(0,24);if(!name){$('#name-error').textContent='Please enter a name.';return;}if(state.profiles.length>=24){toast('This computer already has 24 players.');return;}var p={id:id(),name:name,colors:copy(palettes[state.profiles.length%palettes.length]),mascot:'flower',style:'pop',pattern:'dots',mode:'relaxed',best:{bop:0,bloom:0,scurry:0,bouquet:0}};state.profiles.push(p);state.active=p.id;save();closeModal();screen='home';render();tone('hello');}
function pageHead(title,sub){return '<div class="page-head"><div><h1>'+title+'</h1><p>'+sub+'</p></div><button class="pill" data-action="'+(screen==='settings'&&game?'back-game':'home')+'">'+icon('back')+(screen==='settings'&&game?'Back to game':'Playroom')+'</button></div>';}
function workshop(){if(!draft)draft=copy(current());theme(draft);shell(pageHead('Make it yours','A name, a little character, and your favorite colors.')+'<main class="workshop"><section class="panel preview-panel" aria-label="Your name logo preview"><p class="eyebrow">Welcome to the world of</p><div id="preview-mascot">'+mascot(draft.mascot,draft.colors)+'</div><h2 id="preview-name" class="name-title '+draft.style+'">'+esc(draft.name)+'</h2><p class="quiet">A very you kind of playroom.</p>'+brand()+'</section><section class="panel"><label class="field"><span class="field-label">Your name</span><input type="text" id="edit-name" value="'+esc(draft.name)+'" maxlength="24" autocomplete="off"></label><span class="field-label">Your little sidekick</span><div class="choice-row">'+mascots.map(function(m){return '<button class="choice '+(draft.mascot===m?'selected':'')+'" data-action="mascot" data-value="'+m+'" aria-label="'+m+' logo" aria-pressed="'+(draft.mascot===m)+'">'+mascot(m,draft.colors)+'</button>';}).join('')+'</div><span class="field-label">Your lettering</span><div class="choice-row">'+styles.map(function(s,i){return '<button class="choice '+(draft.style===s?'selected':'')+'" data-action="lettering" data-value="'+s+'" aria-pressed="'+(draft.style===s)+'">'+styleLabels[i]+'</button>';}).join('')+'</div><span class="field-label">Playroom pattern</span><div class="choice-row">'+patterns.map(function(s,i){return '<button class="choice pattern-choice '+(draft.pattern===s?'selected':'')+'" data-action="pattern" data-value="'+s+'" aria-pressed="'+(draft.pattern===s)+'"><span class="pattern-swatch '+s+'"></span>'+patternLabels[i]+'</button>';}).join('')+'</div><span class="field-label">Quick palettes</span><div class="choice-row palette-row">'+palettes.map(function(pal,i){return '<button class="choice palette-choice" data-action="apply-palette" data-index="'+i+'" aria-label="'+esc(pal.name)+' palette" title="'+esc(pal.name)+'"><span class="palette-swatch" style="background:linear-gradient(135deg,'+pal.primary+' 50%,'+pal.secondary+' 50%)"></span></button>';}).join('')+'</div><span class="field-label">Your colors</span><div class="color-grid">'+colorKeys.map(function(k,i){return '<label class="color-control">'+['Main','Accent','Background','Cards','Text','Leaves'][i]+'<input type="color" data-color="'+k+'" value="'+draft.colors[k]+'"></label>';}).join('')+'</div><div class="button-row"><button class="pill" data-action="shuffle">'+icon('spark')+'Surprise me!</button><button class="big-button" data-action="save-style">'+icon('check')+'Save my style</button></div><p class="hint">Surprise me makes a fresh palette, sidekick, name logo, and playroom pattern. Everything is generated here, even offline.</p></section></main>');$('#edit-name').oninput=function(){draft.name=this.value;$('#preview-name').textContent=this.value||'Your name';};document.querySelectorAll('[data-color]').forEach(function(el){el.oninput=function(){draft.colors[this.getAttribute('data-color')]=this.value;theme(draft);$('#preview-mascot').innerHTML=mascot(draft.mascot,draft.colors);};});}
function settings(){var s=state.settings,p=current();shell(pageHead('A few little settings','Sound, play pace, and comfort for '+esc(p.name)+'.')+'<main class="settings-grid"><section class="panel"><h2>Sounds of the playroom</h2>'+switchRow('muted','Mute all sound','A quiet moment, whenever you need it.')+range('volume','Master volume',s.volume)+'<div class="divider"></div>'+switchRow('music','Background music','A soft, original music-box melody.')+range('musicVolume','Music volume',s.musicVolume)+'<div class="divider"></div>'+switchRow('effects','Game sounds','Little pops, snips, and happy notes.')+range('effectsVolume','Effects volume',s.effectsVolume)+'<button class="pill" data-action="test-sound">'+icon('sound')+'Try a sound</button></section><section class="panel"><h2>Play your way</h2><label class="field"><span class="field-label">Play pace for '+esc(p.name)+'</span><select id="pace"><option value="relaxed" '+(p.mode==='relaxed'?'selected':'')+'>Little explorer · no timer</option><option value="gentle" '+(p.mode==='gentle'?'selected':'')+'>Growing explorer · gentle 60-second round</option><option value="speedy" '+(p.mode==='speedy'?'selected':'')+'>Speedy explorer · faster 60-second round</option></select></label><p class="hint">Little explorer is made for ages 3–5: big targets, patient mice, and no hurry. Every mode is kind. Misses never take points away.</p><div class="divider"></div>'+switchRow('reduced','Less animation','Keeps the playroom a little calmer.')+'<div class="divider"></div><h2>Everyone gets a turn</h2><p class="hint">Each player has their own name logo, colors, pace, and best scores. Sound settings are shared on this computer.</p><div class="empty-space"><button class="pill" data-action="profiles">'+icon('people')+'Choose a player</button></div><p class="hint">Settings save automatically.</p></section></main>');$('#pace').onchange=function(){p.mode=this.value;save();};document.querySelectorAll('input[type=range]').forEach(function(el){el.oninput=function(){state.settings[this.id]=Number(this.value);$('#value-'+this.id).textContent=this.value+'%';save();audioSync();};});}
function switchRow(key,label,sub){return '<div class="setting-row"><label id="label-'+key+'">'+label+'<small>'+sub+'</small></label><button class="switch" role="switch" aria-labelledby="label-'+key+'" aria-checked="'+state.settings[key]+'" data-action="toggle" data-value="'+key+'"></button></div>';}
function range(key,label,value){return '<label class="field"><span class="range-label"><span>'+label+'</span><span id="value-'+key+'">'+value+'%</span></span><input id="'+key+'" type="range" min="0" max="100" value="'+value+'"></label>';}
function toast(message){var t=$('#toast');t.className='toast';t.textContent=message;clearTimeout(toast.timer);toast.timer=setTimeout(function(){t.textContent='';},4500);}
function dialog(content,label){lastFocus=document.activeElement;modalRoot.innerHTML='<div class="overlay"><section class="dialog" role="dialog" aria-modal="true" aria-label="'+esc(label)+'">'+content+'</section></div>';var first=modalRoot.querySelector('input,button');if(first)first.focus();}
function closeModal(){modalRoot.innerHTML='';if(lastFocus&&document.contains(lastFocus))lastFocus.focus();lastFocus=null;}
function profiles(){if(game)pauseGame();dialog('<button class="icon-button dialog-close" data-action="close-modal" aria-label="Close">'+icon('close')+'</button><h2>Who’s playing?</h2><p>A little world for everyone.</p><div class="profile-list">'+state.profiles.map(function(p){return '<button class="profile-select '+(p.id===state.active?'active':'')+'" data-action="select-profile" data-id="'+esc(p.id)+'">'+mascot(p.mascot,p.colors)+esc(p.name)+'</button>';}).join('')+'</div><button class="big-button wide" data-action="add-profile" '+(state.profiles.length>=24?'disabled':'')+'>+ Add a player</button>','Choose a player');}
function addProfile(){dialog('<button class="icon-button dialog-close" data-action="profiles" aria-label="Back">'+icon('back')+'</button><h2>A new little explorer</h2><p>What should we call your playroom?</p><form id="add-form"><label class="field"><span class="field-label">Your name</span><input id="new-name" type="text" maxlength="24" required autocomplete="off"></label><button class="big-button wide" type="submit">Make my playroom '+icon('spark')+'</button><div class="error" id="name-error" role="alert"></div></form>','Add a player');$('#add-form').onsubmit=function(e){e.preventDefault();stopGame();createProfile($('#new-name').value);};}
var audio=null,musicTimer=null,noteIndex=0;
function unlockAudio(){try{if(!audio){var C=window.AudioContext||window.webkitAudioContext;if(C)audio=new C();}if(audio&&audio.state==='suspended')audio.resume();audioSync();}catch(e){}}
function note(freq,duration,volume,type){if(!audio||audio.state!=='running'||state.settings.muted)return;var o=audio.createOscillator(),g=audio.createGain();o.type=type||'sine';o.frequency.value=freq;g.gain.setValueAtTime(0,audio.currentTime);g.gain.linearRampToValueAtTime(volume*state.settings.volume/100,audio.currentTime+.015);g.gain.exponentialRampToValueAtTime(.0001,audio.currentTime+duration);o.connect(g);g.connect(audio.destination);o.start();o.stop(audio.currentTime+duration+.03);o.onended=function(){o.disconnect();g.disconnect();};}
function tone(kind){if(!state.settings.effects)return;var v=.15*state.settings.effectsVolume/100;note(kind==='snip'?740:kind==='hello'?523:kind==='finish'?784:kind==='nope'?220:330,.17,v,'sine');if(kind==='finish'||kind==='hello')setTimeout(function(){if(state.settings.effects)note(1046,.35,v*.7);},150);}
function audioSync(){if(musicTimer){clearInterval(musicTimer);musicTimer=null;}if(!audio)return;if(state.settings.muted||document.hidden){if(audio.state==='running')audio.suspend();return;}if(audio.state==='suspended')audio.resume();if(!state.settings.music||(game&&game.paused))return;musicTimer=setInterval(function(){var melody=[523,0,659,0,784,659,587,0,523,0,440,0,392,0,587,0];var f=melody[noteIndex++%melody.length];if(f)note(f,.55,.055*state.settings.musicVolume/100);},480);}
function newFlowerSlot(){return {growth:.12+Math.random()*.7,cut:0,species:randomSpecies(),hue:randomHue()};}
function newBouquetRound(g){
 var picks=[],tries=0;
 while(picks.length<3&&tries<50){
  tries++;
  var cand={species:randomSpecies(),hue:randomHue()};
  if(!picks.some(function(p){return flowerTypeKey(p)===flowerTypeKey(cand);}))picks.push(cand);
 }
 g.target=picks;g.vase=picks.map(function(){return false;});
 var slotIdx=[0,1,2,3,4,5,6,7,8];
 for(var i=slotIdx.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=slotIdx[i];slotIdx[i]=slotIdx[j];slotIdx[j]=t;}
 for(var k=0;k<picks.length;k++){var slot=g.slots[slotIdx[k]];slot.species=picks[k].species;slot.hue=picks[k].hue;slot.growth=Math.min(slot.growth,.5);}
}
function matchTargetIndex(g,s){var sk=flowerTypeKey(s);for(var i=0;i<g.target.length;i++){if(!g.vase[i]&&flowerTypeKey(g.target[i])===sk)return i;}return -1;}
function buildMaze(size){
 var cells=[];
 for(var y=0;y<size;y++)for(var x=0;x<size;x++)cells.push({x:x,y:y,n:true,s:true,e:true,w:true,visited:false});
 function at(x,y){if(x<0||y<0||x>=size||y>=size)return null;return cells[y*size+x];}
 var start=at(0,0);start.visited=true;var stack=[start];
 var dirs=[{dx:0,dy:-1,a:'n',b:'s'},{dx:0,dy:1,a:'s',b:'n'},{dx:-1,dy:0,a:'w',b:'e'},{dx:1,dy:0,a:'e',b:'w'}];
 while(stack.length){
  var cur=stack[stack.length-1],options=[];
  dirs.forEach(function(d){var nb=at(cur.x+d.dx,cur.y+d.dy);if(nb&&!nb.visited)options.push({cell:nb,dir:d});});
  if(options.length){var pick=options[Math.floor(Math.random()*options.length)];cur[pick.dir.a]=false;pick.cell[pick.dir.b]=false;pick.cell.visited=true;stack.push(pick.cell);}
  else stack.pop();
 }
 var key=function(c){return c.x+','+c.y;},dist={},queue=[start],farthest=start;
 dist[key(start)]=0;
 while(queue.length){
  var c=queue.shift(),neighbors=[];
  if(!c.n)neighbors.push(at(c.x,c.y-1));if(!c.s)neighbors.push(at(c.x,c.y+1));if(!c.e)neighbors.push(at(c.x+1,c.y));if(!c.w)neighbors.push(at(c.x-1,c.y));
  neighbors.forEach(function(nb){if(nb&&!(key(nb)in dist)){dist[key(nb)]=dist[key(c)]+1;queue.push(nb);if(dist[key(nb)]>dist[key(farthest)])farthest=nb;}});
 }
 return {size:size,cells:cells,at:at,home:{x:farthest.x,y:farthest.y}};
}
function openBetween(maze,ax,ay,bx,by){var a=maze.at(ax,ay);if(!a)return false;if(bx===ax&&by===ay-1)return !a.n;if(bx===ax&&by===ay+1)return !a.s;if(bx===ax+1&&by===ay)return !a.e;if(bx===ax-1&&by===ay)return !a.w;return false;}
function mazeNeighbors(maze,x,y){var out=[];[[0,-1],[0,1],[1,0],[-1,0]].forEach(function(d){var nx=x+d[0],ny=y+d[1];if(maze.at(nx,ny)&&openBetween(maze,x,y,nx,ny))out.push({x:nx,y:ny});});return out;}
function trailHas(trail,x,y){for(var i=0;i<trail.length;i++)if(trail[i].x===x&&trail[i].y===y)return i;return -1;}
function newMazeRound(g){g.maze=buildMaze(MAZE_SIZE);g.trail=[{x:0,y:0}];}
function mazeView(g){
 var maze=g.maze,size=maze.size,trail=g.trail,head=trail[trail.length-1];
 var neighbors=mazeNeighbors(maze,head.x,head.y);
 var forward=neighbors.filter(function(n){return trailHas(trail,n.x,n.y)<0;});
 var cellsHtml='';
 for(var y=0;y<size;y++){
  for(var x=0;x<size;x++){
   var c=maze.at(x,y);
   var classes=['maze-cell'];
   var isHome=(x===maze.home.x&&y===maze.home.y);
   var isHead=(x===head.x&&y===head.y);
   var trailIdx=trailHas(trail,x,y);
   var isForward=forward.some(function(f){return f.x===x&&f.y===y;});
   if(isHome)classes.push('home');
   if(isHead)classes.push('head');
   if(trailIdx>=0&&!isHead)classes.push('crumb');
   if(isForward)classes.push('next');
   var clickable=isForward||(trailIdx>=0&&trailIdx<trail.length-1);
   var style='border-top:'+(c.n?'3px solid var(--ink)':'3px solid transparent')+';border-left:'+(c.w?'3px solid var(--ink)':'3px solid transparent')+';border-right:'+(c.e?'3px solid var(--ink)':'3px solid transparent')+';border-bottom:'+(c.s?'3px solid var(--ink)':'3px solid transparent')+';';
   var content='';
   if(isHome)content=mazeHoleIcon();else if(isHead)content=mazeMouseIcon();else if(trailIdx>=0)content=mazeCheeseIcon();else if(isForward)content='<span class="maze-hint" aria-hidden="true"></span>';
   cellsHtml+='<button class="'+classes.join(' ')+'" style="'+style+'" '+(clickable?'data-action="maze-cell" ':'tabindex="-1" ')+'data-x="'+x+'" data-y="'+y+'" aria-label="'+(isHome?'Mouse home':clickable?'Drop cheese here':'maze wall')+'" '+(clickable?'':'aria-hidden="true"')+'>'+content+'</button>';
  }
 }
 return '<div class="maze-wrap"><div class="maze-grid" style="grid-template-columns:repeat('+size+',1fr)">'+cellsHtml+'</div><div class="maze-actions"><button class="pill" data-action="maze-reset">'+icon('back')+'Start this maze over</button></div></div>';
}
function mazeClick(x,y){
 if(!game||game.paused||game.ended||game.type!=='scurry')return;
 var g=game,trail=g.trail,idx=trailHas(trail,x,y);
 if(idx>=0){
  if(idx<trail.length-1){g.trail=trail.slice(0,idx+1);tone('bop');renderGame();}
  return;
 }
 var head=trail[trail.length-1];
 if(!openBetween(g.maze,head.x,head.y,x,y))return;
 g.trail.push({x:x,y:y});
 tone('snip');
 if(x===g.maze.home.x&&y===g.maze.home.y){
  g.score++;
  tone('finish');toast('Home safe! A new maze is waiting.');
  newMazeRound(g);
 }
 renderGame();
}
function mazeDirectionMove(key){
 if(!game||game.type!=='scurry')return;
 var dir=mazeKeyDirs[key];if(!dir)return;
 var head=game.trail[game.trail.length-1];
 var delta={n:[0,-1],s:[0,1],e:[1,0],w:[-1,0]}[dir];
 mazeClick(head.x+delta[0],head.y+delta[1]);
}
function classicField(g){
 var isMouse=g.type==='bop';
 var extra='';
 if(g.type==='bouquet'){
  extra='<div class="bouquet-ask"><span>Match this bouquet</span><div class="target-row">'+g.target.map(function(t,i){return '<span class="target-chip'+(g.vase[i]?' got':'')+'" data-i="'+i+'" aria-label="'+t.hue.key+' '+t.species+(g.vase[i]?' collected':' still needed')+'"><svg viewBox="0 0 200 125" aria-hidden="true">'+flowerArt(t.species,t.hue,1)+'</svg>'+(g.vase[i]?'<span class="check-badge">'+icon('check')+'</span>':'')+'</span>';}).join('')+'</div></div>';
 }
 return extra+'<div class="target-grid">'+g.slots.map(function(s,i){return '<button class="target'+((g.type==='bouquet'&&s.growth>=.95&&matchTargetIndex(g,s)>=0)?' wanted':'')+'" id="target-'+i+'" data-action="hit" data-index="'+i+'" aria-label="'+(isMouse?'Mouse path':'Flower')+' '+(i+1)+'"><svg viewBox="0 0 200 125" aria-hidden="true">'+(isMouse?mouseArt():flowerArt(s.species,s.hue,s.growth))+'</svg><span class="keycap" aria-hidden="true">'+['Q · 1','W · 2','E · 3','A · 4','S · 5','D · 6','Z · 7','X · 8','C · 9'][i]+'</span></button>';}).join('')+'</div>';
}
function startGame(type){
 stopGame();screen='game';var p=current();
 game={type:type,score:0,elapsed:0,paused:false,mode:p.mode,last:performance.now(),frame:null,ended:false,spawn:0};
 if(type==='bop'){game.slots=[];for(var i=0;i<9;i++)game.slots.push({active:false,until:0,cut:0});}
 else if(type==='bloom'){game.slots=[];for(var j=0;j<9;j++)game.slots.push(newFlowerSlot());}
 else if(type==='bouquet'){game.slots=[];for(var k=0;k<9;k++)game.slots.push(newFlowerSlot());newBouquetRound(game);}
 else if(type==='scurry'){newMazeRound(game);}
 render();game.frame=requestAnimationFrame(tick);
}
function renderGame(){
 if(!game)return;
 var g=game,timed=g.mode!=='relaxed';
 var prompt={bop:'Bop a mouse when it peeks out!',bloom:'Snip the flowers. Watch them grow again!',scurry:'Drop cheese to guide the mouse home!',bouquet:'Snip the matching flowers for the bouquet!'}[g.type];
 var body=g.type==='scurry'?mazeView(g):classicField(g);
 var tip=g.type==='scurry'?'Click, tap, or use arrow keys / W A S D to drop cheese.':'Click or tap to play. Keyboard: Q W E / A S D / Z X C, or 1–9.';
 shell('<main><div class="game-header"><div class="game-heading"><button class="icon-button" data-action="leave-game" aria-label="Back to playroom">'+icon('home')+'</button><h1>'+esc(current().name)+'’s '+gameNames[g.type]+'</h1></div><div class="scoreboard"><div class="score"><small>'+gameScores[g.type]+'</small><span id="score">'+g.score+'</span></div><div class="score"><small>'+(timed?'SECONDS':'YOUR PACE')+'</small><span id="time">'+(timed?Math.ceil(60-g.elapsed):'∞')+'</span></div><button class="icon-button" data-action="pause" aria-label="Pause game">'+icon('pause')+'</button></div></div><div class="progress-track"><div id="progress" class="progress-bar"></div></div><div class="playfield '+g.type+'-field"><div class="field-top"><span>'+prompt+'</span><strong>'+(timed?'Let’s explore':'No hurry. Just play.')+'</strong></div>'+body+'<div id="pause-layer"></div></div><div class="field-footer"><span class="game-tip">'+tip+'</span><button class="pill" data-action="finish">'+icon('check')+'All done</button></div></main>');
 if(g.paused)showPause();
}
function tick(now){
 if(!game)return;
 var g=game,elapsed=Math.max(0,(now-g.last)/1000),dt=Math.min(elapsed,.1);
 g.last=now;
 if(!g.paused&&!g.ended){
  g.elapsed+=elapsed;
  if(g.mode!=='relaxed'&&g.elapsed>=60){finishGame();return;}
  if(g.type==='bop'){
   var active=0;
   g.slots.forEach(function(s,i){if(s.active){active++;if(g.mode!=='relaxed'&&g.elapsed>s.until){s.active=false;var el=$('#target-'+i);if(el)el.classList.remove('ready');}}});
   g.spawn-=dt;var max=g.mode==='speedy'?4:g.mode==='gentle'?3:2;
   if(g.spawn<=0&&active<max){
    var available=[];g.slots.forEach(function(s,i){if(!s.active&&g.elapsed>s.cut)available.push(i);});
    if(available.length){var index=available[Math.floor(Math.random()*available.length)],slot=g.slots[index];slot.active=true;slot.until=g.elapsed+(g.mode==='speedy'?1.6:3.3);var el=$('#target-'+index);if(el){el.className='target ready';el.setAttribute('aria-label','Bop mouse '+(index+1));}}
    g.spawn=g.mode==='speedy'?.4:.75;
   }
  } else if(g.type==='bloom'||g.type==='bouquet'){
   g.slots.forEach(function(s,i){
    if(g.elapsed<s.cut)return;
    s.growth=Math.min(1,s.growth+dt/(g.mode==='speedy'?2.5:4.5));
    var el=$('#target-'+i);
    if(el){el.querySelector('svg').innerHTML=flowerArt(s.species,s.hue,s.growth);el.setAttribute('aria-label',(s.growth>=.95?'Blooming flower ':'Growing flower ')+(i+1));if(g.type==='bouquet')el.classList.toggle('wanted',s.growth>=.95&&matchTargetIndex(g,s)>=0);}
   });
  }
  if(g.mode!=='relaxed'){var t=$('#time');if(t)t.textContent=Math.max(0,Math.ceil(60-g.elapsed));var pr=$('#progress');if(pr)pr.style.width=(Math.max(0,1-g.elapsed/60)*100)+'%';}
 }
 g.frame=requestAnimationFrame(tick);
}
function hit(index){
 if(!game||game.paused||game.ended)return;
 var g=game,s=g.slots[index],el=$('#target-'+index);
 if(!el)return;
 if(g.type==='bop'){
  if(!s.active)return;
  s.active=false;s.cut=g.elapsed+.4;el.classList.remove('ready');el.classList.add('hit');el.setAttribute('aria-label','Empty mouse path '+(index+1));
  tone('bop');
 } else if(g.type==='bloom'){
  if(s.growth<.28||g.elapsed<s.cut)return;
  var fresh=newFlowerSlot();s.growth=0;s.cut=g.elapsed+.35;s.species=fresh.species;s.hue=fresh.hue;
  el.querySelector('svg').innerHTML=flowerArt(s.species,s.hue,0);
  tone('snip');
 } else if(g.type==='bouquet'){
  if(s.growth<.28||g.elapsed<s.cut)return;
  var ti=matchTargetIndex(g,s);
  if(ti<0){el.classList.add('nope');tone('nope');setTimeout(function(){el.classList.remove('nope');},420);return;}
  g.vase[ti]=true;
  var chip=document.querySelector('.target-chip[data-i="'+ti+'"]');
  if(chip&&!chip.classList.contains('got')){chip.classList.add('got');chip.setAttribute('aria-label',g.target[ti].hue.key+' '+g.target[ti].species+' collected');var badge=document.createElement('span');badge.className='check-badge';badge.innerHTML=icon('check');chip.appendChild(badge);}
  var fresh2=newFlowerSlot();s.growth=0;s.cut=g.elapsed+.35;s.species=fresh2.species;s.hue=fresh2.hue;
  el.querySelector('svg').innerHTML=flowerArt(s.species,s.hue,0);el.classList.remove('wanted');
  tone('snip');
 } else return;
 var pop=document.createElement('span');pop.className='pop-score';pop.textContent=g.type==='bop'?'★':'✂';el.appendChild(pop);
 setTimeout(function(){if(pop.parentNode)pop.parentNode.removeChild(pop);},650);
 var scored=g.type!=='bouquet';
 if(g.type==='bouquet'&&g.vase.length&&g.vase.every(function(v){return v;})){
  scored=true;
  tone('finish');toast('Bouquet complete! A new one is waiting.');
  newBouquetRound(g);renderGame();
 }
 if(scored){g.score++;var scoreEl=$('#score');if(scoreEl)scoreEl.textContent=g.score;}
}
function pauseGame(){if(!game||game.paused)return;game.paused=true;showPause();audioSync();}
function showPause(){var layer=$('#pause-layer');if(layer)layer.innerHTML='<div class="pause-cover"><div><h2>A little breather.</h2><p>Your garden will wait for you.</p><button class="big-button" data-action="resume">'+icon('play')+'Keep playing</button></div></div>';}
function resumeGame(){if(!game)return;game.paused=false;game.last=performance.now();$('#pause-layer').innerHTML='';audioSync();}
function stopGame(){if(game&&game.frame)cancelAnimationFrame(game.frame);game=null;}
function finishGame(){if(!game||game.ended)return;game.ended=true;game.paused=true;cancelAnimationFrame(game.frame);var g=game,p=current(),best=false;if(g.mode!=='relaxed'&&g.score>p.best[g.type]){p.best[g.type]=g.score;best=true;save();}audioSync();tone('finish');dialog('<div class="center"><div class="result-medal">'+mascot((g.type==='bop'||g.type==='scurry')?'mouse':'flower',p.colors)+'</div><p class="eyebrow">'+(best?'A new personal best!':'A lovely little adventure')+'</p><h2>Lovely playing, '+esc(p.name)+'!</h2><div class="result-score">'+g.score+'</div><p class="result-label">'+gameLabels[g.type]+'</p><div class="button-row"><button class="big-button wide" data-action="again">'+icon('play')+'Play again</button><button class="pill wide" data-action="home">'+icon('home')+'Back to my playroom</button></div></div>','Well played');}
function leaveGame(){pauseGame();dialog('<h2>Back to your playroom?</h2><p>You can choose another adventure, or keep playing this one.</p><div class="button-row"><button class="big-button" data-action="home">'+icon('home')+'Playroom</button><button class="pill" data-action="keep-playing">Keep playing</button></div>','Leave game');}
function pressTarget(e){var t=e.target.closest('[data-action="hit"]');if(t){e.preventDefault();unlockAudio();hit(Number(t.getAttribute('data-index')));}}
if(window.PointerEvent){root.addEventListener('pointerdown',pressTarget);}else{root.addEventListener('mousedown',pressTarget);root.addEventListener('touchstart',pressTarget,{passive:false});}
document.addEventListener('click',function(e){var b=e.target.closest('[data-action]');if(!b)return;unlockAudio();var a=b.getAttribute('data-action'),v=b.getAttribute('data-value');
 if(a==='hit'){if(e.detail===0)hit(Number(b.getAttribute('data-index')));return;}
 if(a==='home'){stopGame();draft=null;closeModal();screen='home';render();}
 else if(a==='start')startGame(b.getAttribute('data-game'));
 else if(a==='settings'){pauseGame();draft=null;closeModal();screen='settings';render();}
 else if(a==='back-game'){screen='game';render();}
 else if(a==='workshop'){draft=copy(current());screen='workshop';render();}
 else if(a==='mute'){state.settings.muted=!state.settings.muted;save();audioSync();b.innerHTML=icon(state.settings.muted?'mute':'sound');b.setAttribute('aria-label',state.settings.muted?'Turn sound on':'Mute all sound');b.setAttribute('aria-pressed',state.settings.muted);if(screen==='settings')settings();}
 else if(a==='profiles')profiles();
 else if(a==='close-modal')closeModal();
 else if(a==='add-profile')addProfile();
 else if(a==='select-profile'){stopGame();state.active=b.getAttribute('data-id');save();draft=null;closeModal();screen='home';render();}
 else if(a==='shuffle'){var options=palettes.filter(function(p){return p.primary!==draft.colors.primary;});draft.colors=copy(options[Math.floor(Math.random()*options.length)]);draft.mascot=mascots[(mascots.indexOf(draft.mascot)+1+Math.floor(Math.random()*(mascots.length-1)))%mascots.length];draft.style=styles[(styles.indexOf(draft.style)+1+Math.floor(Math.random()*(styles.length-1)))%styles.length];draft.pattern=patterns[(patterns.indexOf(draft.pattern)+1+Math.floor(Math.random()*(patterns.length-1)))%patterns.length];workshop();tone('hello');}
 else if(a==='apply-palette'){draft.colors=copy(palettes[Number(b.getAttribute('data-index'))]);workshop();}
 else if(a==='mascot'){draft.mascot=v;workshop();}
 else if(a==='lettering'){draft.style=v;workshop();}
 else if(a==='pattern'){draft.pattern=v;workshop();}
 else if(a==='save-style'){if(!draft.name.trim()){toast('Your playroom needs a name.');$('#edit-name').focus();return;}draft.name=draft.name.trim();var p=current();p.name=draft.name;p.colors=copy(draft.colors);p.style=draft.style;p.mascot=draft.mascot;p.pattern=draft.pattern;save();draft=null;screen='home';render();toast('Your playroom, your style. Saved!');}
 else if(a==='toggle'){state.settings[v]=!state.settings[v];save();render();}
 else if(a==='test-sound'){tone('hello');}
 else if(a==='pause')pauseGame();
 else if(a==='resume')resumeGame();
 else if(a==='keep-playing'){closeModal();resumeGame();}
 else if(a==='finish')finishGame();
 else if(a==='again'){var type=game.type;closeModal();startGame(type);}
 else if(a==='leave-game')leaveGame();
 else if(a==='maze-cell'){mazeClick(Number(b.getAttribute('data-x')),Number(b.getAttribute('data-y')));}
 else if(a==='maze-reset'){newMazeRound(game);renderGame();}
});
document.addEventListener('keydown',function(e){
 if(modalRoot.firstChild){if(e.key==='Tab'){var els=modalRoot.querySelectorAll('button:not([disabled]),input,select');var first=els[0],last=els[els.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}if(e.key==='Escape'&&!(game&&game.ended)){closeModal();}return;}
 if(/INPUT|SELECT|TEXTAREA/.test(e.target.tagName))return;
 if(game&&screen==='game'){
  if(e.key==='Escape'||e.key===' '){e.preventDefault();game.paused?resumeGame():pauseGame();return;}
  var k=e.key.toLowerCase();
  if(game.type==='scurry'){if(!e.repeat&&mazeKeyDirs.hasOwnProperty(k)){e.preventDefault();unlockAudio();mazeDirectionMove(k);}return;}
  var idx='qweasdzxc'.indexOf(k);
  if(/^[1-9]$/.test(k))idx=Number(k)-1;
  if(idx>=0&&!e.repeat){e.preventDefault();unlockAudio();hit(idx);}
 }
});
document.addEventListener('visibilitychange',function(){if(document.hidden)pauseGame();audioSync();});
window.addEventListener('blur',function(){pauseGame();});
window.addEventListener('beforeunload',save);
render();
})();
