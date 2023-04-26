import { Sprite } from "../types";

export class PokemonSprite implements Sprite {
    public position: { x: number, y: number };
    public imageDir: string;
    public image: HTMLImageElement;
    public width: number;
    public height: number;
    public isEnemy: boolean;
    public opacity: number;

    constructor(id: number, isEnemy: boolean) {
        // TODO: Cambiar posicion segun isEnemy
        this.position = isEnemy ? { x: 580, y: -20 } : { x: 100, y: 110 };
        this.imageDir = isEnemy ? `./assets/sprites/pokemon/front/${id}.png` : `./assets/sprites/pokemon/back/${id}.png`;
        this.width = 0;
        this.height = 0;
        this.isEnemy = isEnemy;
        this.image = new Image();
        this.image.src = this.imageDir;
        this.image.onload = () => {
            this.width = this.image.width;
            this.height = this.image.height;
        }
        this.opacity = 1;
    }
    draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.drawImage(this.image, this.position.x, this.position.y);
        ctx.restore();
    }
}