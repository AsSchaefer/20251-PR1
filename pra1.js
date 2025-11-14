/* ------------------------------------------------------
   PRA1 – Lògica i estructura 
   ------------------------------------------------------
   Alumna: Alexandra Schäfer Barrientos
   Data: 14 de Novembre de 2025
   Fitxer: pra1.js
   Descripció: Implementació de classes i funcions demanades
               per gestionar Pokémon a nivell de lògica.
   ------------------------------------------------------ */


/* ------------------------------------------------------
  Estructura del fitxer:

  1. Classe Pokemon
  2. Classe PokemonList (mètodes bàsics)
      2.1. addPokemon
      2.2. removePokemon
      2.3. showList
  3. Funcions fletxa dins de PokemonList
      3.1.   addMultiplePokemons
      3.2.   getPokemonsByWeightRange
      3.3.   sortPokemonsByBaseExperience
  4. Funció recursiva findPokemonById
  5. Funció getMostCommonType amb reduce
  6. Funció getStrongPokemons amb filter + map
  7. EXEMPLES D’ÚS I VALIDACIÓ (Punts 1–6 de l’enunciat)

-------------------------------------------------------- */



/* ------------------------------------------------------
   1. Creació de la Classe Pokémon
   ------------------------------------------------------ */
/*
   Aquesta classe representa un Pokémon individual amb totes
   les propietats requerides en aquesta primera practica.

   S’han utilitzat atributs interns (_id, _name...) per tal
   de controlar-ne l'accés a través de getters/setters.
   Això facilitará l’addició de validacions específiques a la
   PRA2 sense modificar massa el codi que usa la classe.
*/

class Pokemon {
  /* ------------------------------------------------------
     1.1. Constructor
     ------------------------------------------------------
     Rep un objecte amb totes les propietats necessàries.

     En aquesta pràctica (PRA1) les dades dels Pokémon es
     defineixen manualment al codi. Tanmateix, aquest format
     de constructor (rebent un objecte) està pensat perquè,
     en pràctiques posteriors, sigui molt fàcil integrar-hi
     dades reals provinents de la PokeAPI.
     
     Font de dades:
     https://pokeapi.co/
  */

  constructor({ id, name, description, height, weight, baseExperience, abilities, types, sprites, stats }) {
    this._id=id;                         // Number
    this._name=name;                     // String 
    this._description=description;       // String
    this._height=height;                 // Number  
    this._weight=weight;                 // Number  
    this._baseExperience=baseExperience; // Number 
    this._abilities=abilities;           // Array de Strings
    this._types=types;                   // Array de Strings
    this._sprites=sprites;               // URL de la imatge oficial (String)
    this._stats=stats                    // Array d'objectes { name: String, value: Number }
  }

  /* ------------------------------------------------------
     1.2. Getters i setters individuals
     ------------------------------------------------------
     S’han creat getters/setters per cada propietat per tal
     d’afegir validacions específiques en la següent practica
     com ara, valors negatius, strings buits, etc.).
  */

  get id(){return this._id;}
  set id(nouId){this._id=nouId;}

  get name(){return this._name;}
  set name(nouNom){this._name=nouNom;}

  get description(){return this._description;}
  set description(novaDescripcio){this._description=novaDescripcio;}
  
  get height(){return this._height;}
  set height(novaAlçada){this._height=novaAlçada;}
  
  get weight(){return this._weight;}
  set weight(nouPes){this._weight=nouPes;}
  
  get baseExperience(){return this._baseExperience;}
  set baseExperience(novaExperienciaBase){this._baseExperience=novaExperienciaBase;}
  
  get abilities(){return this._abilities;}
  set abilities(novesHabilitats){this._abilities=novesHabilitats;}
  
  get types(){return this._types;}
  set types(nousTipus){this._types=nousTipus;}
  
  get sprites(){return this._sprites;}
  set sprites(novaImatge){this._sprites=novaImatge;}
  
  get stats(){return this._stats;}
  set stats(nousAtributs){this._stats=nousAtributs;}


 /* ------------------------------------------------------
   1.3. Getters calculats (fitxaResumida i fitxaCompleta)
   ------------------------------------------------------
   Generen versions en text del Pokémon per evitar repetir
   codi quan cal mostrar-lo per consola. També preparen 
   l’estructura per futurs usos (PRA2): mostrar targetes 
   resumides i fitxes completes en HTML.

   En resum: centralitzen el format de sortida perquè 
   el codi sigui més net i mantenible.
------------------------------------------------------ */

