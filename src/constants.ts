// Path: src\utils\constants.ts
// Purpose: To store all the constants used in the project

export const canvasWidth = 1024
export const canvasHeight = 576
export const tileSize = 64

export const movesByType: Record<string, number[]> = {
  normal: [33, 10],
  grass: [33, 75],
  fire: [33, 52],
  water: [33, 55]
}

export const effectChart: number[][] = [
  [1, 1, 1, 1, 1, 0.5, 1, 0, 0.5, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [2, 1, 0.5, 0.5, 1, 2, 0.5, 0, 2, 1, 1, 1, 1, 0.5, 2, 1, 2, 0.5],
  [1, 2, 1, 1, 1, 0.5, 2, 1, 0.5, 1, 1, 2, 0.5, 1, 1, 1, 1, 1],
  [1, 1, 1, 0.5, 0.5, 0.5, 1, 0.5, 0, 1, 1, 2, 1, 1, 1, 1, 1, 2],
  [1, 1, 0, 2, 1, 2, 0.5, 1, 2, 2, 1, 0.5, 2, 1, 1, 1, 1, 1],
  [1, 0.5, 2, 1, 0.5, 1, 2, 1, 0.5, 2, 1, 1, 1, 1, 2, 1, 1, 1],
  [1, 0.5, 0.5, 0.5, 1, 1, 1, 0.5, 0.5, 0.5, 1, 2, 1, 2, 1, 1, 2, 0.5],
  [0, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 0.5, 1],
  [1, 1, 1, 1, 1, 2, 1, 1, 0.5, 0.5, 0.5, 1, 0.5, 1, 2, 1, 1, 2],
  [1, 1, 1, 1, 1, 0.5, 2, 1, 2, 0.5, 0.5, 2, 1, 1, 2, 0.5, 1, 1],
  [1, 1, 1, 1, 2, 2, 1, 1, 1, 2, 0.5, 0.5, 1, 1, 1, 0.5, 1, 1],
  [1, 1, 0.5, 0.5, 2, 2, 0.5, 1, 0.5, 0.5, 2, 0.5, 1, 1, 1, 0.5, 1, 1],
  [1, 1, 2, 1, 0, 1, 1, 1, 1, 1, 2, 0.5, 0.5, 1, 1, 0.5, 1, 1],
  [1, 2, 1, 2, 1, 1, 1, 1, 0.5, 1, 1, 1, 1, 0.5, 1, 1, 0, 1],
  [1, 1, 2, 1, 2, 1, 1, 1, 0.5, 0.5, 0.5, 2, 1, 1, 0.5, 2, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 0.5, 1, 1, 1, 1, 1, 1, 2, 1, 0],
  [1, 0.5, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 0.5, 0.5],
  [1, 2, 1, 0.5, 1, 1, 1, 1, 0.5, 0.5, 1, 1, 1, 1, 1, 2, 2, 1]
]

export const typesMap: Record<string, { name: string, color: string, id: number }> = {
  normal: { name: 'NORMAL', color: '#A8A878', id: 0 },
  fighting: { name: 'FIGHT', color: '#C03028', id: 1 },
  flying: { name: 'FLYING', color: '#A890F0', id: 2 },
  poison: { name: 'POISON', color: '#A040A0', id: 3 },
  ground: { name: 'GROUND', color: '#E0C068', id: 4 },
  rock: { name: 'ROCK', color: '#B8A038', id: 5 },
  bug: { name: 'BUG', color: '#A8B820', id: 6 },
  ghost: { name: 'GHOST', color: '#705898', id: 7 },
  steel: { name: 'STEEL', color: '#B8B8D0', id: 8 },
  fire: { name: 'FIRE', color: '#F08030', id: 9 },
  water: { name: 'WATER', color: '#6890F0', id: 10 },
  grass: { name: 'GRASS', color: '#78C850', id: 11 },
  electric: { name: 'ELECTR', color: '#F8D030', id: 12 },
  psychic: { name: 'PSYCHC', color: '#F85888', id: 13 },
  ice: { name: 'ICE', color: '#98D8D8', id: 14 },
  dragon: { name: 'DRAGON', color: '#7938F8', id: 15 },
  dark: { name: 'DARK', color: '#705848', id: 16 },
  fairy: { name: 'FAIRY', color: '#F0A8B0', id: 17 }
}

export const pocketMap: Record<string, { color: string, id: number }> = {
  misc: { color: '#E888C0', id: 0 },
  medicine: { color: '#F87840', id: 1 },
  pokeballs: { color: '#E8B828', id: 2 },
  machines: { color: '#A8E848', id: 3 },
  berries: { color: '#40C040', id: 4 },
  mail: { color: '#28D0C8', id: 5 },
  battle: { color: '#5080E8', id: 6 },
  key: { color: '#9858F0', id: 7 }
}

export const natureNameMap: Record<string, string> = {
  attack: 'attack',
  defense: 'defense',
  special_attack: 'spAttack',
  special_defense: 'spDefense',
  speed: 'speed'
}

export const assetsSrc = {
  dialogue: '/assets/interface/battle/dialogueBar.png',
  main: './assets/interface/battle/mainBar.png',
  allyInfo: './assets/interface/battle/allyInfo.png',
  enemyInfo: './assets/interface/battle/enemyInfo.png',
  fight: './assets/interface/battle/fightBar.png',
  bag: './assets/interface/bag/background.png',
  party: './assets/interface/bag/background.png',
  icons: {
    bag: './assets/interface/bag/pocketIcons/backpack.svg',
    misc: './assets/interface/bag/pocketIcons/misc.svg',
    med: './assets/interface/bag/pocketIcons/medicine.svg',
    pok: './assets/interface/bag/pocketIcons/pokeball.svg',
    mach: './assets/interface/bag/pocketIcons/machines.svg',
    berries: './assets/interface/bag/pocketIcons/berries.svg',
    mail: './assets/interface/bag/pocketIcons/mail.svg',
    battle: './assets/interface/bag/pocketIcons/battle.svg',
    keys: './assets/interface/bag/pocketIcons/key.svg'
  }
}
