import {Chance} from "./Chance";
import {Enemy} from "../enemy/Enemy";

// Chance Factory

export class NorthStartFist {

    font: g.DynamicFont;

    constructor(public game: g.Game, public scene: g.Scene) {
        this.font = new g.DynamicFont({game: g.game, fontFamily: g.FontFamily.Serif, size: 40});
    }

    /**
     * 敵のスキを見つけ出すがたまにフェイントに引っかかる
     *
     * @param {Enemy} enemy
     * @returns {Chance}
     */
    getChancesFromEnemy(enemy: Enemy): Chance[] {
        const chanceNum = this.game.random.get(1, 3 + enemy.level);

        const fakeChance = 10 - (enemy.level + 1);

        let results: Chance[] = [];
        for (let i = 0; i < chanceNum; i++) {
            let isFake = false;
            if (i > 0) {
                isFake = this.game.random.get(0, 9) >= fakeChance;
            }
            const chance = this.getChance(isFake);
            chance.x = this.game.random.get(enemy.x, enemy.width - chance.width);
            chance.y = this.game.random.get(enemy.y, enemy.height - chance.height);
            results.push(chance);
        }
        return results;
    }

    getChance(isFake: boolean = false): Chance {
        return new Chance({scene: this.scene}, this.font, isFake);
    }
}