/* Flag Match!: hear/read a country's name, tap its flag from a set of choices.
   Reuses countryFlag() (02-data-map.js) and the saCountries name list. Follows
   the fact-audio convention (auto-plays the country name, speaker to replay). */
function flagCountries(){return saCountries.filter(function(c){return c.name;}).map(function(c){return {id:c.id,name:c.name};});}
function flagChoiceCount(diff){return diff==='hard'?6:diff==='medium'?4:3;}
function buildFlagChoices(correctId,diff){
 var pool=flagCountries().filter(function(c){return c.id!==correctId;});
 for(var i=pool.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=pool[i];pool[i]=pool[j];pool[j]=t;}
 var picks=pool.slice(0,Math.min(flagChoiceCount(diff)-1,pool.length)).map(function(c){return c.id;});
 picks.push(correctId);
 for(var k=picks.length-1;k>0;k--){var m=Math.floor(Math.random()*(k+1)),tt=picks[k];picks[k]=picks[m];picks[m]=tt;}
 return picks;
}
function newFlagRound(g){
 var queue=flagCountries();
 for(var i=queue.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=queue[i];queue[i]=queue[j];queue[j]=t;}
 g.flags={queue:queue,current:null,choices:[],celebrating:false,total:queue.length,done:0};
 nextFlagCard(g);
}
function nextFlagCard(g){
 var fl=g.flags;
 fl.current=fl.queue.shift();
 fl.choices=buildFlagChoices(fl.current.id,g.diff);
 g.fact=fl.current.name;
 speakText(fl.current.name);
}
function flagView(g){
 var fl=g.flags;
 if(fl.celebrating)return '<div class="flags-wrap"><div class="maze-celebrate">'+confettiHtml()+'<div class="banner"><h3>All matched!</h3><p>A fresh set of flags is on its way.</p></div></div></div>';
 var c=fl.current;
 var choices=fl.choices.map(function(cid){return '<button class="flag-choice" data-action="flag-pick" data-country="'+cid+'" aria-label="Flag choice">'+countryFlag(cid)+'</button>';}).join('');
 return '<div class="flags-wrap"><div class="flags-prompt"><strong>'+esc(c.name)+'</strong><button class="icon-button flags-hear" data-action="speak-fact" aria-label="Hear the country name">'+icon('sound')+'</button></div><span class="quiet">'+fl.done+' of '+fl.total+' matched</span><p class="hint">Tap this country’s flag!</p><div class="flag-choices">'+choices+'</div></div>';
}
function flagPick(cid){
 if(!game||game.paused||game.ended||game.type!=='flags'||game.flags.celebrating)return;
 var g=game,fl=g.flags,current=fl.current;
 if(cid!==current.id){
  tone('nope');
  var btn=document.querySelector('[data-action=flag-pick][data-country="'+cid+'"]');
  if(btn){btn.classList.add('nope');setTimeout(function(){btn.classList.remove('nope');},420);}
  return;
 }
 g.score++;fl.done++;tone('snip');
 toast('Yes! That’s '+current.name+'’s flag!');
 var scoreEl=$('#score');if(scoreEl)scoreEl.textContent=g.score;
 if(!fl.queue.length){
  fl.celebrating=true;g.fact='';fanfare();renderGame();
  setTimeout(function(){if(!game||game!==g||game.ended)return;newFlagRound(g);renderGame();},1500);
  return;
 }
 nextFlagCard(g);
 renderGame();
}
