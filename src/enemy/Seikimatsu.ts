// Enemy Factory

import {Enemy} from "./Enemy";
import {NuClearFlame} from "../NuclearFlame";

export class Seikimatsu {
    static enemies = ["hage", "mohikan", "katapad", "katapad", "katapad", "katapad"];

    constructor(public scene: g.Scene) {

    }

    fromLevel(level: number): Enemy {
        if (level >= Seikimatsu.enemies.length) {
            throw new NuClearFlame("非対応レベル");
        }
        return new Enemy({scene: this.scene, src: this.scene.assets[Seikimatsu.enemies[level]]}, level);
    }

    get maxLevel(): number {
        return Seikimatsu.enemies.length;
    }

}