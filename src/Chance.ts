// 隙
export class Chance extends g.E {
    static chances = ["スキ", "隙", "Chance"];
    static fakes = ["スギ", "ヌキ", "又キ", "好き", "ズキ", "障", "Change", "Charge", "ジャギ", "Chan", "Chace", "除"];

    constructor(param: g.EParameterObject, public fake: boolean = false) {
        super(param);
    }
}