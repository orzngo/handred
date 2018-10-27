// 隙
export class Chance extends g.E {
    static chances:string[][] = [
        ["スキ", "スギ", "ヌキ", "又キ", "好き", "ズキ"],
        ["隙", "障", "除"],
        ["Chance", "Charge", "Change", "Chan"]
    ];

    text:string;

    static getText(isFake:boolean):string {
        if (!isFake) {
            return Chance.chances[0][0];
        }
        return Chance.chances[0][g.game.random.get(1, 5)];

    }

    constructor(param: g.EParameterObject, font:g.Font, public isFake: boolean = false) {
        super(param);

        const rect = new g.FilledRect({scene:param.scene, width:80, height:80, cssColor:"white"});
        this.append(rect);
        this.text = Chance.getText(isFake);
        const label = new g.Label({scene:param.scene, font, text:this.text, fontSize:40});
        this.append(label);
        label.y = 20;
    }
}