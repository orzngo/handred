// Enemy Factory

import {Enemy} from "./Enemy";
import {NuClearFlame} from "../NuclearFlame";

export class Seikimatsu {
    enemies = ["hage", "mohikan", "katapad"];

    constructor(public scene: g.Scene) {

    }

    fromLevel(level: number): Enemy {
        if (level >= this.enemies.length) {
            throw new NuClearFlame("非対応レベル");
        }
        return new Enemy({scene: this.scene, src: this.scene.assets[this.enemies[level]]}, level);
    }

}