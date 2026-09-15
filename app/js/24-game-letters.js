/* Letter Sounds!: flashcard phonics matching against real animal photos. */
var LETTER_CONFUSIONS={B:'DP',D:'BP',P:'BD',M:'N',N:'M',V:'W',W:'V',I:'JL',J:'IL',L:'IJ',C:'GK',G:'CK',K:'CG',F:'V',T:'D'};
function firstLetter(name){return name.charAt(0).toUpperCase();}
function letterPool(){
 var seen={},out=[];
 letterAnimals.forEach(function(a){var l=firstLetter(a.name);if(!seen[l]){seen[l]=true;out.push(l);}});
 return out;
}
function letterChoiceCount(diff){return diff==='hard'?6:diff==='medium'?4:3;}
function buildLetterChoices(correct,diff){
 var pool=letterPool().filter(function(l){return l!==correct;});
 var count=Math.min(letterChoiceCount(diff)-1,pool.length);
 var picks=[];
 if(diff==='hard'&&LETTER_CONFUSIONS[correct]){
  LETTER_CONFUSIONS[correct].split('').forEach(function(l){if(pool.indexOf(l)>=0&&picks.indexOf(l)<0)picks.push(l);});
 }
 var shuffled=pool.slice();
 for(var i=shuffled.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=shuffled[i];shuffled[i]=shuffled[j];shuffled[j]=t;}
 shuffled.forEach(function(l){if(picks.length<count&&picks.indexOf(l)<0)picks.push(l);});
 picks=picks.slice(0,count);
 picks.push(correct);
 for(var k=picks.length-1;k>0;k--){var m=Math.floor(Math.random()*(k+1)),tt=picks[k];picks[k]=picks[m];picks[m]=tt;}
 return picks;
}
function newLetterRound(g){
 var queue=letterAnimals.slice();
 for(var i=queue.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=queue[i];queue[i]=queue[j];queue[j]=t;}
 g.letters={queue:queue,current:null,choices:[],celebrating:false,total:queue.length,done:0};
 nextLetterCard(g);
}
function nextLetterCard(g){
 var lt=g.letters;
 lt.current=lt.queue.shift();
 lt.choices=buildLetterChoices(firstLetter(lt.current.name),g.diff);
 g.fact=lt.current.name;
 speakText(lt.current.name);
}
function letterView(g){
 var lt=g.letters;
 if(lt.celebrating)return '<div class="letters-wrap"><div class="maze-celebrate">'+confettiHtml()+'<div class="banner"><h3>All matched!</h3><p>A fresh set of animals is on its way.</p></div></div><div class="letters-stage"></div></div>';
 var a=lt.current;
 var choices=lt.choices.map(function(l){return '<button class="letter-choice" data-action="letter-pick" data-letter="'+l+'">'+l+'</button>';}).join('');
 return '<div class="letters-wrap"><div class="letters-outer"><div class="letters-card" style="padding-top:'+(a.pt||75)+'%"><img class="letters-photo" src="'+a.photo+'" alt="An animal to name"><button class="icon-button letters-hear" data-action="speak-fact" aria-label="Hear its name">'+icon('sound')+'</button></div></div><span class="quiet">'+lt.done+' of '+lt.total+' matched</span><p class="hint">Tap the letter it starts with!</p><div class="letter-choices">'+choices+'</div><p class="hint letters-credit">'+esc(a.credit)+'</p></div>';
}
function letterPick(letter){
 if(!game||game.paused||game.ended||game.type!=='letters'||game.letters.celebrating)return;
 var g=game,lt=g.letters,current=lt.current,correct=firstLetter(current.name);
 if(letter!==correct){
  tone('nope');
  var btn=document.querySelector('[data-action=letter-pick][data-letter="'+letter+'"]');
  if(btn){btn.classList.add('nope');setTimeout(function(){btn.classList.remove('nope');},420);}
  return;
 }
 g.score++;lt.done++;tone('snip');
 toast(current.name+' starts with '+correct+'!');
 var scoreEl=$('#score');if(scoreEl)scoreEl.textContent=g.score;
 if(!lt.queue.length){
  lt.celebrating=true;g.fact='';fanfare();renderGame();
  setTimeout(function(){if(!game||game!==g||game.ended)return;newLetterRound(g);renderGame();},1500);
  return;
 }
 nextLetterCard(g);
 renderGame();
}
