// Path: src\utils\dataClasses\itemData.ts
// Purpose: To create a class that will hold the data for an item

import { ItemSprite } from "../spritesClasses/itemSprite";
import { ItemData } from "../../types";

/**
 * Clase que se encarga de guardar la informacion de un item
 */
export class Item {
  public id: number;
  public name: string;
  public quantity: number;
  public description: string;
  public shortDesc: string;
  public cost: number;
  public pocket: string;
  public sprite: ItemSprite;
  /**
   * Constructor de la clase Item
   * @param data Datos del item
   */
  constructor(data: ItemData) {
    this.id = data.main.id;
    this.name = data.main.name.toUpperCase().replace("-", "");
    this.quantity = 1;
    this.description = data.main.effect_entries[0].effect;
    this.shortDesc = data.main.effect_entries[0].short_effect;
    this.cost = data.main.cost;
    this.pocket = data.category.pocket.name;
    this.sprite = new ItemSprite({ x: 0, y: 0 }, this.name);
  }

  /**
   * Funcion que se encarga de usar el item
   */
  public use(): void {
    this.quantity--;
  }

  /**
   * Funcion que se encarga de setear el sprite del item
   * @param position Posicion del sprite en el mapa
   */
  public setSprite(position: { x: number; y: number }): void {
    this.sprite = new ItemSprite(position, this.name);
  }
}
