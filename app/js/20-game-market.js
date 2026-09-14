/* Market Day!: count coins to pay an exact price. */
function coinIcon(value){
 return '<svg viewBox="0 0 40 40" width="40" height="40" class="coin-art" aria-hidden="true"><circle cx="20" cy="20" r="17" fill="#e8c45c" stroke="#b58f2b" stroke-width="2.5"/><circle cx="20" cy="20" r="12.5" fill="none" stroke="#c9a33d" stroke-width="1.5"/><text x="20" y="26" text-anchor="middle" font-size="15" font-weight="800" fill="#6b5118">'+value+'</text></svg>';
}
function marketItemIcon(id){
 var m={
  empanada:'<path d="M10 32q0-18 20-18t20 18z" fill="#e8c184" stroke="#c49a52" stroke-width="2"/><path d="M10 32q20 8 40 0" fill="#dcae6c"/><path d="M13 30q3-3 6 0t6 0 6 0 6 0 6 0" stroke="#c49a52" stroke-width="1.6" fill="none"/>',
  banana:'<path d="M10 34q4-18 22-20-2 18-18 24z" fill="#f2d14e" stroke="#c9a52b" stroke-width="2"/><path d="M18 36q6-16 24-16-4 16-20 20z" fill="#f7dd6e" stroke="#c9a52b" stroke-width="2"/>',
  hat:'<ellipse cx="30" cy="32" rx="26" ry="8" fill="#e3c98e" stroke="#b89a58" stroke-width="2"/><path d="M16 30q2-18 14-18t14 18z" fill="#eed9a8" stroke="#b89a58" stroke-width="2"/><path d="M16 26q14 5 28 0" stroke="#b8863f" stroke-width="4" fill="none"/>',
  mate:'<path d="M18 16q12-4 24 0 3 18-12 24-15-6-12-24z" fill="#9c7a52" stroke="#6b4f33" stroke-width="2"/><path d="M20 16q10 4 20 0" stroke="#6b4f33" stroke-width="2" fill="none"/><path d="M38 14l8-10" stroke="#b8b4bd" stroke-width="3.5" stroke-linecap="round"/><ellipse cx="30" cy="17" rx="10" ry="3" fill="#6fae5c"/>',
  sweater:'<path d="M18 12h24l10 8-6 6-4-3v17H18V23l-4 3-6-6z" fill="#c96b8f" stroke="#9c4f68" stroke-width="2"/><path d="M18 26h24" stroke="#9c4f68" stroke-width="1.6"/><path d="M24 32h12M24 36h12" stroke="#e8a7bf" stroke-width="2"/>',
  coffee:'<ellipse cx="20" cy="22" rx="9" ry="6.5" fill="#6b4a2b" transform="rotate(-25 20 22)"/><path d="M14 25q6-6 12-6" stroke="#3f2a17" stroke-width="1.6" fill="none"/><ellipse cx="36" cy="30" rx="9" ry="6.5" fill="#7a5533" transform="rotate(15 36 30)"/><path d="M30 30q6-4 12-1" stroke="#3f2a17" stroke-width="1.6" fill="none"/>',
  guitar:'<ellipse cx="26" cy="30" rx="15" ry="13" fill="#c98f5a" stroke="#8a5f33" stroke-width="2"/><ellipse cx="26" cy="30" rx="5" ry="4.5" fill="#5a3a1c"/><path d="M38 24l14-14" stroke="#8a5f33" stroke-width="5" stroke-linecap="round"/><path d="M50 12l4-4" stroke="#5a3a1c" stroke-width="6" stroke-linecap="round"/>',
  flower:'<g transform="translate(-32 -46.2) scale(0.62)">'+flowerHead('daisy',{key:'blush',petal:'#e78aa0',center:'#f6dd86'},110)+'</g>'
 };
 return '<svg viewBox="0 0 60 44" width="60" height="44" class="market-item-art" aria-hidden="true">'+(m[id]||'')+'</svg>';
}
function newMarketRound(g){
 var c=marketCountries[Math.floor(Math.random()*marketCountries.length)];
 var item=marketItems[Math.floor(Math.random()*marketItems.length)];
 var price,coins;
 if(g.diff==='hard'){price=4+Math.floor(Math.random()*17);coins=[1,2,5];}
 else if(g.diff==='medium'){price=2+Math.floor(Math.random()*9);coins=[1,2];}
 else{price=1+Math.floor(Math.random()*5);coins=[1];}
 g.market={country:c.country,currency:c.currency,item:item,price:price,paid:0,coins:coins,celebrating:false};
}
function marketView(g){
 var m=g.market;
 if(m.celebrating)return '<div class="market-wrap"><div class="maze-celebrate">'+confettiHtml()+'<div class="banner"><h3>¡Gracias!</h3><p>You bought '+esc(m.item.name)+'.</p></div></div><div class="market-stall"></div></div>';
 var coins=m.coins.map(function(v){return '<button class="coin-btn" data-action="market-coin" data-value="'+v+'" aria-label="Pay '+v+'">'+coinIcon(v)+'</button>';}).join('');
 var pct=Math.min(100,Math.round(m.paid/m.price*100));
 return '<div class="market-wrap"><div class="market-stall">'+marketItemIcon(m.item.id)+'<strong>'+esc(m.item.name)+'</strong><p class="quiet">at a market in '+esc(m.country)+'</p><div class="market-price">'+m.price+' '+esc(m.currency)+'</div></div>'
  +'<div class="purse"><div class="purse-label">Paid so far</div><div class="purse-total">'+m.paid+' / '+m.price+'</div><div class="purse-bar"><span style="width:'+pct+'%"></span></div></div>'
  +'<div class="coin-row">'+coins+'</div>'
  +'<button class="pill" data-action="market-reset">'+icon('retry')+'Start the coins over</button></div>';
}
function marketCoin(v){
 if(!game||game.paused||game.ended||game.type!=='market'||game.market.celebrating)return;
 var g=game,m=g.market;
 m.paid+=v;
 if(m.paid===m.price){
  g.score++;m.celebrating=true;fanfare();
  var scoreEl=$('#score');if(scoreEl)scoreEl.textContent=g.score;
  renderGame();
  setTimeout(function(){if(!game||game!==g||game.ended)return;newMarketRound(g);renderGame();},1400);
  return;
 }
 if(m.paid>m.price){
  tone('nope');toast('That\'s a little too much — let\'s count again!');
  m.paid=0;renderGame();return;
 }
 tone('bop');renderGame();
}
