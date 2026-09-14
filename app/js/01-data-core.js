'use strict';
/* Core config & data: palettes, mascots, difficulty levels, and the game catalog. */
var palettes = [
 {name:'Blueberry meadow',primary:'#5755c9',secondary:'#ee945b',background:'#faf7ef',surface:'#fffdf8',ink:'#293b36',garden:'#90b99a'},
 {name:'Strawberry picnic',primary:'#b63f62',secondary:'#edb950',background:'#fff6ed',surface:'#fffdf8',ink:'#543841',garden:'#96bc8e'},
 {name:'Ocean explorer',primary:'#237e91',secondary:'#f19b66',background:'#edf7f7',surface:'#fbffff',ink:'#234750',garden:'#91bbac'},
 {name:'Space garden',primary:'#7855ad',secondary:'#c6b955',background:'#f2eef9',surface:'#fffcff',ink:'#423654',garden:'#a3b891'},
 {name:'Sunny orange',primary:'#b95b29',secondary:'#e7bb49',background:'#fff8e5',surface:'#fffdf5',ink:'#4b432e',garden:'#a3bb83'},
 {name:'Forest treasure',primary:'#34755b',secondary:'#dfa66c',background:'#f1f5e9',surface:'#fffff8',ink:'#30483a',garden:'#a6c987'},
 {name:'Cherry rocket',primary:'#a74749',secondary:'#75b5cd',background:'#fbf1ed',surface:'#fffaf7',ink:'#4b353c',garden:'#a6bd96'},
 {name:'Moonbeam',primary:'#42699e',secondary:'#dba1b4',background:'#f2f4fc',surface:'#fdfdff',ink:'#303d56',garden:'#a6c6b5'},
 {name:'Lavender fields',primary:'#6a5ea8',secondary:'#e0a3c9',background:'#f5f1fb',surface:'#fffcff',ink:'#3c3350',garden:'#a9bfa0'},
 {name:'Citrus splash',primary:'#d9781f',secondary:'#4f9d69',background:'#fff4e3',surface:'#fffdf8',ink:'#4a3420',garden:'#9dc08a'},
 {name:'Mint cocoa',primary:'#3f8f7a',secondary:'#b5773f',background:'#eef8f3',surface:'#fffefb',ink:'#2c473d',garden:'#9ec9ab'},
 {name:'Rosewood',primary:'#9c4f5a',secondary:'#5f8fae',background:'#fbeef0',surface:'#fffbfb',ink:'#452e33',garden:'#9bbf9e'},
 {name:'Golden pond',primary:'#c69a1f',secondary:'#3e7ea6',background:'#fbf8e8',surface:'#fffefa',ink:'#4a4326',garden:'#93b98d'}
];
var colorKeys=['primary','secondary','background','surface','ink','garden'];
var mascots=['flower','mouse','star','rocket','butterfly','dino','sprout','sun','cat','bird','fish','robot','dog','owl','turtle','bee'];
var styles=['pop','soft','block','sparkle','stamp','outline','mono','bubble'];
var styleLabels=['Bouncy','Storybook','Super bold','Sparkly','Stamp','Outline','Typewriter','Bubble'];
var patterns=['dots','stripes','sprinkles','grid','plain'];
var patternLabels=['Dots','Stripes','Sprinkles','Grid','Plain'];
var flowerSpecies=['daisy','tulip','sunflower','rose'];
var flowerHues=[
 {key:'blush',petal:'#e78aa0',center:'#f6dd86'},
 {key:'sky',petal:'#6fa8d6',center:'#fef6d8'},
 {key:'sunshine',petal:'#f2c14e',center:'#8a5a2b'},
 {key:'violet',petal:'#a680c9',center:'#fbeec7'},
 {key:'coral',petal:'#f0805a',center:'#fff3d0'},
 {key:'snow',petal:'#fbfbfb',center:'#f0b64c'}
];
var MAZE_SIZE=5;
var mazeKeyDirs={arrowup:'n',w:'n',arrowdown:'s',s:'s',arrowleft:'w',a:'w',arrowright:'e',d:'e'};
var DIFF_LEVELS=['easy','medium','hard'];
var diffLabels={easy:'Easy',medium:'Medium',hard:'Hard'};
var GAME_IDS=['bop','bloom','scurry','bouquet','countries','gauchos','peaks','biomes','animals','market','timeline'];
var PRE_KNOWN_GAME_IDS=['bop','bloom','scurry','bouquet','countries','gauchos'];
var GAME_CATALOG=[
 {id:'bop',title:'Bop!',desc:'Peekaboo, little mice. Can you catch them?',label:'PEEK · BOP · GIGGLE',secondary:false,verb:'bop'},
 {id:'bloom',title:'Bloom!',desc:'Grow a little garden. Snip a bunch of flowers.',label:'GROW · SNIP · SMILE',secondary:true,verb:'bloom'},
 {id:'scurry',title:'Scurry!',desc:'A new maze appears every time. Drop cheese to guide a field mouse home.',label:'CHEESE · MAZE · HOME',secondary:false,verb:'scurry'},
 {id:'bouquet',title:'Bouquet!',desc:'A bouquet appears — snip the matching flowers and fill the vase to match it.',label:'MATCH · SNIP · BUNCH',secondary:true,verb:'bunch'},
 {id:'countries',title:'Country Match!',desc:'Learn South America — match every country to its place on the map.',label:'LEARN · MATCH · MAP',secondary:false,verb:'match'},
 {id:'gauchos',title:'Gaucho Herd!',desc:'Round up a wandering herd of cows on the Patagonian pampas.',label:'ROUND UP · HERD · HOME',secondary:true,verb:'herd'},
 {id:'peaks',title:'Peak Climber!',desc:'Guide a climber up the route to the top of famous Patagonian and Andean peaks.',label:'CLIMB · SUMMIT · LEARN',secondary:false,verb:'climb'},
 {id:'biomes',title:'Wild Places!',desc:'Find the Amazon, the Andes, the Atacama and more on the map of South America.',label:'FIND · LEARN · EXPLORE',secondary:true,verb:'explore'},
 {id:'animals',title:'Animal Sort!',desc:'Sort South American animals into the wild places they call home.',label:'SPOT · SORT · LEARN',secondary:false,verb:'sort'},
 {id:'market',title:'Market Day!',desc:'Count out coins to buy treats at a South American market.',label:'COUNT · PAY · SHOP',secondary:true,verb:'shop'},
 {id:'timeline',title:'Time Traveler!',desc:'Put big moments in South American history in the right order.',label:'ORDER · LEARN · HISTORY',secondary:false,verb:'travel'}
];
var gameNames={bop:'Bop!',bloom:'Bloom!',scurry:'Scurry!',bouquet:'Bouquet!',countries:'Country Match!',gauchos:'Gaucho Herd!',peaks:'Peak Climber!',biomes:'Wild Places!',animals:'Animal Sort!',market:'Market Day!',timeline:'Time Traveler!'};
var gameScores={bop:'BOPS',bloom:'FLOWERS',scurry:'MICE',bouquet:'BOUQUETS',countries:'COUNTRIES',gauchos:'COWS',peaks:'SUMMITS',biomes:'PLACES',animals:'ANIMALS',market:'BOUGHT',timeline:'IN ORDER'};
var gameLabels={bop:'happy little bops',bloom:'flowers snipped',scurry:'mice guided home',bouquet:'bouquets made',countries:'countries placed',gauchos:'cows herded home',peaks:'peaks summited',biomes:'wild places found',animals:'animals sorted home',market:'market treats bought',timeline:'timelines sorted'};
