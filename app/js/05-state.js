/* App state: profile schema, sanitization/migration, save/load, and theming. */
var $ = function(s) { return document.querySelector(s); };
var root = $('#app'), modalRoot = $('#modal-root');
var storageKey = 'bop-and-bloom-v1';
var defaults={muted:false,music:true,effects:true,volume:65,musicVolume:25,effectsVolume:75,reduced:false};
var state={version:1,active:null,profiles:[],settings:copy(defaults),parentPin:'1234',knownGameIds:GAME_IDS.slice()};
var uiScreen='home', draft=null, game=null, lastFocus=null, homeTab='play', pinEntry='', pinTarget='gate', managing=null;
function copy(x){return JSON.parse(JSON.stringify(x));}
function esc(x){return String(x).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function clamp(n,min,max){return Math.max(min,Math.min(max,Number(n)||0));}
function id(){return 'p'+Date.now().toString(36)+Math.random().toString(36).slice(2,9);}
function colors(c){var out=copy(palettes[0]);colorKeys.forEach(function(k){if(c&&/^#[0-9a-f]{6}$/i.test(c[k]))out[k]=c[k];});return out;}
function sanitizeDifficulty(d){var out={};GAME_IDS.forEach(function(gid){out[gid]=DIFF_LEVELS.indexOf(d&&d[gid])>=0?d[gid]:'easy';});return out;}
function sanitizeList(list,allowed){if(!Array.isArray(list))return null;var f=list.filter(function(v){return allowed.indexOf(v)>=0;});return f.length?f:null;}
function sanitizeBest(b){var out={};GAME_IDS.forEach(function(gid){out[gid]=clamp(b&&b[gid],0,999999);});return out;}
function sanitizeEnabledGames(list,newGameIds){
 if(!Array.isArray(list))return GAME_IDS.slice();
 var kept=list.filter(function(v){return GAME_IDS.indexOf(v)>=0;});
 newGameIds.forEach(function(gid){if(kept.indexOf(gid)<0)kept.push(gid);});
 return kept.length?kept:GAME_IDS.slice();
}
function sanitizeAssignments(list){
 if(!Array.isArray(list))return [];
 return list.slice(0,200).filter(function(a){return a&&typeof a.id==='string'&&GAME_IDS.indexOf(a.gameId)>=0;}).map(function(a){return {id:a.id,gameId:a.gameId,assignedAt:Number(a.assignedAt)||Date.now(),recurring:a.recurring!==false,completed:!!a.completed,completedAt:a.completedAt?Number(a.completedAt):null,score:clamp(a.score,0,999999),timesPlayed:clamp(a.timesPlayed,0,999999)};});
}
function sanitize(raw){
 if(!raw||raw.version!==1||!Array.isArray(raw.profiles))return;
 var known=Array.isArray(raw.knownGameIds)?raw.knownGameIds:PRE_KNOWN_GAME_IDS;
 var newGameIds=GAME_IDS.filter(function(gid){return known.indexOf(gid)<0;});
 state.profiles=raw.profiles.slice(0,24).filter(function(p){return p&&typeof p.name==='string'&&p.name.trim();}).map(function(p){return {
  id:typeof p.id==='string'?p.id:id(),
  name:p.name.trim().slice(0,24),
  colors:colors(p.colors),
  mascot:mascots.indexOf(p.mascot)>=0?p.mascot:'flower',
  style:styles.indexOf(p.style)>=0?p.style:'pop',
  pattern:patterns.indexOf(p.pattern)>=0?p.pattern:'dots',
  difficulty:sanitizeDifficulty(p.difficulty),
  enabledGames:sanitizeEnabledGames(p.enabledGames,newGameIds),
  enabledDifficulties:sanitizeList(p.enabledDifficulties,DIFF_LEVELS)||DIFF_LEVELS.slice(),
  enabledPacks:sanitizeList(p.enabledPacks,allPackIds()),
  assignments:sanitizeAssignments(p.assignments),
  points:clamp(p.points,0,9999999),
  best:sanitizeBest(p.best)
 };});
 state.active=state.profiles.some(function(p){return p.id===raw.active;})?raw.active:(state.profiles[0]||{}).id||null;
 var s=raw.settings||{};Object.keys(defaults).forEach(function(k){state.settings[k]=typeof defaults[k]==='boolean'?(typeof s[k]==='boolean'?s[k]:defaults[k]):(typeof s[k]==='number'?clamp(s[k],0,100):defaults[k]);});
 state.parentPin=/^\d{4}$/.test(raw.parentPin)?raw.parentPin:'1234';
 state.knownGameIds=GAME_IDS.slice();
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
