import {Seikimatsu} from "../enemy/Seikimatsu";
import {Enemy} from "../enemy/Enemy";
import {Chance} from "../chance/Chance";
import {NorthStartFist} from "../chance/NorthStarFist";

export class FightScene extends g.Scene {
    currentEnemy: Enemy | undefined;
    currentChances: Chance[] | undefined;
    enemyFactory: Seikimatsu;
    chanceFactory: NorthStartFist;

    isRunning: boolean = false;
    hitChance: boolean = false;
    hitFake: Boolean = false;

    constructor() {
        super({
            game: g.game,
            assetIds: Seikimatsu.enemies
        });
        this.enemyFactory = new Seikimatsu(this);
        this.chanceFactory = new NorthStartFist(g.game, this);

        this.loaded.add(() => {
            this.initialize();
        });
    }

    initialize(): void {
        this.game.vars.GameState = {score: 0};
        this.update.add(() => {
            this.mainLoop();
        });
        this.pointDownCapture.add((e) => {
            this.onClick(e);
        });
    }

    mainLoop(): void {
        if (!this.currentEnemy) {
            this.createEnemy();
            this.createChances();
            this.isRunning = true;
        }

        if (this.hitChance) {
            this.attack();
        }

        if (this.hitFake) {
            this.damage();
        }

        if ((this.hitChance || this.hitFake) && this.currentEnemy.hp > 0) {
            this.createChances();
        }

        this.hitChance = false;
        this.hitFake = false;
    }

    onClick(e: g.PointDownEvent): void {
        if (!this.isRunning) {
            return;
        }
        if (!this.currentEnemy || !this.currentChances) {
            return;
        }
        this.hitCheck(e.point);
    }

    hitCheck(point: { x: number, y: number }): void {
        // 雑な当たり判定
        this.hitFake = true;
        this.currentChances.forEach((chance) => {
            if (chance.isFake) {
                return;
            }
            if (point.x >= chance.x && point.x <= chance.x + chance.width) {
                if (point.y >= chance.y && point.y <= chance.y + chance.height) {
                    this.hitFake = false;
                }
            }
        });
        this.hitChance = !this.hitFake;
    }

    attack(): void {

    }

    damage(): void {

    }


    createEnemy(): void {
        this.currentEnemy = this.enemyFactory.fromLevel(0);
        this.currentEnemy.x = (this.game.width / 2) - this.currentEnemy.width / 2;
        this.append(this.currentEnemy);
    }

    createChances(): void {
        if (this.currentChances) {
            this.removeChances();
        }

        this.currentChances = this.chanceFactory.getChancesFromEnemy(this.currentEnemy);
        this.currentChances.forEach((chance) => {
            this.append(chance);
        });
    }

    removeChances(): void {
        if (!this.currentChances) {
            return;
        }
        this.currentChances.forEach((chance) => {
            chance.destroy();
        });
        this.currentChances = undefined;
    }

}