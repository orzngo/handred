export class Enemy extends g.Sprite {
    public hp: number;

    constructor(param: g.SpriteParameterObject, public level: number = 0) {
        super(param);
        this.hp = 1 + (level * 3) + g.game.random.get(0, 2) + g.game.random.get(0, level * 2);
    }
}