  get fitxaResumida() {
    let resum =
  `
  Imatge: ${this.sprites}
  Nom: ${this.name} (ID: ${this.id})
  Tipus: ${this.types.join(", ")}
  Experiència Base: ${this.baseExperience}
  Habilitats: ${this.abilities.join(", ")}
  Atributs:
  `;

  this.stats.forEach(stat => {
    resum += `  - ${stat.name}: ${stat.value}\n`;
  });

  return resum;
  }

  get fitxaCompleta() {
   let resum =
  `
  Imatge: ${this.sprites}
  Pokémon: ${this.name} (ID: ${this.id})
  Tipus: ${this.types.join(", ")}
  Experiència Base: ${this.baseExperience}
  Habilitats: ${this.abilities.join(", ")}
  Atributs:
  `;

    this.stats.forEach((estat) => {
      resum += `  - ${estat.name}: ${estat.value}\n`;
    });

  return resum;
  }

  /* ------------------------------------------------------
     Setter fitxaCompleta
    ------------------------------------------------------
     Permet actualitzar totes les propietats de cop a partir
     d’un únic objecte. És útil quan es vol substituir
     completament la informació d’un Pokémon (Pikachu Ultra a Pichu).
  */

  set fitxaCompleta(novesDades) {
    if (typeof novesDades !== "object") return;

    this.id = novesDades.id;
    this.name = novesDades.name;
    this.description = novesDades.description;
    this.height = novesDades.height;
    this.weight = novesDades.weight;
    this.baseExperience = novesDades.baseExperience;
    this.abilities = novesDades.abilities;
    this.types = novesDades.types;
    this.sprites = novesDades.sprites;
    this.stats = novesDades.stats;
  }
}


/* ------------------------------------------------------
   2. Creació de la Classe PokemonList
   ------------------------------------------------------
   Aquesta classe s’encarrega de gestionar un conjunt
   de Pokémons. Forma part dels punts 2 i 3 de l’enunciat,
   on es demanen mètodes bàsics i funcions fletxa.
------------------------------------------------------ */

class PokemonList {
  
  /* ------------------------------------------------------
     2.1 - Constructor
     ------------------------------------------------------
     Inicialitza l’array intern on guardarem tots els Pokémons.
     Aquesta estructura ens permetrà afegir, eliminar, ordenar
     i filtrar de manera eficient utilitzant els mètodes d'Array.
  */
  constructor() {
  this.llistaPokemons=[];
  }

  /* ------------------------------------------------------
     2.2 - addPokemon(pokemon)
     ------------------------------------------------------
     Afegeix un sol Pokémon a la llista.
     S’utilitza push() tal com indiquen les normes de la PAC
     (ús de mètodes d’Array i no bucles tradicionals).
  */
  addPokemon(pokemon) {
    this.llistaPokemons.push(pokemon);
    console.log(`Pokémon ${pokemon.name} afegit a la llista correctament.`);
  }

  /* ------------------------------------------------------
     2.3 - removePokemon(pokemonId)
     ------------------------------------------------------
     Elimina un Pokémon pel seu ID utilitzant filter(),
     que crea una nova llista excloent el Pokémon indicat.

     Aquest enfocament evita modificar l’array mentre
     s’està iterant.
  */
  removePokemon(pokemonId) {
    this.llistaPokemons=this.llistaPokemons.filter((pokemon) => pokemon.id!==pokemonId);
    console.log(`Pokémon amb ID ${pokemonId} eliminat de la llista correctament.`);
  }

  /* ------------------------------------------------------
     2.4 - showList()
     ------------------------------------------------------
     Mostra una vista bàsica de cada Pokémon: nom, tipus
     principal i imatge. Només es mostra un resum, ja que
     per informació detallada ja tenim fitxaResumida i
     fitxaCompleta a la classe Pokemon.
  */

  showList() {
    console.log("Llista de Pokémons:");

    this.llistaPokemons.forEach((pokemon) => {
            const tipusPrincipal = pokemon.types[0] ?? 'Sense tipus';
            console.log(`Nom: ${pokemon.name}`);
            console.log(`Tipus principal: ${tipusPrincipal}`);
            console.log(`Imatge: ${pokemon.sprites}`);
            console.log('----------------------------------------');
        });

  }

 /* ------------------------------------------------------
     3. FUNCIONS FLETXA 
  * ------------------------------------------------------
     3.1 – addMultiplePokemons(...pokemons)
     ------------------------------------------------------
     Rep diversos Pokémons com a paràmetres (operador rest)
     i els afegeix multiples Pokémons a la llista reutilitzant 
     el mètode addPokemon. D’aquesta manera evitem duplicar codi.
  */

