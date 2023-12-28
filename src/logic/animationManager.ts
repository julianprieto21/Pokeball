import { gsap } from "gsap"
import { PokemonSprite } from "../spritesClasses/pokemonSprite"
import { Game } from "./game"
import { CANVAS_WIDTH } from "../utils/constants"

/**
* Clase que se encarga de las animaciones 
*/
export class AnimationManager {
  game: Game
  tl: gsap.core.Timeline
  allySprite: PokemonSprite | undefined
  enemySprite: PokemonSprite | undefined
  /**
   * Constructor de la clase AnimationManager
   * @param game Instancia de la clase Game
   */
  constructor(game: Game) {
    this.game = game
    this.tl = gsap.timeline()
  }

  /**
   * Funcion que se encarga de setear los sprites de los pokemon una vez instanciada la batalla
   */
  setBattle() {
    if (this.game.battle === null) throw new Error('Battle is not created')

    this.allySprite = this.game.battle.ally.mainSprite
    this.enemySprite = this.game.battle.enemy.mainSprite
  }

  /**
   * Funcion que se encarga de animar la entrada del pokemon aliado
   */
  allyAnimateEntry() {
    if (!this.allySprite || !this.enemySprite) throw new Error('Sprites are not set')

    this.tl.to(this.allySprite.position, { 
      x: 100, 
      duration: 1, 
      onStart: () => { this.game.canClick = false } , 
      onComplete: () => { this.game.canClick = true }  })
    
  }

  /**
   * Funcion que se encarga de animar la entrada del pokemon enemigo
   */
  enemyEntryAnimation() {
    if (!this.enemySprite) throw new Error('Sprites are not set')

    this.tl.to(this.enemySprite.position, { 
      x: 580, 
      duration: 1, 
      onStart: () => { this.game.canClick = false } , 
      onComplete: () => { this.game.canClick = true } })
  }

  /**
   * Funcion que se encarga de animar la debilitacion de un pokemon
   * @param sprite Sprite del pokemon que perdió
   */
  animateFaint(sprite: PokemonSprite) {
    this.tl
      .to(sprite.position, {
        y: sprite.position.y + 20,
        onStart: () => { this.game.canClick = false }
      })
      .to(sprite, {
        opacity: 0,
        onComplete: () => { this.game.canClick = true }
      }, '<')
  }

  /**
   * Funcion que se encarga de animar la barra de vida de un pokemon
   * @param isEnemy Flag que indica si el pokemon que recibe el daño es enemigo o aliado
   * @param healthPercentage Porcentaje de vida que le queda al pokemon
   */
  animateHealthBar(isEnemy: boolean, healthPercentage: number) {
    const team = isEnemy ? 'enemy' : 'ally'
    const healthBarId = '#' + team + '-current-health-bar'

    this.tl.to( healthBarId, {
      width: `${healthPercentage}%`,
      duration: 0.5
    }, '<')
  }

  /**
   * Funcion que se encarga de animar el movimiento de un pokemon
   * @param user Pokemon que realiza el movimiento
   * @param target Pokemon que recibe el movimiento
   * @param xMove Cantidad de pixeles que se mueve el pokemon (depende de si es aliado o enemigo)
   * @param healthPercentage Porcentaje de vida que le queda al pokemon
   */
  animateMove(user: PokemonSprite, target: PokemonSprite, xMove: number, healthPercentage: number) {
    this.tl
          .to(user.position, {
            x: user.position.x - xMove,
            onStart: () => { this.game.canClick = false } ,
          })
          .to(user.position, {
            x: user.position.x + xMove * 2,
            duration: 0.1,
            onComplete: () => {
             this.animateDamage(target)
             this.animateHealthBar(target.isEnemy, healthPercentage)
            }
          })
          .to(user.position, {
            x: user.position.x,
            onComplete: () => { this.game.canClick = true }
          })
  }

  /**
   * Funcion que se encarga de animar al pokemon que recibe el daño
   * @param target Pokemon que recibe el daño
   */
  animateDamage(target: PokemonSprite) {
    this.tl
        .to(target.position, {
          x: target.position.x + 10,
          yoyo: true,
          repeat: 3,
          duration: 0.09
        }, '<')
        .to(target, {
          opacity: 0.4,
          yoyo: true,
          repeat: 3,
          duration: 0.09
        }, '<')
  }

  /**
   * Funcion que se encarga de hacer aparecer la pantalla negra
   */
  blackScreenIn() {
    console.log('black screen in')
    this.tl.to('.black-screen', {
      display: 'block',
      opacity: 1,
      duration: 0.5,
      yoyo: true,
      repeat: 4,
      onComplete: () => {
        this.game.battle!.start() }
      
    })
  }

  /**
   * Funcion que se encarga de hacer desaparecer la pantalla negra
   */
  blackScreenOut() {
    this.tl.to('.black-screen', {
      display: 'none',
      opacity: 0,
      duration: 0.5,
      onComplete: () => {}
    })
  }

  /**
   * Funcion que se encarga de animar la retirada de un pokemon
   * @param sprite Sprite del pokemon que se retira
   */
  retreatAnimation(sprite: PokemonSprite) {
    const moveX = sprite.isEnemy ? CANVAS_WIDTH : -400
    this.tl.to(sprite.position, {
      x: moveX,
      duration: 1,
      onComplete: () => { this.game.interfaceManager.quitBattle() }
    })
  }

  /**
   * Funcion que se encarga de animar la experiencia que recibe el pokemon aliado
   * @param xp Cantidad de experiencia que recibe el pokemon
   */
  animateExperience(xp: number) {
    let xpLeft = 0
    if (xp > 100) {
      xpLeft = xp - 100
      xp = 100
    }
    this.tl.to('#ally-current-experience-bar', {
      width: xp + '%',
      duration: 1,
      onStart: () => { this.game.canClick = false },
      onComplete: () => {
        window.document.getElementById('level')!.innerText = 'Lv' + this.game.battle!.ally!.level
        if (xpLeft > 0) {
          this.animateExperience(xpLeft)
          window.document.getElementById('ally-current-experience-bar')!.style.width = '0%' // TODO: Hacer mas REACT
        } else {
          this.game.canClick = true
        }
      }
    })
  }
}





