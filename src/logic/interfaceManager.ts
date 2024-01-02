import { Game } from "./game"
import { dialogues } from "../utils/constants"
import { format } from "../utils/functions"


/**
 * Clase que se encarga de la interfaz
 */
export class InterfaceManager {
  game: Game
  setInterfaceVisible: React.Dispatch<React.SetStateAction<number>>
  setInterfaceState: React.Dispatch<React.SetStateAction<number>>
  public dialogueQueue: string[] = []
  public actionQueue: Function[] = []
  private menuText: string = ''
  /**
   * Constructor de la clase InterfaceManager
   * @param game Instancia de la clase Game
   * @param interfaceVisible Setter de la visibilidad de la interfaz
   * @param interfaceState Setter del estado de la interfaz
   */
  constructor(game: Game, interfaceVisible: React.Dispatch<React.SetStateAction<number>>, interfaceState: React.Dispatch<React.SetStateAction<number>>) {
    this.game = game
    this.setInterfaceVisible = interfaceVisible
    this.setInterfaceState = interfaceState
  }

  /**
   * Funcion getter de la instancia de la clase Battle
   * @returns La instancia de la clase Battle
   */
  getBattle() {
    return this.game.battle
  }

  /**
   * Funcion setter de la instancia de la clase Battle.
   */
  setBattle() {
    if (this.game.battle === null) throw new Error('Battle is not created')
    this.menuText = format(dialogues.menuDialogue, [this.game.battle.ally.name])
  }

  /**
   * Funcion que retorna el primer texto de la cola de dialogos
   * @returns Dialogo de la cola de dialogos
   */
  getDialogue(): string {
    const text = this.dialogueQueue.shift()
    if (text) return text
    else return ''
  }

  /**
   * Funcion que ejecuta la primera accion de la cola de acciones
   * @returns False si la cola de dialogos esta vacia
   */
  playAction() {
    if (this.actionQueue.length === 0) return
    this.actionQueue[0]() // Ejecuta la funcion
    this.actionQueue.shift() // La quita de la lista. No puedo ejecutarla porque capaz devuelve Undefined
  }

  /**
   * Funcion que agrega un dialogo a la cola de dialogos
   * @param dialogue Dialogo a agregar a la cola de dialogos
   */
  addDialogue(dialogue: string) {
    this.dialogueQueue.push(dialogue)
  } 

  /**
   * Funcion que agrega una accion a la cola de acciones
   * @param action Accion a agregar a la cola de acciones
   */
  addAction(action: void) { // Por ahora no la uso
    this.actionQueue.push(() => action)
  }

  /**
   * Funcion que retona el texto del menu
   * @returns El texto del menu
   */
  getMenuText() {
    return this.menuText
  }

  /**
   * Funcion que se encarga de salir y finalizar la batalla
   */
  quitBattle() {
    if (this.game.battle === null) throw new Error('Battle is not created')

    this.clearActionQueue()
    this.clearDialogueQueue()
    this.setInterfaceState(0)
    this.setInterfaceVisible(0) 
    this.game.battle.stop()
    this.game.battle = null
    this.game.start()
  }

  /**
   * Funcion que es encarga de retornar los movimientos del pokemon aliado
   * @returns Los movimientos del pokemon aliado
   */
  getAllyMoves() {
    if (this.game.battle === null) throw new Error('Battle is not created')

    return this.game.battle.ally.getMoves()
  }

  /**
   * Funcion que es encarga de retornar los movimientos del pokemon enemigo
   * @returns Los movimientos del pokemon enemigo
   */
  getEnemyMoves() {
    if (this.game.battle === null) throw new Error('Battle is not created')

    return this.game.battle.enemy.getMoves()
  }

  /**
   * Funcion que se encarga de limpiar la cola de acciones
   */
  clearActionQueue() {
    this.actionQueue = []
  }

  /**
   * Funcion que se encarga de limpiar la cola de dialogos
   */
  clearDialogueQueue() {
    this.dialogueQueue = []
  }

}