import { getItemData, getPokemonData } from "../getData";
import { PlayerSprite } from "../spritesClasses/playerSprite";
import { Pockets } from "../../types";
import { Item } from "./item";
import { Pokemon } from "./pokemon";

const DEBUG_MODE = process.env.DEBUG_MODE as string;

/**
 * Clase que se encarga de guardar la informacion del jugador
 */
export class Player {
  team: Array<string | number>;
  party: Party;
  bag: Bag;
  sprite: PlayerSprite;
  moving: boolean;
  lastPos: { x: number; y: number } = { x: 0, y: 0 };
  /**
   * Constructor de la clase Player
   */
  constructor() {
    this.team = [341, 10, 2, 52, 144, 109];
    this.party = new Party(this.team);
    this.bag = new Bag();
    this.sprite = new PlayerSprite();
    this.moving = false;
  }

  // public pickUpItem (item: Item): void {
  //   if (this.bag.length < 100) {
  //     this.bag.addItem(item)
  //   } else {
  //     console.log('Bag is full')
  //   }
  // }
}

export class Bag {
  pockets: Pockets;
  quantity: number = 0;
  maxCapacity: number = 25;
  // pocketNames: { [key: number]: { name: string, info: string } }
  constructor() {
    this.pockets = {
      misc: [],
      medicine: [],
      pokeballs: [],
      machines: [],
      berries: [],
      mail: [],
      battle: [],
      key: [],
    };
    // this.pocketNames = {
    //   0: { name: 'misc', info: 'Items' },
    //   1: { name: 'medicine', info: 'Medicine' },
    //   2: { name: 'pokeballs', info: 'Poke Balls' },
    //   3: { name: 'machines', info: 'TMs & HMs' },
    //   4: { name: 'berries', info: 'Berries' },
    //   5: { name: 'mail', info: 'Mail' },
    //   6: { name: 'battle', info: 'Battle Items' },
    //   7: { name: 'key', info: 'Key Items' }
    // }
    this.setItems();
  }

  private async setItems() {
    // Metodo de testeo. Puede usarse para el guardado de personajes. Al poner save, guardar los nombres de los items para ser cargados luego usando este metodo.
    // if (this.quantity === 0) return
    const items = ["potion", "antidote", "poke-ball", "potion"];
    for (let i = 0; i < items.length; i++) {
      let itemData = await getItemData(items[i]);
      let item = new Item(itemData);
      this.addItem(item);
    }
  }

  addItem(item: Item) {
    if (this.quantity === this.maxCapacity && DEBUG_MODE)
      return console.log("Bag is full");

    this.quantity++;
    const pocketName = item.pocket;
    const pocket = this.pockets[pocketName];
    const itemInPocket = pocket.find((i: Item) => i.name === item.name);
    if (itemInPocket) {
      itemInPocket.quantity++;
    } else {
      this.pockets[pocketName].push(item);
    }
  }

  getItems(pocket: string) {
    return this.pockets[pocket];
  }
}

/**
 * Clase que se encarga del manejo de los equipos del player
 */
export class Party {
  private pokemons: Pokemon[];
  private primary: Pokemon;
  private maxCapacity: number = 6;
  constructor(team: Array<string | number>) {
    this.pokemons = [];
    this.primary = this.pokemons[0];
    this.setTeam(team);
  }

  /**
   * Metodo que se encarga de crear el equipo del player
   * @param names Nombres de los pokemon
   */
  private async setTeam(names: Array<string | number>): Promise<void> {
    for (let i = 0; i < names.length; i++) {
      const data = await getPokemonData(names[i]);
      const pokemon = new Pokemon(data);
      this.pokemons.push(pokemon);
    }
    this.primary = this.pokemons[0];
  }

  /**
   * Metodo que se encarga de cambiar el pokemon principal
   * @param pokemon Pokemon a cambiar
   */
  public switchFirstPokemon(pokemon: Pokemon): void {
    const index = this.pokemons.indexOf(pokemon);
    if (index === -1) return;
    this.pokemons.splice(index, 1); // Eliminar el Pokémon de su posición actual
    this.pokemons.unshift(pokemon); // Moverlo al principio
    this.primary = pokemon;
  }

  addPokemon(pokemon: Pokemon) {
    if (this.maxCapacity === 6) return;
    this.pokemons.push(pokemon);
  }

  getPokemons() {
    return this.pokemons;
  }

  getPrimary() {
    return this.primary;
  }

  getLenght() {
    return this.pokemons.length;
  }

  getNextPokemon(): Pokemon | undefined {
    return this.pokemons.find((pokemon) => pokemon.currentHp > 0);
  }
}
