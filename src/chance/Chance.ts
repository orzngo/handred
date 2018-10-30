// 隙
export class Chance extends g.E {
    static chances: string[][] = [
        ["スキ", "スギ", "ヌキ", "又キ", "好き", "ズキ"],
        ["隙", "障", "除"],
        ["Chance", "Charge", "Change", "Chan"]
    ];

    text: string;
    width: number;
    height: number;
    isHit: boolean = false;
    isAnalyzed: boolean = false;
    liveCount: number = 0;

    background: g.FilledRect | undefined;

    static getText(isFake: boolean): string {
        if (!isFake) {
            return Chance.chances[0][0];
        }
        return Chance.chances[0][g.game.random.get(1, 5)];

    }

    constructor(param: g.EParameterObject, font: g.Font, public isFake: boolean = false) {
        super(param);

        this.background = new g.FilledRect({scene: param.scene, width: 100, height: 100, cssColor: "white"});
        this.append(this.background);
        this.text = Chance.getText(isFake);
        const label = new g.Label({scene: param.scene, font, text: this.text, fontSize: 50});
        this.append(label);
        label.y = 25;
        label.x = 0;
        this.width = this.background.width;
        this.height = this.background.height;

        this.update.add(() => {
            this.onUpdate();
        });
    }

    hit(): void {
        this.isHit = true;
        this.background.cssColor = "#aaaa00";
        this.background.modified();
    }

    onUpdate(): void {
        if (this.liveCount === 45 && !this.isHit) {
            this.isAnalyzed = true;
            if (this.isFake) {
                this.background.cssColor = "#330000";
            } else {
                this.background.cssColor = "#44FF77";
            }
            this.background.modified();
        } else if (this.isHit) {
            if (this.liveCount % 10 < 4) {
                this.background.cssColor = "#aaaa00";
            } else {
                this.background.cssColor = "white";
            }
            this.background.modified();
        }
        this.liveCount++;
    }


}