  addMultiplePokemons = (...pokemons) => {
    console.log('Afegint múltiples Pokémon alhora');

      pokemons.forEach((pokemon) => {this.addPokemon(pokemon);});
};

  /* ------------------------------------------------------
     3.2 – getPokemonsByWeightRange(min, max)
     ------------------------------------------------------
     Retorna un nou array només amb els Pokémons el pes dels
     quals està dins del rang especificat.

     L’ús de filter() segueix les bones pràctiques demanades:
     comparacions estrictes i treballar sempre amb arrays.
  */

  getPokemonsByWeightRange = (minPes, maxPes) => {
  console.log(`Filtrant Pokémon amb pes entre ${minPes} i ${maxPes}`);

  return this.llistaPokemons.filter((pokemon) => pokemon.weight >= minPes && pokemon.weight <= maxPes);
  };


  /* ------------------------------------------------------
     3.3 – sortPokemonsByBaseExperience()
     ------------------------------------------------------
     Ordena la llista en el mateix lloc segons l’experiència base.
     S’utilitza sort(), que és eficient i adequat per ordenar
     col·leccions petites com les d’aquesta pràctica.
  */

  sortPokemonsByBaseExperience = () => {
    console.log("Ordenant per experiència base.")

        this.llistaPokemons.sort((pokemonA, pokemonB) => {
            return pokemonA.baseExperience - pokemonB.baseExperience;
        });
    console.log("Ordenació completada.");
  };
}



/* ------------------------------------------------------
   4. Funció recursiva - findPokemonById
   ------------------------------------------------------
   Aquesta funció cerca un Pokémon dins d’una llista
   utilitzant recursivitat. Examina cada posició fins que
   troba l’ID indicat o arriba al final de la llista.
------------------------------------------------------ */

function findPokemonById(pokemonList, id, index = 0) {
   console.log(`Cercant Pokémon amb ID: ${id}- (Índex actual: ${index}).`);

    /// Cas base: si superem la longitud, el Pokémon no existeix
    if (index >= pokemonList.length) {
        console.log(`Hem arribat al final de la llista. Pokémon amb ID ${id} no trobat.`);
        return null;
    }

    // Comprovació: Pokémon trobat a la posició actual
    if (pokemonList[index].id === id) {
        console.log(`Pokémon amb ID ${id} trobat: ${pokemonList[index].name}.`);
        return pokemonList[index];
    }

    // Crida recursiva avançant a la següent posició
    return findPokemonById(pokemonList, id, index + 1);
}

/* ------------------------------------------------------
   5. Funció getMostCommonType (ús de reduce)
   ------------------------------------------------------
   Aquesta funció determina quin tipus de Pokémon és el més
   freqüent dins d’una llista. Forma part del punt 5 de
   l’enunciat i utilitza el mètode reduce.
------------------------------------------------------ */

function getMostCommonType(pokemonList) {
  console.log("Cercant el tipus més comú de la llista.");

  // 5.1 - Control bàsic: llista buida
  if (pokemonList.llistaPokemons.length === 0) {
    console.log("La llista és buida. No hi ha cap tipus.");
    return null;
  }

  // 5.2 - Comptar quantes vegades apareix cada tipus fent servir reduce.
  const comptadorTipus = pokemonList.llistaPokemons.reduce((acumulador, pokemon) => {

    // Cada Pokémon pot tenir més d’un tipus, els recorrem tots
    pokemon.types.forEach((tipus) => {
      acumulador[tipus] = (acumulador[tipus] || 0) + 1;
    });

    return acumulador;
  }, {});

  console.log("Comptador de tipus:", comptadorTipus);

  //  5.3 - Detectar el tipus amb més aparicions.
  let tipusMesComu = null;
  let maximComptatge = 0;

  for (const tipus in comptadorTipus) {
    if (comptadorTipus[tipus] > maximComptatge) {
      maximComptatge = comptadorTipus[tipus];
      tipusMesComu = tipus;
    }
  }

  console.log(
    `El tipus més comú: ${tipusMesComu} (apareix ${maximComptatge} cops.)`
  );

  return tipusMesComu;
}


