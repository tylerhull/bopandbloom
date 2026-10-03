/* Parent progress reports: interactive in-app charts from each child's
   activityLog (05-state.js), plus save-to-file (Electron bopRecords bridge, or a
   browser download fallback) and print / save-as-PDF. All local — no backend. */
var reportRange='30';
function reportRangeDays(){return reportRange==='7'?7:reportRange==='90'?90:30;}
function gameArea(id){for(var i=0;i<GAME_GROUPS.length;i++)if(GAME_GROUPS[i].ids.indexOf(id)>=0)return GAME_GROUPS[i].title;return 'Other';}
function dayKey(d){return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();}
function entriesInRange(p){
 var n=reportRangeDays(),start=new Date();start.setHours(0,0,0,0);start.setDate(start.getDate()-(n-1));
 var cut=start.getTime();
 return (p.activityLog||[]).filter(function(e){return e.t>=cut;});
}
function reportDayBuckets(entries,n){
 var byDay={},today=new Date();today.setHours(0,0,0,0),days=[];
 for(var i=n-1;i>=0;i--){var d=new Date(today);d.setDate(today.getDate()-i);var k=dayKey(d);byDay[k]={date:d,sessions:0,secs:0};days.push(byDay[k]);}
 entries.forEach(function(e){var k=dayKey(new Date(e.t));if(byDay[k]){byDay[k].sessions++;byDay[k].secs+=e.secs;}});
 return days;
}
function barChartDays(days){
 var max=days.reduce(function(m,d){return Math.max(m,d.sessions);},0)||1;
 var n=days.length,step=Math.max(10,Math.floor(560/n)),W=n*step,base=140,top=16;
 var every=Math.ceil(n/8);
 var bars=days.map(function(d,i){
  var h=d.sessions?Math.max(3,Math.round((base-top)*d.sessions/max)):0;
  var x=i*step,bw=Math.max(6,step-4);
  var lbl=(n<=7)?['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.date.getDay()]:((i%every===0)?(d.date.getMonth()+1)+'/'+d.date.getDate():'');
  return '<g class="rbar"><rect x="'+x+'" y="'+(base-h)+'" width="'+bw+'" height="'+h+'" rx="3"><title>'+d.date.toLocaleDateString()+': '+d.sessions+' session'+(d.sessions===1?'':'s')+'</title></rect>'
   +(lbl?'<text class="rx" x="'+(x+bw/2)+'" y="'+(base+15)+'">'+lbl+'</text>':'')
   +'<text class="rval" x="'+(x+bw/2)+'" y="'+(base-h-4)+'">'+(d.sessions||'')+'</text></g>';
 }).join('');
 return '<svg class="rchart" viewBox="0 0 '+W+' 162" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Sessions per day"><line class="raxis" x1="0" y1="'+base+'" x2="'+W+'" y2="'+base+'"/>'+bars+'</svg>';
}
function reportByArea(entries){
 var areas={};entries.forEach(function(e){var a=gameArea(e.game);areas[a]=(areas[a]||0)+e.secs;});
 var rows=Object.keys(areas).map(function(a){return {area:a,mins:Math.round(areas[a]/60)};}).sort(function(x,y){return y.mins-x.mins;});
 if(!rows.length)return '<p class="hint">No activity yet in this range.</p>';
 var max=rows.reduce(function(m,r){return Math.max(m,r.mins);},0)||1;
 return '<div class="rbars">'+rows.map(function(r){return '<div class="rbar-h"><span class="rbar-label">'+esc(r.area)+'</span><div class="rbar-track"><div class="rbar-fill" style="width:'+Math.max(4,Math.round(100*r.mins/max))+'%"></div></div><span class="rbar-num">'+r.mins+'m</span></div>';}).join('')+'</div>';
}
function reportRecentList(entries){
 if(!entries.length)return '<p class="hint">No sessions recorded yet in this range.</p>';
 return '<div class="done-list">'+entries.slice(-14).reverse().map(function(e){var d=new Date(e.t);return '<div class="done-row"><span>'+esc(gameNames[e.game]||e.game||'Game')+'</span><span class="quiet">'+d.toLocaleDateString()+'</span><span class="points-chip">'+Math.max(1,Math.round(e.secs/60))+'m</span></div>';}).join('')+'</div>';
}
function reportsView(){
 var p=managedProfile(),entries=entriesInRange(p),days=reportDayBuckets(entries,reportRangeDays());
 var mins=Math.round(entries.reduce(function(s,e){return s+e.secs;},0)/60);
 var activeDays=days.filter(function(d){return d.sessions>0;}).length;
 var rangeLabel=reportRange==='7'?'last 7 days':reportRange==='90'?'last 90 days':'last 30 days';
 shell('<div class="page-head"><div><h1>'+esc(p.name)+'’s progress</h1><p>A record of play and practice, for your homeschool records.</p></div><button class="pill" data-action="open-parent">'+icon('back')+'Parent area</button></div>'
  +'<main class="reports">'
  +'<div class="choice-row">'+state.profiles.map(function(x){return '<button class="pill'+(x.id===p.id?' selected':'')+'" data-action="report-child" data-id="'+esc(x.id)+'">'+esc(x.name)+'</button>';}).join('')+'</div>'
  +'<div class="choice-row">'+['7','30','90'].map(function(r){return '<button class="pill'+(reportRange===r?' selected':'')+'" data-action="report-range" data-value="'+r+'">'+(r==='7'?'7 days':r==='30'?'30 days':'90 days')+'</button>';}).join('')+'</div>'
  +'<section class="stat-cards"><div class="stat-card"><span class="stat-num">'+entries.length+'</span><span class="stat-lbl">sessions</span></div><div class="stat-card"><span class="stat-num">'+mins+'</span><span class="stat-lbl">minutes</span></div><div class="stat-card"><span class="stat-num">'+activeDays+'</span><span class="stat-lbl">days active</span></div><div class="stat-card"><span class="stat-num">'+(p.points||0)+'</span><span class="stat-lbl">points (all time)</span></div></section>'
  +'<section class="panel"><h2>Sessions per day <span class="quiet">'+rangeLabel+'</span></h2>'+barChartDays(days)+'</section>'
  +'<section class="panel"><h2>Time by area <span class="quiet">'+rangeLabel+'</span></h2>'+reportByArea(entries)+'</section>'
  +'<section class="panel"><h2>Recent sessions</h2>'+reportRecentList(entries)+'</section>'
  +'<div class="report-actions"><button class="big-button" data-action="report-save-csv">'+icon('check')+'Save records (CSV)</button><button class="pill" data-action="report-print">'+icon('spark')+'Print / Save as PDF</button></div>'
  +'<p class="hint">Files save to your computer. Tip: save into your Dropbox or Google Drive folder to keep a copy in the cloud.</p>'
  +'</main>');
}
function slugName(s){return String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');}
function reportFileName(p,ext){var d=new Date(),pad=function(n){return ('0'+n).slice(-2);};return 'bopandbloom-'+(slugName(p.name)||'child')+'-'+d.getFullYear()+pad(d.getMonth()+1)+pad(d.getDate())+'.'+ext;}
function reportCsv(p,entries){
 var rows=[['Date','Time','Game','Area','Score','Minutes']];
 entries.forEach(function(e){var d=new Date(e.t);rows.push([d.toLocaleDateString(),d.toLocaleTimeString(),(gameNames[e.game]||e.game||'Game'),gameArea(e.game),e.score,Math.max(1,Math.round(e.secs/60))]);});
 return rows.map(function(r){return r.map(function(c){var s=String(c);return /[",\n]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s;}).join(',');}).join('\n');
}
function saveReportCsv(){
 var p=managedProfile(),entries=entriesInRange(p),csv=reportCsv(p,entries),name=reportFileName(p,'csv');
 if(window.bopRecords&&window.bopRecords.available){
  window.bopRecords.saveFile({name:name,content:csv,type:'text/csv'}).then(function(res){if(res&&res.ok)toast('Saved to '+res.path);else if(res&&!res.canceled)toast('Could not save the file.');}).catch(function(){toast('Could not save the file.');});
 } else {
  try{var blob=new Blob([csv],{type:'text/csv'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();document.body.removeChild(a);setTimeout(function(){URL.revokeObjectURL(url);},1000);toast('Downloaded '+name);}catch(e){toast('Saving records needs the desktop app.');}
 }
}
