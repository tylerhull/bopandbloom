/* Parent progress reports: interactive in-app charts from each child's
   activityLog (05-state.js), a subject filter, save-to-file (Electron
   bopRecords bridge or browser download), and print / save-as-PDF. All local. */
var reportRange='30';     // '7' | '30' | '90' | '180' | 'year'
var reportSubject='all';  // 'all' or a GAME_GROUPS id
var LINE_COLORS=['#5755c9','#e0732f','#2f8f6b','#c0497e','#3d7ea6','#b58a2e','#7b5bb0','#4a9c52'];

function gameArea(id){for(var i=0;i<GAME_GROUPS.length;i++)if(GAME_GROUPS[i].ids.indexOf(id)>=0)return GAME_GROUPS[i].title;return 'Other';}
function schoolYearStart(){var now=new Date(),y=now.getFullYear(),start=new Date(y,7,1);if(now<start)start=new Date(y-1,7,1);start.setHours(0,0,0,0);return start;}
function rangeStart(){
 if(reportRange==='year')return schoolYearStart();
 var n=reportRange==='7'?7:reportRange==='90'?90:reportRange==='180'?180:30;
 var s=new Date();s.setHours(0,0,0,0);s.setDate(s.getDate()-(n-1));return s;
}
function rangeLabel(){
 return reportRange==='7'?'last 7 days':reportRange==='90'?'last 90 days':reportRange==='180'?'last 180 days':reportRange==='year'?'this school year':'last 30 days';
}
function entriesInRange(p){var cut=rangeStart().getTime();return (p.activityLog||[]).filter(function(e){return e.t>=cut;});}
function filterSubject(entries){
 if(reportSubject==='all')return entries;
 var grp=null;GAME_GROUPS.forEach(function(g){if(g.id===reportSubject)grp=g;});
 if(!grp)return entries;
 return entries.filter(function(e){return grp.ids.indexOf(e.game)>=0;});
}