/* ------------------------------------------------------
   6. Funció getStrongPokemons - filter i map
   ------------------------------------------------------
   Aquesta funció retorna tots els Pokémons que tenen un
   valor d’"attack" igual o superior al mínim indicat. 
   S’utilitzen: filter per seleccionar només els Pokémons forts
   i  map  per retornar només nom + valor d’atac
------------------------------------------------------ */

function getStrongPokemons(pokemons, minAtac) {

  // 6.1 – Filtrar només els que tenen major o igual minAtac
  const pokemonsFiltrats = pokemons.filter((pokemon) => {

    // Cerquem dins de stats el valor d’atac
    for (const atribut of pokemon.stats) {
      if (atribut.name === "attack" && atribut.value >= minAtac) {
        return true;  // És prou fort, es manté al filtre
      }
    }

    return false; // No té atac suficient
  });

  // 6.2 – Transformar el resultat per retornar només nom i valor d’atac (format més simple)
  const resultat = pokemonsFiltrats.map((pokemon) => {

    let valorAtac = null;

    for (const atribut of pokemon.stats) {
      if (atribut.name === "attack") {
        valorAtac = atribut.value;
        break;
      }
    }

    return { name: pokemon.name, attack: valorAtac };
  });

  return resultat;
}



/* =====================================================
   DADES DE EXEMPLE PER A LA VALIDACIÓ DONATS
===================================================== */
  // Ceems alguns Pokémon vàlids

const pikachu = new Pokemon({
  id: 25,
  name: "Pikachu",
  description: "Pikachu that can generate powerful electricity have cheek sacs that are extra soft and super stretchy.",
  height: 4,
  weight: 60,
  baseExperience: 112,
  abilities: ["static", "lightning-rod"],
  types: ["electric"],
  sprites: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png",
  stats: [
    { name: "hp", value: 35 },
    { name: "attack", value: 55 },
    { name: "defense", value: 40 },
    { name: "speed", value: 90 }
  ]
});

const bulbasaur = new Pokemon({
  id: 1,
  name: "Bulbasaur",
  description: "There is a plant seed on its back right from the day this Pokémon is born. The seed slowly grows larger.",
  height: 7,
  weight: 69,
  baseExperience: 64,
  abilities: ["overgrow", "chlorophyll"],
  types: ["grass", "poison"],
  sprites: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
  stats: [
    { name: "hp", value: 45 },
    { name: "attack", value: 49 },
    { name: "defense", value: 49 },
    { name: "speed", value: 45 }
  ]
});

const charmander = new Pokemon({
  id: 4,
  name: "Charmander",
  description: "It has a preference for hot things. When it rains, steam is said to spout from the tip of its tail.",
  height: 6,
  weight: 85,
  baseExperience: 62,
  abilities: ["blaze", "solar-power"],
  types: ["fire"],
  sprites: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png",
  stats: [
    { name: "hp", value: 39 },
    { name: "attack", value: 52 },
    { name: "defense", value: 43 },
    { name: "speed", value: 65 }
  ]
});



/* =====================================================
    EXEMPLES D’ÚS I VALIDACIÓ 
    -----------------------------------------------------
    1. Classe Pokémon (getters i setters)
    2. Classe PokemonList (mètodes bàsics)
        2.1. addPokemon
        2.2. removePokemon
        2.3. showList
    3.Funcions fletxa dins de PokemonList
       3.1. Funció fletxa addMultiplePokemons
       3.2. Funció fletxa getPokemonsByWeightRange
       3.3. Funció fletxa sortPokemonsByBaseExperience
    4. Funció recursiva findPokemonById
    5. Funció reduce getMostCommonType
    6. Funció filter i map getStrongPokemons
   ===================================================== */

/* ------------------------------------------------------
    1. VALIDACIÓ – Classe Pokémon 
  -------------------------------------------------------
    \\ Ús dels getters y setters
  ------------------------------------------------------ */

console.log("=== Ús de getters i setters de la classe Pokemon ===");

// getters i setters individuals
console.log("ID abans:", pikachu.id);
pikachu.id = 35;
console.log("ID després:", pikachu.id);

console.log("Nom abans:", pikachu.name);
pikachu.name = "Pikachu Ultra";
console.log("Nom després:", pikachu.name);

console.log("Descripció abans:", pikachu.description);
pikachu.description = "Versió millorada de Pikachu amb més velocitat.";
console.log("Descripció després:", pikachu.description);

console.log("Alçada abans:", pikachu.height);
pikachu.height = 5;
console.log("Alçada després:", pikachu.height);

console.log("Pes abans:", pikachu.weight);
pikachu.weight = 70;
console.log("Pes després:", pikachu.weight);

