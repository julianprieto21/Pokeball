import { PlayerSprite } from "../spritesClasses/playerSprite"
import { Team } from "../utils/classes"

/**
 * Clase que se encarga de guardar la informacion del jugador
 */
export class Player {
  teamNames: Array<string | number>
  team: Team
  // party: Party
  // bag: Bag
  sprite: PlayerSprite
  moving: boolean
  lastPos: { x: number, y: number } = { x: 0, y: 0 }
  /**
   * Constructor de la clase Player
   */
  constructor () {
    this.teamNames = ['charizard']
    this.team = new Team(this.teamNames)
    // this.party = new Party(this.team)
    // this.bag = new Bag()
    this.sprite = new PlayerSprite()
    this.moving = false
  }

  // public pickUpItem (item: Item): void {
  //   if (this.bag.length < 100) {
  //     this.bag.addItem(item)
  //   } else {
  //     console.log('Bag is full')
  //   }
  // }
}