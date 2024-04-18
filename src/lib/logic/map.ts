import { MapInfo } from "../../types";
import { Boundary } from "../classes";
import { TILESIZE } from "../config";

/**
 * Clase que se encarga de guardar y configurar la informacion de un mapa
 */
export class _Map_ {
  // public name: string = ''
  public offset: { x: number; y: number } = { x: 0, y: 0 };
  public backImg: HTMLImageElement = new Image();
  public foreImg: HTMLImageElement = new Image();
  public fieldImg: HTMLImageElement = new Image();
  public possibleItems: string[] = [""];
  public possiblePokemon: string[] = [""];
  // private itemArray: number[] = [0]
  private collisionArray: number[] = [0];
  private battleZoneArray: number[] = [0];
  public collisionBoundaries: Boundary[] = [];
  public battleZoneBoundaries: Boundary[] = [];
  /**
   * Constructor de la clase _Map_
   * @param info Informacion del mapa
   */
  constructor(info: MapInfo) {
    this.offset = info.offset;
    this.backImg.src = info.backImg;
    this.foreImg.src = info.foreImg;
    this.fieldImg.src = info.fieldImg;
    this.possibleItems = info.possibleItems;
    this.possiblePokemon = info.possiblePokemon;
    // this.itemArray = info.itemArray
    this.collisionArray = info.collisionArray;
    this.battleZoneArray = info.battleZoneArray;
    this.collisionBoundaries = this.mapCollisionsArrays(this.collisionArray);
    this.battleZoneBoundaries = this.mapCollisionsArrays(this.battleZoneArray);
  }

  /**
   * Funcion que se encarga de mapear un array de colisiones a un array de instancias de la clase Boundary
   * @param array Array de colisiones
   * @returns Array de instancias de la clase Boundary
   */
  mapCollisionsArrays(array: number[]): Boundary[] {
    const map: number[][] = [];
    const list: Boundary[] = [];
    for (let i = 0; i < array.length; i += TILESIZE) {
      map.push(array.slice(i, i + TILESIZE));
    }
    map.forEach((row: number[], i: number) => {
      row.forEach((value: number, j: number) => {
        if (value === 14759) {
          list.push(
            new Boundary({
              x: j * TILESIZE + this.offset.x,
              y: i * TILESIZE + this.offset.y,
            })
          );
        }
      });
    });
    return list;
  }

  /**
   * Funcion que se encarga de chequear si hay colision entre dos rectangulos
   * @param rect1 Primer rectangulo a comparar
   * @param rect2 Segundo rectangulo a comparar
   * @returns Booleano que indica si hay colision
   */
  checkCollision(
    rect1: {
      position: { x: number; y: number };
      width: number;
      height: number;
    },
    rect2: { position: { x: number; y: number }; width: number; height: number }
  ): boolean {
    return (
      rect1.position.x + rect1.width >= rect2.position.x && // derecha
      rect1.position.x <= rect2.position.x + TILESIZE && // izquierda
      rect1.position.y <= rect2.position.y && // arriba
      rect1.position.y + rect1.height >= rect2.position.y
    ); // abajo
  }
}