console.log("Experiència base abans:", pikachu.baseExperience);
pikachu.baseExperience = 122;
console.log("Experiència base després:", pikachu.baseExperience);

console.log("Habilitats abans:", pikachu.abilities);
pikachu.abilities = ["static", "volt-absorb"];
console.log("Habilitats després:", pikachu.abilities);

console.log("Tipus abans:", pikachu.types);
pikachu.types = ["electric", "fairy"];
console.log("Tipus després:", pikachu.types);

console.log("Imatge abans:", pikachu.sprites);
pikachu.sprites = "https://pokeapi.co/media/sprites/pikachu-ultra.png";
console.log("Imatge després:", pikachu.sprites);

console.log("Atributs abans:", pikachu.stats);
pikachu.stats = [
  { name: "hp", value: 45 },
  { name: "attack", value: 65 },
  { name: "defense", value: 50 },
  { name: "speed", value: 100 }
];
console.log("Atributs després:", pikachu.stats);

// getters i setters calculats
console.log("=== Fitxa resumida ===");
console.log(pikachu.fitxaResumida);

console.log("=== Fitxa completa ===");
console.log(pikachu.fitxaCompleta);

console.log("=== Modificació global amb setter fitxaCompleta ===");
pikachu.fitxaCompleta = {
  id: 45,
  name: "Pichu",
  description: "Pre-evolució de Pikachu",
  height: 6,
  weight: 80,
  baseExperience: 132,
  abilities: ["static"],
  types: ["electric"],
  sprites: "https://pokeapi.co/media/sprites/pichu.png",
  stats: [
    { name: "hp", value: 55 },
    { name: "attack", value: 75 },
    { name: "defense", value: 60 },
    { name: "speed", value: 100 }
  ]
};

console.log("Fitxa completa després del canvi:");
console.log(pikachu.fitxaCompleta);


// Reset per mantenir coherència amb els próxims exemples (1–10)
pikachu.fitxaCompleta = {
  id: 25,
  name: "Pikachu",
  description: "Pikachu that can generate powerful electricity have cheek sacs that are extra soft and super stretchy.",
  height: 4,
  weight: 60,
  baseExperience: 112,
  abilities: ["static", "lightning-rod"],
  types: ["electric"],
  sprites: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png",
  stats: [
    { name: "hp", value: 35 },
    { name: "attack", value: 55 },
    { name: "defense", value: 40 },
    { name: "speed", value: 90 }
  ]
};

console.log("=== Fitxa completa restaurada (Pikachu original) ===");
console.log(pikachu.fitxaCompleta);


/* ------------------------------------------------------
   2 i 3. VALIDACIÓ – CLASE PokemonList
---------------------------------------------------------
   // Crear una llista de Pokémons
------------------------------------------------------ */
console.log("\n=== Crear una llista de Pokémons ===");

const llista = new PokemonList();
console.log("Llista creada correctament. Quantitat inicial:", llista.llistaPokemons.length);



/* ------------------------------------------------------
   2.1 VALIDACIÓ – Mètode addPokemon
---------------------------------------------------------
  // Exemple 1: afegir un Pokémon
------------------------------------------------------ */

console.log("\n=== Exemple 1: afegir Pikachu ===");
llista.addPokemon(pikachu);
console.log("Quantitat actual:", llista.llistaPokemons.length);

/* ------------------------------------------------------
   3.1 VALIDACIÓ – Funció fletxa addMultiplePokemons
---------------------------------------------------------
  // Exemple 2: afegir múltiples Pokémons
------------------------------------------------------ */
console.log("\n=== Exemple 2: afegir múltiples Pokémons ===");

llista.addMultiplePokemons(bulbasaur, charmander);
console.log("Quantitat actual:", llista.llistaPokemons.length);

/* ------------------------------------------------------
   2.2 VALIDACIÓ – Mètode removePokemon 
---------------------------------------------------------
  // Exemple 3:  Eliminar un Pokémon (Bulbasaur (ID 1))
------------------------------------------------------ */
console.log("\n=== Exemple 3: eliminar Bulbasaur (ID 1) ===");

llista.removePokemon(1);
console.log("Quantitat actual:", llista.llistaPokemons.length);


/* ------------------------------------------------------
   2.2 VALIDACIÓ – Mètode removePokemon 
---------------------------------------------------------
  // Exemple 3:  Eliminar un Pokémon (Charmander (ID 4))
------------------------------------------------------ */

