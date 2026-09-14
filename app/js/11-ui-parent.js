/* Parent area: PIN gate, per-child game/difficulty controls, and schoolwork assignment. */
function profiles(){if(game)pauseGame();dialog('<button class="icon-button dialog-close" data-action="close-modal" aria-label="Close">'+icon('close')+'</button><h2>Who’s playing?</h2><p>A little world for everyone.</p><div class="profile-list">'+state.profiles.map(function(p){return '<button class="profile-select '+(p.id===state.active?'active':'')+'" data-action="select-profile" data-id="'+esc(p.id)+'">'+mascot(p.mascot,p.colors)+esc(p.name)+'</button>';}).join('')+'</div><button class="big-button wide" data-action="add-profile" '+(state.profiles.length>=24?'disabled':'')+'>+ Add a player</button>','Choose a player');}
function addProfile(){dialog('<button class="icon-button dialog-close" data-action="profiles" aria-label="Back">'+icon('back')+'</button><h2>A new little explorer</h2><p>What should we call your playroom?</p><form id="add-form"><label class="field"><span class="field-label">Your name</span><input id="new-name" type="text" maxlength="24" required autocomplete="off"></label><button class="big-button wide" type="submit">Make my playroom '+icon('spark')+'</button><div class="error" id="name-error" role="alert"></div></form>','Add a player');$('#add-form').onsubmit=function(e){e.preventDefault();stopGame();createProfile($('#new-name').value);};}
function pinDotsHtml(){var h='';for(var i=0;i<4;i++)h+='<span class="pin-dot'+(i<pinEntry.length?' filled':'')+'"></span>';return h;}
function pinPadHtml(){var keys=['1','2','3','4','5','6','7','8','9','','0','back'];return keys.map(function(k){if(k==='')return '<span></span>';if(k==='back')return '<button class="pin-key" data-action="pin-back" aria-label="Backspace">⌫</button>';return '<button class="pin-key" data-action="pin-digit" data-value="'+k+'">'+k+'</button>';}).join('');}
function parentGate(){pinEntry='';if(game)pauseGame();dialog('<button class="icon-button dialog-close" data-action="close-modal" aria-label="Close">'+icon('close')+'</button><h2>Grown-ups only</h2><p>Enter the 4-digit parent PIN.</p><div class="pin-dots">'+pinDotsHtml()+'</div><div class="pin-pad">'+pinPadHtml()+'</div><div class="error" id="pin-error" role="alert"></div>','Parent area');}
function updatePinDialog(){
 var dotsEl=document.querySelector('.pin-dots');
 if(!dotsEl)return;
 dotsEl.innerHTML=pinDotsHtml();
 if(pinEntry.length===4){
  if(pinEntry===state.parentPin){
   pinEntry='';closeModal();managing=state.active;uiScreen='parent';render();
  } else {
   var dialogEl=document.querySelector('.dialog');
   if(dialogEl)dialogEl.classList.add('nope');
   var err=$('#pin-error');if(err)err.textContent='That\'s not it — try again.';
   setTimeout(function(){pinEntry='';if(dialogEl)dialogEl.classList.remove('nope');var d=document.querySelector('.pin-dots');if(d)d.innerHTML=pinDotsHtml();},420);
  }
 }
}
function managedProfile(){return state.profiles.filter(function(p){return p.id===managing;})[0]||current();}
function parentAssignmentList(p){
 var pending=(p.assignments||[]).filter(function(a){return a.recurring||!a.completed;});
 var done=(p.assignments||[]).filter(function(a){return a.completed&&!a.recurring;}).slice(-10).reverse();
 var html='';
 if(pending.length)html+='<p class="hint">Assigned:</p><div class="done-list">'+pending.map(function(a){var g=catalogEntry(a.gameId);var played=a.timesPlayed?' · played '+a.timesPlayed+'x, best '+a.score:'';return '<div class="done-row"><span>'+(g?g.title:a.gameId)+(a.recurring?' <span class="quiet">(ongoing)</span>':'')+'</span><span class="quiet">assigned '+new Date(a.assignedAt).toLocaleDateString()+played+'</span><button class="icon-button" data-action="remove-assignment" data-id="'+a.id+'" aria-label="Remove assignment">'+icon('close')+'</button></div>';}).join('')+'</div>';
 if(done.length)html+='<p class="hint">Completed:</p><div class="done-list">'+done.map(function(a){var g=catalogEntry(a.gameId);return '<div class="done-row"><span>'+(g?g.title:a.gameId)+'</span><span class="quiet">'+new Date(a.completedAt).toLocaleDateString()+' · score '+a.score+'</span><span class="points-chip">+'+(10+a.score)+'</span></div>';}).join('')+'</div>';
 if(!pending.length&&!done.length)html='<p class="hint">No schoolwork assigned yet.</p>';
 return html;
}
function parentArea(){
 var mp=managedProfile();
 shell(pageHead('Parent area','Choose games, difficulty, and schoolwork for each player.')+'<main class="settings-grid"><section class="panel">'
  +'<h2>Managing</h2><div class="choice-row">'+state.profiles.map(function(p){return '<button class="pill'+(p.id===mp.id?' selected':'')+'" data-action="manage-profile" data-id="'+esc(p.id)+'">'+esc(p.name)+'</button>';}).join('')+'</div>'
  +'<div class="divider"></div><h2>Games shown to '+esc(mp.name)+'</h2><div class="choice-row">'+GAME_CATALOG.map(function(g){var on=mp.enabledGames.indexOf(g.id)>=0;return '<button class="pill toggle-pill'+(on?' on':'')+'" data-action="toggle-game" data-id="'+g.id+'">'+(on?icon('check'):'')+g.title+'</button>';}).join('')+'</div>'
  +'<div class="divider"></div><h2>Difficulty levels shown</h2><div class="choice-row">'+DIFF_LEVELS.map(function(d){var on=mp.enabledDifficulties.indexOf(d)>=0;return '<button class="pill toggle-pill'+(on?' on':'')+'" data-action="toggle-diff" data-id="'+d+'">'+(on?icon('check'):'')+diffLabels[d]+'</button>';}).join('')+'</div>'
  +'<p class="hint">Turn options off to simplify the menu for '+esc(mp.name)+'. At least one of each must stay on.</p>'
  +'</section><section class="panel">'
  +'<h2>Assign schoolwork</h2><label class="field"><span class="field-label">Pick a game to assign '+esc(mp.name)+'</span><select id="assign-game">'+GAME_CATALOG.map(function(g){return '<option value="'+g.id+'">'+g.title+'</option>';}).join('')+'</select></label><label class="setting-row"><span id="label-assign-recurring">Keep it assigned until I remove it<small>Otherwise it moves to their finished list after one play.</small></span><button class="switch" role="switch" id="assign-recurring" aria-labelledby="label-assign-recurring" aria-checked="true" data-action="toggle-assign-recurring"></button></label><button class="big-button" data-action="assign-game">'+icon('spark')+'Assign it</button>'
  +'<div class="divider"></div><h2>'+esc(mp.name)+'’s schoolwork</h2>'+parentAssignmentList(mp)
  +'<div class="divider"></div><h2>Change parent PIN</h2><label class="field"><span class="field-label">New 4-digit PIN</span><input type="text" id="new-pin-1" maxlength="4" inputmode="numeric" placeholder="1234" autocomplete="off"></label><label class="field"><span class="field-label">Confirm new PIN</span><input type="text" id="new-pin-2" maxlength="4" inputmode="numeric" placeholder="1234" autocomplete="off"></label><button class="pill" data-action="save-pin">Save PIN</button><div class="error" id="pin-save-error"></div>'
  +'</section></main>');
}
