// 最初に出てくる説明

export class ChibaShigeru extends g.E {
    progressBar: g.FilledRect;
    liveCount: number = 0;

    constructor(param: g.EParameterObject, public frameLength: number) {
        super(param);

        this.append(new g.FilledRect({
            scene: param.scene,
            cssColor: "rgba(192,192,192,0.9)",
            width: g.game.width,
            height: g.game.height
        }));
        this.width = g.game.width;
        this.height = g.game.height;

        const font = new g.DynamicFont({game: g.game, fontFamily: g.FontFamily.Serif, size: 40});
        const manual = new g.Label({scene: param.scene, font, text: "スキを突いて", fontSize: 100});
        const manual2 = new g.Label({scene: param.scene, font, text: "やっつけろ！", fontSize: 100});
        manual.y = (this.height / 2) - 100;
        manual2.y = manual.y + 100;

        this.append(manual);
        this.append(manual2);

        this.progressBar = new g.FilledRect({
            scene: param.scene,
            cssColor: "rgba(255,255,0,1)",
            width: this.width,
            height: 50
        });
        this.progressBar.y = this.height - 50;
        this.append(this.progressBar);

        this.update.add(() => {
            this.onUpdate();
        });
    }

    onUpdate(): void {
        if (this.liveCount < this.frameLength) {
            this.progressBar.width = (this.width * (this.frameLength - this.liveCount)) / this.frameLength;
            this.progressBar.modified();
        } else if (this.liveCount === this.frameLength) {
            this.destroy();
        }
        this.liveCount++;
    }

}