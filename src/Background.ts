export class Background extends g.E {
    background: g.FilledRect | undefined;
    DEFAULT_COLOR = "rgba(128,128,128,0.8)";

    constructor(param: g.EParameterObject) {
        super(param);
        this.background = new g.FilledRect({
            scene: param.scene,
            cssColor: this.DEFAULT_COLOR,
            width: g.game.width,
            height: g.game.height
        });
        this.append(this.background);
        this.width = this.background.width;
        this.height = this.background.height;
    }

    startDamagedEffect(): void {
        this.background.cssColor = "rgba(192,0,0,0.8)";
        this.modified();
    }

    stopDamagedEffect(): void {
        this.background.cssColor = this.DEFAULT_COLOR;
        this.modified();
    }
}