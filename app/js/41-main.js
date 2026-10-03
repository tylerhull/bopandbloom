/* Bootstraps rendering and wires up all pointer/keyboard/lifecycle events. Loaded last. */
function render(){theme(current());audioSync();if(!current()){welcome();return;}if(uiScreen==='home')home();else if(uiScreen==='workshop')workshop();else if(uiScreen==='settings')settings();else if(uiScreen==='parent')parentArea();else if(uiScreen==='reports')reportsView();else if(uiScreen==='game')renderGame();}
function pressTarget(e){var t=e.target.closest('[data-action="hit"]');if(t){e.preventDefault();unlockAudio();hit(Number(t.getAttribute('data-index')));}}
if(window.PointerEvent){root.addEventListener('pointerdown',pressTarget);}else{root.addEventListener('mousedown',pressTarget);root.addEventListener('touchstart',pressTarget,{passive:false});}
document.addEventListener('click',function(e){var b=e.target.closest('[data-action]');if(!b)return;unlockAudio();var a=b.getAttribute('data-action'),v=b.getAttribute('data-value');
 if(a==='hit'){if(e.detail===0)hit(Number(b.getAttribute('data-index')));return;}
 if(a==='home'){stopGame();draft=null;closeModal();uiScreen='home';render();}
 else if(a==='start')startGame(b.getAttribute('data-game'),b.getAttribute('data-assignment'));
 else if(a==='home-tab'){homeTab=v;render();}
 else if(a==='settings'){pauseGame();draft=null;closeModal();uiScreen='settings';render();}
 else if(a==='back-game'){uiScreen='game';render();}
 else if(a==='workshop'){draft=copy(current());uiScreen='workshop';render();}
 else if(a==='mute'){state.settings.muted=!state.settings.muted;save();audioSync();b.innerHTML=icon(state.settings.muted?'mute':'sound');b.setAttribute('aria-label',state.settings.muted?'Turn sound on':'Mute all sound');b.setAttribute('aria-pressed',state.settings.muted);if(uiScreen==='settings')settings();}
 else if(a==='profiles')profiles();
 else if(a==='parent-gate')parentGate();
 else if(a==='pin-digit'){if(pinEntry.length<4)pinEntry+=v;updatePinDialog();}
 else if(a==='pin-back'){pinEntry=pinEntry.slice(0,-1);updatePinDialog();}
 else if(a==='manage-profile'){managing=b.getAttribute('data-id');render();}
 else if(a==='toggle-game'){var mp=managedProfile(),gid=b.getAttribute('data-id'),gi=mp.enabledGames.indexOf(gid);if(gi>=0){if(mp.enabledGames.length>1)mp.enabledGames.splice(gi,1);}else mp.enabledGames.push(gid);save();render();}
 else if(a==='toggle-diff'){var mp2=managedProfile(),did=b.getAttribute('data-id'),di=mp2.enabledDifficulties.indexOf(did);if(di>=0){if(mp2.enabledDifficulties.length>1)mp2.enabledDifficulties.splice(di,1);}else mp2.enabledDifficulties.push(did);save();render();}
 else if(a==='toggle-pack'){var mpk=managedProfile(),pid=b.getAttribute('data-id'),list=(mpk.enabledPacks&&mpk.enabledPacks.length)?mpk.enabledPacks.slice():allPackIds(),pi=list.indexOf(pid);if(pi>=0){if(list.length>1)list.splice(pi,1);}else list.push(pid);mpk.enabledPacks=list;save();render();}
 else if(a==='import-pack'){if(window.bopPacks&&window.bopPacks.available){window.bopPacks.importPack().then(function(res){if(res&&res.ok&&res.pack){if(registerImportedPacks([res.pack]))toast('Added pack: '+res.pack.name);else toast('That pack had no usable cards.');}else if(res&&res.error)toast(res.error);render();}).catch(function(){toast('Could not add that pack.');});}}
 else if(a==='remove-pack'){var rid=b.getAttribute('data-id');var go=function(){for(var i=PACKS.length-1;i>=0;i--){if(PACKS[i].id===rid&&PACKS[i].imported)PACKS.splice(i,1);}render();};if(window.bopPacks&&window.bopPacks.available)window.bopPacks.removePack(rid).then(go).catch(go);else go();}
 else if(a==='open-reports'){uiScreen='reports';render();}
 else if(a==='open-parent'){uiScreen='parent';render();}
 else if(a==='report-child'){managing=b.getAttribute('data-id');render();}
 else if(a==='report-range'){reportRange=v;render();}
 else if(a==='report-subject'){reportSubject=v;render();}
 else if(a==='report-save-csv'){saveReportCsv();}
 else if(a==='report-print'){window.print();}
 else if(a==='records-folder'){setupRecordsFolder();}
 else if(a==='assign-game'){var mp3=managedProfile(),sel=$('#assign-game'),recurEl=$('#assign-recurring');mp3.assignments=mp3.assignments||[];mp3.assignments.push({id:id(),gameId:sel.value,assignedAt:Date.now(),recurring:!recurEl||recurEl.getAttribute('aria-checked')==='true',completed:false,completedAt:null,score:0,timesPlayed:0});save();render();toast('Assigned to '+esc(mp3.name)+'!');}
 else if(a==='toggle-assign-recurring'){var checked=b.getAttribute('aria-checked')==='true';b.setAttribute('aria-checked',!checked);}
 else if(a==='remove-assignment'){var mp4=managedProfile(),aid=b.getAttribute('data-id');mp4.assignments=(mp4.assignments||[]).filter(function(x){return x.id!==aid;});save();render();}
 else if(a==='save-pin'){var v1=$('#new-pin-1').value,v2=$('#new-pin-2').value;if(!/^\d{4}$/.test(v1)){$('#pin-save-error').textContent='PIN must be 4 digits.';return;}if(v1!==v2){$('#pin-save-error').textContent='PINs don’t match.';return;}state.parentPin=v1;save();toast('Parent PIN updated.');render();}
 else if(a==='close-modal')closeModal();
 else if(a==='add-profile')addProfile();
 else if(a==='select-profile'){stopGame();state.active=b.getAttribute('data-id');save();draft=null;closeModal();uiScreen='home';render();}
 else if(a==='shuffle'){var options=palettes.filter(function(p){return p.primary!==draft.colors.primary;});draft.colors=copy(options[Math.floor(Math.random()*options.length)]);draft.mascot=mascots[(mascots.indexOf(draft.mascot)+1+Math.floor(Math.random()*(mascots.length-1)))%mascots.length];draft.style=styles[(styles.indexOf(draft.style)+1+Math.floor(Math.random()*(styles.length-1)))%styles.length];draft.pattern=patterns[(patterns.indexOf(draft.pattern)+1+Math.floor(Math.random()*(patterns.length-1)))%patterns.length];workshop();tone('hello');}
 else if(a==='apply-palette'){draft.colors=copy(palettes[Number(b.getAttribute('data-index'))]);workshop();}
 else if(a==='mascot'){draft.mascot=v;workshop();}
 else if(a==='lettering'){draft.style=v;workshop();}
 else if(a==='pattern'){draft.pattern=v;workshop();}
 else if(a==='save-style'){if(!draft.name.trim()){toast('Your playroom needs a name.');$('#edit-name').focus();return;}draft.name=draft.name.trim();var p=current();p.name=draft.name;p.colors=copy(draft.colors);p.style=draft.style;p.mascot=draft.mascot;p.pattern=draft.pattern;save();draft=null;uiScreen='home';render();toast('Your playroom, your style. Saved!');}
 else if(a==='toggle'){state.settings[v]=!state.settings[v];save();render();}
 else if(a==='test-sound'){tone('hello');}
 else if(a==='pause')pauseGame();
 else if(a==='resume')resumeGame();
 else if(a==='finish')finishGame();
 else if(a==='maze-cell'){mazeClick(Number(b.getAttribute('data-x')),Number(b.getAttribute('data-y')));}
 else if(a==='sa-select'){
  var cid=b.getAttribute('data-country');
  if(game.puzzle.selected===cid){game.puzzle.selected=null;game.puzzle.fact='';game.fact='';}
  else{game.puzzle.selected=cid;var facts=saFacts[cid]||[];game.puzzle.fact=facts.length?facts[Math.floor(Math.random()*facts.length)]:'';game.fact=game.puzzle.fact;if(game.fact)speakText(game.fact);}
  renderGame();
 }
 else if(a==='sa-cell'){saClickCell(b.getAttribute('data-country'));}
 else if(a==='herd-cow'){herdClickCow(Number(b.getAttribute('data-id')));}
 else if(a==='climb-step'){climbStep(Number(b.getAttribute('data-idx')));}
 else if(a==='next-peak'){newClimbRound(game);renderGame();}
 else if(a==='maze-new'){newMazeRound(game);renderGame();}
 else if(a==='maze-retry'){game.trail=[{x:0,y:0}];game.celebrating=false;renderGame();}
 else if(a==='speak-fact'){if(game&&game.fact)speakText(game.fact);}
 else if(a==='biome-select'){
  var bid=b.getAttribute('data-biome');
  if(game.biome.selected===bid){game.biome.selected=null;game.fact='';}
  else{game.biome.selected=bid;var sb=biomeById(bid);game.fact=sb?sb.name+'. '+sb.fact:'';if(game.fact)speakText(game.fact);}
  renderGame();
 }
 else if(a==='biome-spot'){biomeClickSpot(b.getAttribute('data-biome'));}
 else if(a==='sort-bin'){sortPick(b.getAttribute('data-habitat'));}
 else if(a==='market-coin'){marketCoin(Number(b.getAttribute('data-value')));}
 else if(a==='market-reset'){game.market.paid=0;renderGame();}
 else if(a==='timeline-pick'){timelinePick(Number(b.getAttribute('data-idx')));}
 else if(a==='letter-pick'){letterPick(b.getAttribute('data-letter'));}
 else if(a==='trace-set'){traceSet(b.getAttribute('data-set'));}
 else if(a==='trace-clear'){traceClear();}
 else if(a==='trace-next'){traceNext();}
 else if(a==='flag-pick'){flagPick(b.getAttribute('data-country'));}
 else if(a==='mem-flip'){memoryFlip(Number(b.getAttribute('data-index')));}
 else if(a==='shape-bin'){shapePick(b.getAttribute('data-bin'));}
 else if(a==='pattern-pick'){patternPick(Number(b.getAttribute('data-index')));}
 else if(a==='flash-next'){flashNext();}
 else if(a==='build-tap'){buildTap(Number(b.getAttribute('data-id')));}
 else if(a==='count-pick'){countPick(Number(b.getAttribute('data-n')));}
 else if(a==='add-pick'){addPick(Number(b.getAttribute('data-n')));}
 else if(a==='more-pick'){morePick(b.getAttribute('data-side'));}
 else if(a==='order-pick'){orderPick(Number(b.getAttribute('data-n')));}
 else if(a==='begin-pick'){beginPick(b.getAttribute('data-id'));}
 else if(a==='sound-letter'){soundLetter(Number(b.getAttribute('data-i')));}
 else if(a==='sound-say'){soundSay();}
 else if(a==='sound-next'){soundNext();}
 else if(a==='rhyme-pick'){rhymePick(b.getAttribute('data-w'));}
 else if(a==='sight-pick'){sightPick(b.getAttribute('data-w'));}
 else if(a==='set-difficulty'){var p=current();p.difficulty[game.type]=v;save();startGame(game.type,game.assignmentId);}
});
document.addEventListener('keydown',function(e){
 if(modalRoot.firstChild){if(e.key==='Tab'){var els=modalRoot.querySelectorAll('button:not([disabled]),input,select');var first=els[0],last=els[els.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}if(e.key==='Escape'&&!(game&&game.ended)){closeModal();}return;}
 if(/INPUT|SELECT|TEXTAREA/.test(e.target.tagName))return;
 if(game&&uiScreen==='game'){
  if(e.key==='Escape'||e.key===' '){e.preventDefault();game.paused?resumeGame():pauseGame();return;}
  var k=e.key.toLowerCase();
  if(game.type==='scurry'){if(!e.repeat&&mazeKeyDirs.hasOwnProperty(k)){e.preventDefault();unlockAudio();mazeDirectionMove(k);}return;}
  if(['countries','gauchos','peaks','biomes','animals','market','timeline','letters','trace','flags','memory','shapes','patterns','flash','build','count','add','more','order','begin','sound','rhyme','sight'].indexOf(game.type)>=0)return;
  var idx='qweasdzxc'.indexOf(k);
  if(/^[1-9]$/.test(k))idx=Number(k)-1;
  if(idx>=0&&!e.repeat){e.preventDefault();unlockAudio();hit(idx);}
 }
});
document.addEventListener('error',function(e){var t=e.target;if(t&&t.tagName==='IMG'&&(t.classList.contains('climb-photo')||t.classList.contains('summit-photo')||t.classList.contains('letters-photo')||t.classList.contains('mem-photo')||t.classList.contains('flash-media')||t.classList.contains('build-media')||t.classList.contains('begin-media')))t.classList.add('img-fallback');},true);
document.addEventListener('visibilitychange',function(){if(document.hidden)pauseGame();audioSync();});
window.addEventListener('blur',function(){pauseGame();});
window.addEventListener('beforeunload',save);
render();
// Load any user-imported content packs (Electron only) and refresh the view.
if(window.bopPacks&&window.bopPacks.available){
 window.bopPacks.list().then(function(list){
  if(registerImportedPacks(list)&&(uiScreen==='home'||uiScreen==='parent'))render();
 }).catch(function(){});
}