/* Adaptive time buckets: daily for short ranges, weekly then monthly for long. */
function reportBuckets(entries){
 var start=rangeStart(),end=new Date();end.setHours(23,59,59,999);
 var spanDays=Math.round((end-start)/86400000)+1;
 var gran=spanDays<=45?'day':spanDays<=140?'week':'month',buckets=[];
 if(gran==='month'){
  var d=new Date(start.getFullYear(),start.getMonth(),1);
  while(d<=end){var next=new Date(d.getFullYear(),d.getMonth()+1,1);buckets.push({t0:d.getTime(),t1:next.getTime(),label:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.getMonth()],sessions:0,secs:0});d=next;}
 } else {
  var stepDays=gran==='week'?7:1,cur=new Date(start);
  while(cur<=end){var n2=new Date(cur);n2.setDate(cur.getDate()+stepDays);buckets.push({t0:cur.getTime(),t1:n2.getTime(),label:(cur.getMonth()+1)+'/'+cur.getDate(),wd:cur.getDay(),sessions:0,secs:0});cur=n2;}
 }
 entries.forEach(function(e){for(var i=0;i<buckets.length;i++){if(e.t>=buckets[i].t0&&e.t<buckets[i].t1){buckets[i].sessions++;buckets[i].secs+=e.secs;break;}}});
 return {gran:gran,buckets:buckets};
}
function barChartBuckets(bk){
 var buckets=bk.buckets,max=buckets.reduce(function(m,b){return Math.max(m,b.sessions);},0)||1;
 var n=buckets.length,step=Math.max(10,Math.floor(560/Math.max(1,n))),W=Math.max(n*step,120),base=140,top=16,every=Math.ceil(n/8);
 var bars=buckets.map(function(b,i){
  var h=b.sessions?Math.max(3,Math.round((base-top)*b.sessions/max)):0,x=i*step,bw=Math.max(6,step-4);
  var lbl=(bk.gran==='day'&&n<=7)?['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][b.wd]:((n<=10||i%every===0)?b.label:'');
  return '<g class="rbar"><rect x="'+x+'" y="'+(base-h)+'" width="'+bw+'" height="'+h+'" rx="3"><title>'+esc(b.label)+': '+b.sessions+' session'+(b.sessions===1?'':'s')+'</title></rect>'+(lbl?'<text class="rx" x="'+(x+bw/2)+'" y="'+(base+15)+'">'+esc(lbl)+'</text>':'')+'<text class="rval" x="'+(x+bw/2)+'" y="'+(base-h-4)+'">'+(b.sessions||'')+'</text></g>';
 }).join('');
 return '<svg class="rchart" viewBox="0 0 '+W+' 162" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Sessions per '+bk.gran+'"><line class="raxis" x1="0" y1="'+base+'" x2="'+W+'" y2="'+base+'"/>'+bars+'</svg>';
}
function reportByArea(entries){
 var areas={};entries.forEach(function(e){var a=gameArea(e.game);areas[a]=(areas[a]||0)+e.secs;});
 var rows=Object.keys(areas).map(function(a){return {area:a,mins:Math.round(areas[a]/60)};}).sort(function(x,y){return y.mins-x.mins;});
 if(!rows.length)return '<p class="hint">No activity yet in this range.</p>';
 var max=rows.reduce(function(m,r){return Math.max(m,r.mins);},0)||1;
 return '<div class="rbars">'+rows.map(function(r){return '<div class="rbar-h"><span class="rbar-label">'+esc(r.area)+'</span><div class="rbar-track"><div class="rbar-fill" style="width:'+Math.max(4,Math.round(100*r.mins/max))+'%"></div></div><span class="rbar-num">'+r.mins+'m</span></div>';}).join('')+'</div>';
}
/* One line per game: score over time, so a parent can see improvement. */
function scoreLineChart(entries){
 var byGame={};entries.forEach(function(e){if(e.game)(byGame[e.game]=byGame[e.game]||[]).push(e);});
 var games=Object.keys(byGame).sort(function(a,b){return byGame[b].length-byGame[a].length;}).slice(0,8);
 if(!games.length)return '<p class="hint">No scores recorded in this range yet.</p>';
 var start=rangeStart().getTime(),end=Date.now(),span=Math.max(1,end-start);
 var maxScore=1;games.forEach(function(g){byGame[g].forEach(function(e){if(e.score>maxScore)maxScore=e.score;});});
 var W=640,H=200,padL=30,padB=16,padT=10,plotW=W-padL-10,plotH=H-padB-padT;
 function X(t){return padL+plotW*Math.min(1,Math.max(0,(t-start)/span));}
 function Y(s){return padT+plotH*(1-s/maxScore);}
 var series=games.map(function(g,gi){
  var pts=byGame[g].slice().sort(function(a,b){return a.t-b.t;}),color=LINE_COLORS[gi%LINE_COLORS.length];
  var d=pts.map(function(e,i){return (i?'L':'M')+X(e.t).toFixed(1)+' '+Y(e.score).toFixed(1);}).join(' ');
  var dots=pts.map(function(e){return '<circle cx="'+X(e.t).toFixed(1)+'" cy="'+Y(e.score).toFixed(1)+'" r="3.2" fill="'+color+'"><title>'+esc(gameNames[g]||g)+': '+e.score+' · '+new Date(e.t).toLocaleDateString()+'</title></circle>';}).join('');
  return (pts.length>1?'<path d="'+d+'" fill="none" stroke="'+color+'" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>':'')+dots;
 }).join('');
 var axis='<line class="raxis" x1="'+padL+'" y1="'+(padT+plotH)+'" x2="'+W+'" y2="'+(padT+plotH)+'"/><text class="rx" x="'+(padL-6)+'" y="'+(padT+5)+'" text-anchor="end">'+maxScore+'</text><text class="rx" x="'+(padL-6)+'" y="'+(padT+plotH)+'" text-anchor="end">0</text>';
 var legend='<div class="rlegend">'+games.map(function(g,gi){return '<span class="rleg"><span class="rdot" style="background:'+LINE_COLORS[gi%LINE_COLORS.length]+'"></span>'+esc(gameNames[g]||g)+'</span>';}).join('')+'</div>';
 return '<svg class="rchart" viewBox="0 0 '+W+' '+H+'" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Score over time, one line per game">'+axis+series+'</svg>'+legend;
}
function reportRecentList(entries){
 if(!entries.length)return '<p class="hint">No sessions recorded yet in this range.</p>';
 return '<div class="done-list">'+entries.slice(-14).reverse().map(function(e){var d=new Date(e.t);return '<div class="done-row"><span>'+esc(gameNames[e.game]||e.game||'Game')+'</span><span class="quiet">'+d.toLocaleDateString()+'</span><span class="points-chip">'+Math.max(1,Math.round(e.secs/60))+'m</span></div>';}).join('')+'</div>';
}
function reportsView(){
 var p=managedProfile(),all=entriesInRange(p),entries=filterSubject(all);
 var bk=reportBuckets(entries);
 var mins=Math.round(entries.reduce(function(s,e){return s+e.secs;},0)/60);
 var activeDays={};entries.forEach(function(e){activeDays[new Date(e.t).toDateString()]=1;});
 var rl=rangeLabel(),granWord=bk.gran==='day'?'day':bk.gran==='week'?'week':'month';
 var ranges=[['7','7 days'],['30','30 days'],['90','90 days'],['180','180 days'],['year','School year']];
 var subjects=[['all','All subjects']].concat(GAME_GROUPS.map(function(g){return [g.id,g.title];}));
 shell('<div class="page-head"><div><h1>'+esc(p.name)+'’s progress</h1><p>A record of play and practice, for your homeschool records.</p></div><button class="pill" data-action="open-parent">'+icon('back')+'Parent area</button></div>'
  +'<main class="reports">'
  +'<div class="choice-row">'+state.profiles.map(function(x){return '<button class="pill'+(x.id===p.id?' selected':'')+'" data-action="report-child" data-id="'+esc(x.id)+'">'+esc(x.name)+'</button>';}).join('')+'</div>'
  +'<div class="choice-row">'+ranges.map(function(r){return '<button class="pill'+(reportRange===r[0]?' selected':'')+'" data-action="report-range" data-value="'+r[0]+'">'+r[1]+'</button>';}).join('')+'</div>'
  +'<div class="choice-row">'+subjects.map(function(s){return '<button class="pill'+(reportSubject===s[0]?' selected':'')+'" data-action="report-subject" data-value="'+esc(s[0])+'">'+esc(s[1])+'</button>';}).join('')+'</div>'
  +'<section class="stat-cards"><div class="stat-card"><span class="stat-num">'+entries.length+'</span><span class="stat-lbl">sessions</span></div><div class="stat-card"><span class="stat-num">'+mins+'</span><span class="stat-lbl">minutes</span></div><div class="stat-card"><span class="stat-num">'+Object.keys(activeDays).length+'</span><span class="stat-lbl">days active</span></div><div class="stat-card"><span class="stat-num">'+(p.points||0)+'</span><span class="stat-lbl">points (all time)</span></div></section>'
  +'<section class="panel"><h2>Sessions per '+granWord+' <span class="quiet">'+rl+'</span></h2>'+barChartBuckets(bk)+'</section>'
  +'<section class="panel"><h2>Score over time <span class="quiet">one line per game</span></h2>'+scoreLineChart(entries)+'</section>'
  +'<section class="panel"><h2>Time by subject <span class="quiet">'+rl+'</span></h2>'+reportByArea(entries)+'</section>'
  +'<section class="panel"><h2>Recent sessions</h2>'+reportRecentList(entries)+'</section>'
  +'<div class="report-actions"><button class="big-button" data-action="report-save-csv">'+icon('check')+'Save records (CSV)</button><button class="pill" data-action="report-print">'+icon('spark')+'Print / Save as PDF</button></div>'
  +'<p class="hint">Records save to your computer (all subjects, '+rl+'). Tip: save into your Dropbox or Google Drive folder to keep a copy in the cloud.</p>'
  +'</main>');
}
function slugName(s){return String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');}
function reportFileName(p,ext){var d=new Date(),pad=function(n){return ('0'+n).slice(-2);};return 'bopandbloom-'+(slugName(p.name)||'child')+'-'+d.getFullYear()+pad(d.getMonth()+1)+pad(d.getDate())+'.'+ext;}
function reportCsv(p,entries){
 var rows=[['Date','Time','Game','Subject','Score','Minutes']];
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
