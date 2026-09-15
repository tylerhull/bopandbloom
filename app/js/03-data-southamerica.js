/* South America content data: country facts, peaks, biomes, habitats, animals, market items, and history. */
var saFacts={
 venezuela:['Venezuela\'s capital city is Caracas.','Angel Falls in Venezuela is the tallest waterfall in the world.','Venezuela is named after the Italian city of Venice — early explorers thought stilt houses on Lake Maracaibo looked similar.','Venezuela has some of the largest oil reserves in the world.','The official language of Venezuela is Spanish.','Venezuela\'s flag has seven stars, one for each province that signed its declaration of independence.'],
 colombia:['Colombia\'s capital city is Bogotá, high in the Andes mountains.','Colombia is the only South American country with coastlines on both the Pacific Ocean and the Caribbean Sea.','Colombia produces more emeralds than any other country in the world.','Coffee grown in Colombia is famous worldwide for its smooth flavor.','Colombia is one of the most biodiverse countries on Earth, home to thousands of bird species.','The official language of Colombia is Spanish.'],
 guyana:['Guyana\'s capital city is Georgetown.','Guyana is the only country in South America where English is the official language.','Kaieteur Falls in Guyana is one of the world\'s most powerful waterfalls.','Much of Guyana is covered in dense rainforest.','Guyana was a Dutch and then British colony before becoming independent in 1966.','Guyana\'s name comes from an Indigenous word meaning "land of many waters."'],
 suriname:['Suriname\'s capital city is Paramaribo.','Suriname is the smallest country in South America.','Suriname was a Dutch colony, so Dutch is still its official language today.','More than 90 percent of Suriname is covered by rainforest.','Suriname is home to people of many backgrounds, including Indigenous, African, Indian, and Indonesian heritage.','The Suriname River runs right through the capital city.'],
 ecuador:['Ecuador\'s capital city is Quito, one of the highest capital cities in the world.','Ecuador is named after the equator, which runs right through the country.','The Galápagos Islands, famous for unique wildlife, belong to Ecuador.','Ecuador uses the United States dollar as its official currency.','Quito\'s historic center was one of the first UNESCO World Heritage Sites.','Ecuador is home to many volcanoes, including the active Cotopaxi.'],
 peru:['Peru\'s capital city is Lima.','The ancient Inca city of Machu Picchu sits high in the Peruvian Andes.','Peru was once the center of the powerful Inca Empire.','Lake Titicaca, shared by Peru and Bolivia, is one of the highest navigable lakes in the world.','Peru is home to part of the Amazon rainforest, the Andes mountains, and a desert coast.','Potatoes were first grown by farmers in ancient Peru thousands of years ago.'],
 brazil:['Brazil\'s capital city is Brasília, built specially to be the capital in the 1960s.','Brazil is the largest country in South America by both size and population.','Portuguese is the official language of Brazil — the only South American country where Spanish isn\'t the main language.','Most of the Amazon Rainforest lies within Brazil\'s borders.','Brazil has won the FIFA World Cup more times than any other country.','Rio de Janeiro\'s Carnival is one of the biggest festivals in the world.'],
 bolivia:['Bolivia has two capital cities: Sucre is the constitutional capital, and La Paz is the seat of government.','La Paz is one of the highest capital cities in the world.','Bolivia is one of only two landlocked countries in South America.','The Salar de Uyuni in Bolivia is the largest salt flat on Earth.','Bolivia is named after Simón Bolívar, a leader in South America\'s independence movements.','Bolivia shares Lake Titicaca with Peru.'],
 paraguay:['Paraguay\'s capital city is Asunción.','Paraguay is one of only two landlocked countries in South America, along with Bolivia.','Most Paraguayans speak both Spanish and an Indigenous language called Guaraní.','The Itaipu Dam, shared with Brazil, is one of the largest hydroelectric dams in the world.','Paraguay is covered mostly by grassy plains and fertile farmland called the Gran Chaco.','Paraguay\'s flag is unusual because it has a different design on each side.'],
 chile:['Chile\'s capital city is Santiago.','Chile is one of the longest, thinnest countries in the world, stretching over 2,600 miles north to south.','The Atacama Desert in northern Chile is one of the driest places on Earth.','Easter Island, famous for its giant stone statues, belongs to Chile.','Because Chile is so long, it has deserts, mountains, forests, and glaciers all in one country.','Chile is one of the world\'s top producers of copper.'],
 argentina:['Argentina\'s capital city is Buenos Aires.','Argentina is the second-largest country in South America by size.','The tango, a famous style of dance and music, began in Buenos Aires.','Argentina is home to Aconcagua, the tallest mountain in the Americas.','Patagonia, a region famous for dramatic mountains and glaciers, is shared between Argentina and Chile.','Argentina is one of the world\'s largest producers of beef.'],
 uruguay:['Uruguay\'s capital city is Montevideo.','Uruguay is one of the smallest countries in South America.','Uruguay hosted and won the very first FIFA World Cup in 1930.','Uruguay was one of the first countries in the world to give women the right to vote.','Ranching is a huge part of Uruguay\'s culture, much like in neighboring Argentina.','Uruguay gets a very high share of its electricity from renewable energy sources.']
};
var peaks=[
 {id:'fitzroy',name:'Cerro Fitz Roy',location:'Argentina / Chile border, Patagonia',height:'3,405 m (11,171 ft)',photo:'peaks/fitzroy.jpg',pt:133.28,credit:'Photo: Jenny Mealing, CC BY 2.0',facts:['Fitz Roy was named after Robert FitzRoy, captain of the ship that carried Charles Darwin along this coast.','Its sheer granite spires are considered some of the hardest in the world to climb.','The local Tehuelche people called it "Chaltén," meaning "smoking mountain," because clouds often swirl around its peak.']},
 {id:'cerrotorre',name:'Cerro Torre',location:'Patagonia, Argentina / Chile',height:'3,128 m (10,262 ft)',photo:'peaks/cerrotorre.jpg',pt:142.81,credit:'Photo: Masa Sakano, CC BY-SA 2.0',facts:['Cerro Torre is famous for the thick cap of rime ice that often forms right at its summit.','Fierce winds and constant storms make it one of the hardest mountains in the world to climb.','It took decades of disputed attempts before climbers agreed a true summit had finally been reached.']},
 {id:'aconcagua',name:'Aconcagua',location:'Mendoza Province, Argentina',height:'6,961 m (22,838 ft)',photo:'peaks/aconcagua.jpg',pt:66.56,credit:'Photo: Bernard Gagnon, CC BY-SA 4.0',facts:['Aconcagua is the tallest mountain in both the Americas and the whole Southern Hemisphere.','It is one of the "Seven Summits" — the tallest peak on each continent.','Despite its height, its easiest route needs no technical climbing gear, so thousands attempt it every year.']},
 {id:'torresdelpaine',name:'Torres del Paine',location:'Patagonia, Chile',height:'2,500 m (8,202 ft)',photo:'peaks/torresdelpaine.jpg',pt:66.56,credit:'Photo: Snowmanstudios, CC BY-SA 4.0',facts:['The three granite Torres, or towers, formed from cooled magma later uncovered by grinding glaciers.','Torres del Paine National Park is home to guanacos, condors, and even pumas.','The park\'s name comes from a local word for "blue," for its glacier-fed lakes.']}
];
var climbWaypoints=[[15,92],[28,78],[22,62],[38,50],[32,36],[48,24],[50,10]];
var saBiomes=[
 {id:'amazon',name:'Amazon Rainforest',short:'Amazon',color:'#3f8f4f',cx:1120,cy:150,r:150,fact:'The Amazon is the largest rainforest on Earth, and more than half of it is in Brazil.'},
 {id:'andes',name:'Andes Mountains',short:'Andes',color:'#8a7a6a',cx:690,cy:300,r:105,fact:'The Andes run down the whole west side of South America — the longest mountain range in the world.'},
 {id:'atacama',name:'Atacama Desert',short:'Atacama',color:'#e0b062',cx:805,cy:600,r:75,fact:'The Atacama Desert in Chile is the driest place on Earth — some spots have never recorded rain.'},
 {id:'pampas',name:'The Pampas',short:'Pampas',color:'#9ec96a',cx:1160,cy:930,r:110,fact:'The Pampas are wide, flat grasslands where gauchos herd cattle in Argentina and Uruguay.'},
 {id:'patagonia',name:'Patagonia',short:'Patagonia',color:'#7fb4c9',cx:1020,cy:1160,r:120,fact:'Patagonia, at the southern tip, is famous for glaciers, sharp peaks, and very strong winds.'},
 {id:'chaco',name:'Gran Chaco',short:'Chaco',color:'#c98f5a',cx:1090,cy:610,r:95,fact:'The Gran Chaco is a hot, thorny lowland shared by Paraguay, Bolivia and Argentina.'}
];
var saHabitats=[
 {id:'rainforest',name:'Rainforest',color:'#3f8f4f'},
 {id:'mountains',name:'Mountains',color:'#8a7a6a'},
 {id:'grasslands',name:'Grasslands',color:'#9ec96a'},
 {id:'coast',name:'Coast & Sea',color:'#4a90a4'}
];
var saAnimals=[
 {id:'jaguar',name:'Jaguar',habitat:'rainforest',fact:'The jaguar is the biggest cat in the Americas and a strong swimmer.'},
 {id:'toucan',name:'Toucan',habitat:'rainforest',fact:'A toucan\'s huge colorful beak is surprisingly light — it is mostly hollow.'},
 {id:'sloth',name:'Sloth',habitat:'rainforest',fact:'Sloths move so slowly that tiny green algae can grow right on their fur.'},
 {id:'llama',name:'Llama',habitat:'mountains',fact:'People in the Andes have used llamas to carry loads for thousands of years.'},
 {id:'condor',name:'Andean Condor',habitat:'mountains',fact:'The Andean condor has one of the widest wingspans of any flying bird.'},
 {id:'chinchilla',name:'Chinchilla',habitat:'mountains',fact:'Chinchillas have the thickest fur of any land animal, to survive cold mountain nights.'},
 {id:'capybara',name:'Capybara',habitat:'grasslands',fact:'The capybara is the largest rodent in the world and loves to sit in water.'},
 {id:'rhea',name:'Rhea',habitat:'grasslands',fact:'The rhea is a big bird that cannot fly, but it can run very fast across the Pampas.'},
 {id:'armadillo',name:'Armadillo',habitat:'grasslands',fact:'An armadillo wears bony plates like armor to keep itself safe.'},
 {id:'penguin',name:'Magellanic Penguin',habitat:'coast',fact:'Magellanic penguins nest in burrows along the chilly coasts of Argentina and Chile.'},
 {id:'sealion',name:'Sea Lion',habitat:'coast',fact:'South American sea lions gather in big noisy groups on rocky beaches.'},
 {id:'whale',name:'Right Whale',habitat:'coast',fact:'Southern right whales come to Argentina\'s Península Valdés every year to raise their calves.'}
];
var marketCountries=[
 {country:'Argentina',currency:'pesos'},
 {country:'Brazil',currency:'reais'},
 {country:'Peru',currency:'soles'},
 {country:'Colombia',currency:'pesos'},
 {country:'Chile',currency:'pesos'}
];
var marketItems=[
 {id:'empanada',name:'empanada'},{id:'banana',name:'bananas'},{id:'hat',name:'a straw hat'},
 {id:'mate',name:'a mate gourd'},{id:'sweater',name:'an alpaca sweater'},{id:'coffee',name:'coffee beans'},
 {id:'guitar',name:'a little guitar'},{id:'flower',name:'a flower'}
];
var timelineEvents=[
 {year:1438,text:'The Inca Empire begins to grow across the Andes.'},
 {year:1450,text:'Machu Picchu is built high in the mountains of Peru.'},
 {year:1500,text:'Portuguese ships reach the coast of what is now Brazil.'},
 {year:1616,text:'Sailors round Cape Horn at South America\'s southern tip for the first time.'},
 {year:1809,text:'The first calls for independence ring out across South America.'},
 {year:1821,text:'Peru declares its independence.'},
 {year:1822,text:'Brazil becomes independent from Portugal.'},
 {year:1830,text:'Simón Bolívar, who helped free several nations, dies.'},
 {year:1911,text:'Hiram Bingham brings news of Machu Picchu to the wider world.'},
 {year:1930,text:'Uruguay hosts and wins the very first World Cup.'},
 {year:1931,text:'The Christ the Redeemer statue is finished above Rio de Janeiro.'},
 {year:1960,text:'Brasília becomes the new capital city of Brazil.'}
];
var gauchoFacts=[
 'Gauchos are skilled horsemen and cattle herders from the grasslands of Argentina, Uruguay, and southern Brazil.',
 'The wide, flat grasslands where gauchos work are called the pampas.',
 'Gauchos traditionally wear a wide-brimmed hat, a poncho, and loose trousers called bombachas.',
 'A gaucho often feels most at home in the saddle — many spend most of their working day on horseback.',
 'Gauchos carry a long knife called a facón, useful for many everyday jobs.',
 'Mate is a traditional herbal tea gauchos share from a hollow gourd through a metal straw.',
 'Gauchos became folk heroes in Argentine and Uruguayan stories, symbolizing freedom and independence.',
 'Boleadoras are throwing weapons made of weighted cords, once used by gauchos to catch running cattle.',
 'Patagonia, at the southern tip of South America, is famous for its huge sheep and cattle ranches called estancias.',
 'A doma is a rodeo-like event where gauchos show off their horse-taming skills.',
 'Gauchos are famous for asado, a slow-cooked barbecue enjoyed at big gatherings.',
 'The gaucho lifestyle inspired Argentina’s national epic poem, Martín Fierro.',
 'Sheepdogs often work alongside gauchos and their horses to keep herds together.',
 'Some gauchos move with their herds through the seasons, searching for fresh grass.',
 'Gauchos traditionally decorate their belts with silver coins as a sign of pride.',
 'Guanacos, wild relatives of the llama, share the Patagonian grasslands with cattle and sheep.',
 'Uruguay celebrates Día de la Tradición every April to honor gaucho culture.',
 'A gaucho’s saddle often has a soft sheepskin cover for long, comfortable rides.',
 'Gauchos herd not just cattle, but horses and sheep too, across wide open land.',
 'The pampas are so flat and wide that gauchos once used the stars to find their way at night.',
 'Chilean herders are sometimes called huasos, with their own style of dress and riding.',
 'Gauchos would sometimes camp under the open sky for days while moving a herd.',
 'Wool from Patagonian sheep ranches is famous around the world for being soft and warm.',
 'Roping with a lasso, called a lazo, takes gauchos years of practice to master.',
 'Payada is a gaucho singing tradition where verses are often made up on the spot.',
 'A gaucho’s wide-brimmed hat helps protect against the strong winds of the open plains.',
 'Some estancias in Patagonia now welcome visitors to see real gaucho work up close.',
 'Gauchos build a deep bond of trust with their horses over years of riding together.',
 'Cattle drives across the pampas can stretch on for many days at a time.',
 'The word gaucho is believed to come from an old word meaning wanderer.'
];
