export class Enemy extends g.Sprite {
    constructor(param: g.SpriteParameterObject, public level: number = 0) {
        super(param);
    }
}