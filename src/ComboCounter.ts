export class ComboCounter extends g.E {
    DEFAULT_SCALE: number = 0.5;


    label: g.Label;
    background: g.FilledRect;

    liveCount: number = 0;
    comboCount: number = 0;

    constructor(param: g.EParameterObject) {
        super(param);
        const font = new g.DynamicFont({game: g.game, fontFamily: g.FontFamily.Serif, size: 40});
        this.label = new g.Label({scene: param.scene, font, text: "", fontSize: 40});
        this.background = new g.FilledRect({
            scene: param.scene,
            cssColor: "rgba(192,192,192,0.5)",
            width: this.label.width,
            height: this.label.height
        });
        this.append(this.background);
        this.append(this.label);
        this.width = this.background.width;
        this.height = this.background.height;
        this.scale(this.DEFAULT_SCALE);
        this.update.add(() => {
            this.onUpdate();
        });
    }

    setCombo(count: number = 0): void {
        this.comboCount = count;
        this.label.text = this.getComboText(count);
        this.background.width = this.label.width;
        this.background.height = this.label.height;
    }

    getComboText(count: number): string {
        return `${count}HIT!`;
    }

    onUpdate(): void {
        if (this.liveCount % 5 != 0 && this.comboCount > 0) {
            this.show();
        } else {
            this.hide();
        }
        this.scale(Math.min(this.DEFAULT_SCALE + (this.comboCount * 0.05), 2.0));
        this.modified();
        this.label.invalidate();

        this.liveCount++;
    }


}