console.log("\n=== Exemple 4: eliminar Charmander (ID 4) ===");

llista.removePokemon(4);
console.log("Quantitat actual:", llista.llistaPokemons.length);

/* ------------------------------------------------------
   2.3 VALIDACIÓ – Mètode showList
---------------------------------------------------------
  // Exemple 5: Mostrar la llista  de Pokémons
------------------------------------------------------ */

console.log("\n=== Exemple 5: mostrar la llista ===");
llista.showList();

console.log("\n=== Reconstruim llista completa per seguir validant ===");
// Per continuar amb els següents exemples, reconstruïm la llista completa
llista.llistaPokemons = [];
llista.addMultiplePokemons(pikachu, bulbasaur, charmander);


/* ------------------------------------------------------
   3.2 VALIDACIÓ – Funció fletxa getPokemonsByWeightRange
---------------------------------------------------------
   // Exemple 6: Obternir Pokémon per rang de pes
------------------------------------------------------ */
console.log("\n=== Exemple 6: Pokémons entre 60-80 kg ===");

const filtrats = llista.getPokemonsByWeightRange(60, 80);
filtrats.forEach(pokemonActual => console.log(`- ${pokemonActual.name} (${pokemonActual.weight} kg)`));

/* ------------------------------------------------------
   3.3 VALIDACIÓ – Funció fletxa sortPokemonsByBaseExperience
---------------------------------------------------------
   // Exemple 7: Ordenar Pokémon per l'experiencia base
------------------------------------------------------ */
console.log("\n=== Exemple 7: ordenar per experiència base ===");

console.log("Abans d'ordenar:");
llista.llistaPokemons.forEach(pokemonActual => console.log(`- ${pokemonActual.name}: ${pokemonActual.baseExperience}`));

llista.sortPokemonsByBaseExperience();

console.log("Després d'ordenar:");
llista.llistaPokemons.forEach(pokemonActual => console.log(`- ${pokemonActual.name}: ${pokemonActual.baseExperience}`));


/* ------------------------------------------------------
   4. VALIDACIÓ – Funció recursiva findPokemonById
---------------------------------------------------------
   // Exemple 8: F. Recursiva per buscar un Pokémon por ID
------------------------------------------------------ */

console.log("\n=== Exemple 8: cercar un Pokémon per ID ===");

console.log(findPokemonById(llista.llistaPokemons, 25));  // cas trobat
console.log(findPokemonById(llista.llistaPokemons, 30));  // cas no trobat


/* ------------------------------------------------------
   5. VALIDACIÓ – Funció getMostCommonType 
   ------------------------------------------------------
   Exemple 9: Tipus més comú
------------------------------------------------------ */

console.log("\n=== Exemple 9.1: tipus més comú ===");

const tipusComu = getMostCommonType(llista);
console.log("Tipus més comú:", tipusComu);



/* ------------------------------------------------------
   VALIDACIÓ EXTRA – getMostCommonType amb tipus repetits
   ------------------------------------------------------
   Afegim un nou Pokémon amb tipus "fire" per comprovar
   que la funció detecta correctament el tipus més comú
   quan hi ha diverses repeticions.
------------------------------------------------------ */

const charizard = new Pokemon({
  id: 6,
  name: "Charizard",
  description: "Pokémon de foc molt poderós.",
  height: 17,
  weight: 90,
  baseExperience: 240,
  abilities: ["blaze"],
  types: ["fire", "flying"],
  sprites: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png",
  stats: [
    { name: "hp", value: 78 },
    { name: "attack", value: 84 },
    { name: "defense", value: 78 },
    { name: "speed", value: 100 }
  ]
});

console.log("\n=== Exemple 9.2: tipus més comú amb dades repetides ===");

// Afegim Charizard a la llista existent
llista.addPokemon(charizard);

// Tornem a calcular el tipus més comú
const tipusComuAmbRepetits = getMostCommonType(llista);
console.log("Tipus més comú amb dades repetides:", tipusComuAmbRepetits);



/* ------------------------------------------------------
   6. VALIDACIÓ – Funció filter i map getStrongPokemons
---------------------------------------------------------
   // Exemple 10: Pokémon més forts per atac
------------------------------------------------------ */
console.log("\n=== Exemple 10: Pokémons amb atac >= 55 ===");

const superForts = getStrongPokemons(llista.llistaPokemons, 55);

superForts.forEach((pokemonActual, index) => {
  console.log(`${index + 1}. ${pokemonActual.name} (atac: ${pokemonActual.attack})`);
});


