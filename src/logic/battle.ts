import { CANVAS_HEIGHT, CANVAS_WIDTH, dialogues } from "../utils/constants";
import { Engine } from "./engine";
import { Game } from "./game";
import { Player } from "./player";
import { Pokemon } from "./pokemon";
import { format } from "../utils/functions";
import { PokemonSprite } from "../spritesClasses/pokemonSprite";
import { MoveSprite } from "../spritesClasses/moveSprite";

/**
 * Clase que se encarga de la batalla
 */
export class Battle {
  private animationFrame: number = 0
  public game: Game
  private ctx: CanvasRenderingContext2D
  private renders: (PokemonSprite | MoveSprite)[] = []
  private player: Player
  public ally: Pokemon
  private opponent: Pokemon | Player
  public enemy: Pokemon
  private field: HTMLImageElement
  public engine: Engine
  /**
   * Constructor de la clase Battle
   * @param game Instancia de la clase Game
   * @param opponent Oponente de la batalla
   */
  constructor(game: Game, opponent: Pokemon | Player) {
    this.game = game
    this.ctx = game.getCtx()
    this.field = game.getActualMap().fieldImg
    this.player = game.getPlayer()
    this.ally = this.player.team.primary
    this.opponent = opponent
    if (this.opponent instanceof Pokemon ) {
      this.enemy = this.opponent // Encuentro salvaje
    } else {
      this.enemy = this.opponent.team.primary // Entrenador
    }
    this.engine = new Engine(this)
  }

  /**
   * Funcion que se encarga de comenzar el loop de la batalla (necesario para animaciones) TODO: Es necesaria para las animaciones?
   */
  loop(): void {
    this.animationFrame = window.requestAnimationFrame(this.loop.bind(this))
    this.ctx.drawImage(this.field, 0, 0)
    this.renders.forEach((render) => {
      render.draw(this.ctx)
    } )
  }

  /**
   * Funcion que se encarga de iniciar y setear lo necesario para la batalla
   */
  start(): void {
    // Activar interface
    this.game.interfaceManager.setInterfaceVisible(1)
    this.game.interfaceManager.setInterfaceState(1)
    // Iniciar elementos renderizables
    this.renders = [this.ally.mainSprite, this.enemy.mainSprite]

    this.game.animationManager.blackScreenOut()
    // animacion enemigo
    this.game.animationManager.enemyEntryAnimation()
    this.game.interfaceManager.addDialogue(format(dialogues.introDialogue, [this.enemy.name]))
    // animacion aliado
    this.game.interfaceManager.actionQueue.push(() => { this.game.animationManager.allyAnimateEntry() })
    this.game.interfaceManager.addDialogue(format(dialogues.intro2Dialogue, [this.ally.name]))

    this.loop()
  }

  /**
   * Funcion que se encarga de detener la batalla
   */
  stop(): void {
    window.cancelAnimationFrame(this.animationFrame)
    this.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  }
}