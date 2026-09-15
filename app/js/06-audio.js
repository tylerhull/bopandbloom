/* Web Audio tones/music, unlock-on-first-tap, and speech-synthesis read-aloud. */
var audio=null,musicTimer=null,noteIndex=0;
function unlockAudio(){try{if(!audio){var C=window.AudioContext||window.webkitAudioContext;if(C)audio=new C();}if(audio&&audio.state==='suspended')audio.resume();audioSync();}catch(e){}}
function note(freq,duration,volume,type){if(!audio||audio.state!=='running'||state.settings.muted)return;var o=audio.createOscillator(),g=audio.createGain();o.type=type||'sine';o.frequency.value=freq;g.gain.setValueAtTime(0,audio.currentTime);g.gain.linearRampToValueAtTime(volume*state.settings.volume/100,audio.currentTime+.015);g.gain.exponentialRampToValueAtTime(.0001,audio.currentTime+duration);o.connect(g);g.connect(audio.destination);o.start();o.stop(audio.currentTime+duration+.03);o.onended=function(){o.disconnect();g.disconnect();};}
function tone(kind){if(!state.settings.effects)return;var v=.15*state.settings.effectsVolume/100;note(kind==='snip'?740:kind==='hello'?523:kind==='finish'?784:kind==='nope'?220:330,.17,v,'sine');if(kind==='finish'||kind==='hello')setTimeout(function(){if(state.settings.effects)note(1046,.35,v*.7);},150);}
function audioSync(){if(musicTimer){clearInterval(musicTimer);musicTimer=null;}if(!audio)return;if(state.settings.muted||document.hidden){if(audio.state==='running')audio.suspend();return;}if(audio.state==='suspended')audio.resume();if(!state.settings.music||(game&&game.paused))return;musicTimer=setInterval(function(){var melody=[523,0,659,0,784,659,587,0,523,0,440,0,392,0,587,0];var f=melody[noteIndex++%melody.length];if(f)note(f,.55,.055*state.settings.musicVolume/100);},480);}
function moo(){
 if(!state.settings.effects||!audio||audio.state!=='running'||state.settings.muted)return;
 var v=.17*state.settings.effectsVolume/100,t=audio.currentTime;
 var o=audio.createOscillator(),g=audio.createGain();
 o.type='triangle';
 o.frequency.setValueAtTime(190,t);
 o.frequency.linearRampToValueAtTime(150,t+.12);
 o.frequency.linearRampToValueAtTime(210,t+.28);
 o.frequency.linearRampToValueAtTime(130,t+.5);
 g.gain.setValueAtTime(0,t);
 g.gain.linearRampToValueAtTime(v,t+.05);
 g.gain.setValueAtTime(v,t+.32);
 g.gain.exponentialRampToValueAtTime(.0001,t+.55);
 o.connect(g);g.connect(audio.destination);
 o.start();o.stop(t+.6);
 o.onended=function(){o.disconnect();g.disconnect();};
}
function fanfare(){
 if(!state.settings.effects)return;
 var v=.18*state.settings.effectsVolume/100;
 [523,659,784,1046].forEach(function(f,i){setTimeout(function(){if(state.settings.effects)note(f,.22,v,'sawtooth');},i*110);});
}
function speakText(text){
 try{
  if(!window.speechSynthesis||!window.SpeechSynthesisUtterance||state.settings.muted||!state.settings.effects)return;
  var u=new SpeechSynthesisUtterance(text);
  u.rate=0.95;u.volume=state.settings.effectsVolume/100;
  u.onerror=function(){};
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
 }catch(e){}
}
