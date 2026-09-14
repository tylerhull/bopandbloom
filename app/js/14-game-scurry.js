/* Scurry!: procedural maze generation and play. */
function mazeHoleIcon(){return '<svg viewBox="0 0 40 40" aria-hidden="true"><ellipse cx="20" cy="26" rx="16" ry="10" fill="#4a3626"/><ellipse cx="20" cy="24" rx="12" ry="7" fill="#241a12"/></svg>';}
function mazeMouseIcon(){return '<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="12" cy="14" r="7" fill="#ad8b70"/><circle cx="28" cy="14" r="7" fill="#ad8b70"/><ellipse cx="20" cy="24" rx="13" ry="11" fill="#ad8b70"/><circle cx="16" cy="22" r="1.6" fill="#303b31"/><circle cx="24" cy="22" r="1.6" fill="#303b31"/><path d="M17 27q3 3 6 0" stroke="#303b31" stroke-width="1.2" fill="none"/></svg>';}
function mazeCheeseIcon(){return '<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M6 28L20 10l14 18z" fill="#f2c14e"/><circle cx="18" cy="24" r="1.6" fill="#c99a2e"/><circle cx="23" cy="21" r="1.3" fill="#c99a2e"/></svg>';}
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
function mazeSizeFor(diff){return diff==='hard'?7:diff==='medium'?6:5;}
function newMazeRound(g){g.maze=buildMaze(g.mazeSize||MAZE_SIZE);g.trail=[{x:0,y:0}];g.celebrating=false;g.celebrationTheme=null;}
function mazeNextCells(maze,trail){
 var head=trail[trail.length-1];
 return mazeNeighbors(maze,head.x,head.y).filter(function(n){return trailHas(trail,n.x,n.y)<0;});
}
function mazeView(g){
 var maze=g.maze,size=maze.size,trail=g.trail,head=trail[trail.length-1];
 var showHints=g.diff!=='hard';
 var next=g.celebrating?[]:mazeNextCells(maze,trail);
 var cellsHtml='';
 for(var y=0;y<size;y++){
  for(var x=0;x<size;x++){
   var c=maze.at(x,y);
   var classes=['maze-cell'];
   var isHome=(x===maze.home.x&&y===maze.home.y);
   var isHead=(x===head.x&&y===head.y);
   var trailIdx=trailHas(trail,x,y);
   var isNext=next.some(function(n){return n.x===x&&n.y===y;});
   if(isHome)classes.push('home');
   if(isHead)classes.push('head');
   if(trailIdx>=0&&!isHead)classes.push('crumb');
   if(isNext)classes.push('next');
   var clickable=!g.celebrating&&(isNext||(trailIdx>=0&&trailIdx<trail.length-1));
   var style='border-top:'+(c.n?'3px solid var(--ink)':'3px solid transparent')+';border-left:'+(c.w?'3px solid var(--ink)':'3px solid transparent')+';border-right:'+(c.e?'3px solid var(--ink)':'3px solid transparent')+';border-bottom:'+(c.s?'3px solid var(--ink)':'3px solid transparent')+';';
   var content='';
   if(isHome)content=mazeHoleIcon();else if(isHead)content=mazeMouseIcon();else if(trailIdx>=0)content=mazeCheeseIcon();else if(isNext&&showHints)content='<span class="maze-hint" aria-hidden="true"></span>';
   cellsHtml+='<button class="'+classes.join(' ')+'" style="'+style+'" '+(clickable?'data-action="maze-cell" ':'tabindex="-1" ')+'data-x="'+x+'" data-y="'+y+'" aria-label="'+(isHome?'Mouse home':clickable?'Drop cheese here':'maze wall')+'" '+(clickable?'':'aria-hidden="true"')+'>'+content+'</button>';
  }
 }
 var maxWidth=size>6?640:size>5?520:430;
 var grid='<div class="maze-grid" style="grid-template-columns:repeat('+size+',1fr);max-width:'+maxWidth+'px">'+cellsHtml+'</div>';
 var actions='<div class="maze-actions"><button class="icon-button" data-action="maze-retry"'+(g.celebrating?' disabled':'')+' aria-label="Retry this maze">'+icon('retry')+'</button><button class="pill" data-action="maze-new"'+(g.celebrating?' disabled':'')+'>'+icon('spark')+'New maze</button></div>';
 var overlay=g.celebrating?mazeCelebrationHtml(g):'';
 return '<div class="maze-wrap">'+overlay+grid+actions+'</div>';
}
function mazeClick(x,y){
 if(!game||game.paused||game.ended||game.type!=='scurry'||game.celebrating)return;
 var g=game,trail=g.trail,idx=trailHas(trail,x,y);
 if(idx>=0){
  if(idx<trail.length-1){g.trail=trail.slice(0,idx+1);tone('bop');renderGame();}
  return;
 }
 var next=mazeNextCells(g.maze,trail);
 if(!next.some(function(n){return n.x===x&&n.y===y;}))return;
 g.trail=trail.concat([{x:x,y:y}]);
 var last={x:x,y:y};
 if(last.x===g.maze.home.x&&last.y===g.maze.home.y){
  g.score++;
  g.celebrating=true;
  fanfare();
  toast('Home safe! A new maze is coming up.');
  renderGame();
  setTimeout(function(){
   if(!game||game!==g||game.ended)return;
   newMazeRound(g);
   renderGame();
  },1150);
  return;
 }
 tone('snip');
 renderGame();
}
function mazeDirectionMove(key){
 if(!game||game.type!=='scurry')return;
 var dir=mazeKeyDirs[key];if(!dir)return;
 var head=game.trail[game.trail.length-1];
 var delta={n:[0,-1],s:[0,1],e:[1,0],w:[-1,0]}[dir];
 mazeClick(head.x+delta[0],head.y+delta[1]);
}
