import { Sprite } from "../types";

export class PlayerSprite implements Sprite {
    public position: { x: number, y: number };
    public imageDir: string
    public imagePaths: { up: string, left: string, down: string, right: string };
    public image: HTMLImageElement;
    public width: number;
    public height: number;
    public isEnemy: boolean;
    public frames: { max: number, hold: number, val: number, elapsed: number };
    public animate: boolean;
    MAX_FRAMES = 4;
    HOLD_FRAMES = 10;
    SPEED = 5;

    constructor() {
        this.position = { x: 0, y: 0 };
        this.imageDir = `./assets/sprites/player/main/down.png`;
        this.imagePaths = {
            up: `./assets/sprites/player/main/up.png`, left: `./assets/sprites/player/main/left.png`,
            down: `./assets/sprites/player/main/down.png`, right: `./assets/sprites/player/main/right.png`
        };
        this.width = 0;
        this.height = 0;
        this.isEnemy = false;
        this.frames = { max: this.MAX_FRAMES, hold: this.HOLD_FRAMES, val: 0, elapsed: 0 };
        this.animate = false;
        this.image = new Image();
        this.image.src = this.imageDir;
        this.image.onload = () => {
            this.width = this.image.width / this.frames.max;
            this.height = this.image.height;
            this.position = { x: 1024 / 2 - this.image.width / 4 / 2, y: 576 / 2 - this.image.height / 2 };
        }
    }
    draw(ctx: CanvasRenderingContext2D) {
        // console.log(this.width, this.height)
        ctx.drawImage(
            this.image,
            this.frames.val * this.width,  // Sx
            0,  // Sy
            this.width,  // Sw
            this.height,  // Sh
            this.position.x,  // Dx
            this.position.y,  //Dy
            this.width,  // Dw
            this.height  // Dh
        );
        if (!this.animate) return;
        if (this.frames.max > 1) {
            this.frames.elapsed++;
        }
        if (this.frames.elapsed % this.frames.hold === 0) {
            if (this.frames.val < this.frames.max - 1) this.frames.val++;
            else this.frames.val = 0;
        }
    }
}