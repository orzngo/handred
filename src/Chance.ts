// 隙
export class Chance extends g.E {
    static chances:string[][] = [
        ["スキ", "スギ", "ヌキ", "又キ", "好き", "ズキ"],
        ["隙", "障", "除"],
        ["Chance", "Charge", "Change", "Chan"]
    ];

    text:string;

    static getText(fake:boolean):string {
        if (!fake) {
            return Chance.chances[0][0];
        }
        return Chance.chances[0][g.game.random.get(1, 5)];

    }

    constructor(param: g.EParameterObject, font:g.Font, scene:g.Scene, public fake: boolean = false) {
        super(param);

        const rect = new g.FilledRect({scene, width:80, height:80, cssColor:"white"});
        this.append(rect);
        this.text = Chance.getText(fake);
        const label = new g.Label({scene, font, text:this.text, fontSize:40});
        this.append(label);
        label.y = 20;
    }
}