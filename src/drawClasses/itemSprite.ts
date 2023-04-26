import { Sprite } from "../types";

export class ItemSprite implements Sprite {
    public position: { x: number, y: number };
    public imageDir: string;
    public image: HTMLImageElement;
    public width: number;
    public height: number;

    constructor(position: { x: number, y: number }, itemName: string) {
        this.position = position;
        this.imageDir = `./assets/sprites/items/${itemName}.png`;
        this.width = 0;
        this.height = 0;
        this.image = new Image();
        this.image.src = this.imageDir;
        this.image.onload = () => {
            this.width = this.image.width;
            this.height = this.image.height;
        }
    }
}