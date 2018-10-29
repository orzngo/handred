import {Seikimatsu} from "../enemy/Seikimatsu";
import {Enemy} from "../enemy/Enemy";
import {Chance} from "../chance/Chance";
import {NorthStartFist} from "../chance/NorthStarFist";

declare var console: any;

export class FightScene extends g.Scene {
    currentEnemy: Enemy | undefined;
    currentChances: Chance[] | undefined;
    scoreLabel: g.Label | undefined;
    background: g.FilledRect | undefined;


    enemyFactory: Seikimatsu;
    chanceFactory: NorthStartFist;

    isRunning: boolean = false;

    hitChance: boolean = false;
    hitFake: Boolean = false;

    comboCount: number = 0;
    freezeCount: number = 0;
    enemyDyingCount: number = 0;

    killCount: number = 0;


    constructor() {
        super({
            game: g.game,
            assetIds: Seikimatsu.enemies.concat(["bell", "hit1", "hit2", "hit3"])
        });
        this.enemyFactory = new Seikimatsu(this);
        this.chanceFactory = new NorthStartFist(g.game, this);
        this.loaded.add(() => {
            this.initialize();
        });
    }

    initialize(): void {
        this.game.vars.GameState = {score: 0};
        this.background = new g.FilledRect({
            scene: this,
            cssColor: "gray",
            width: this.game.width,
            height: this.game.height
        });
        this.append(this.background);
        // TODO: アプリ全体で使い回す？
        const font = new g.DynamicFont({game: g.game, fontFamily: g.FontFamily.Serif, size: 40});
        this.scoreLabel = new g.Label({scene: this, font, text: this.getScoreText(), fontSize: 40});
        this.scoreLabel.y = 0;
        this.append(this.scoreLabel);

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

        if (this.hitChance && this.currentEnemy.hp > 0) {
            this.createChances();
        }

        if (this.currentEnemy.hp <= 0 && this.enemyDyingCount <= 0) {
            (this.assets["hit3"] as g.AudioAsset).play();
            this.enemyDyingCount = 10;
            this.removeChances();
        }

        if (this.enemyDyingCount > 0) {
            this.currentEnemy.scale(this.enemyDyingCount / 10);
            this.currentEnemy.modified();
        }

        if (this.enemyDyingCount === 1) {
            this.removeEnemy();
        }


        this.hitChance = false;
        this.hitFake = false;
        if (this.freezeCount === 1) {
            this.background.cssColor = "gray";
            this.background.modified();
            this.currentEnemy.scale(1);
            this.createChances();
        } else if (this.freezeCount > 0) {
            this.currentEnemy.scale(1.2);
            this.currentEnemy.modified();
        }
        this.freezeCount--;
        this.enemyDyingCount--;
    }

    onClick(e: g.PointDownEvent): void {
        if (!this.isRunning || this.freezeCount > 0) {
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
            if (!chance.isFake) {
                if (point.x >= chance.x && point.x <= chance.x + chance.width) {
                    if (point.y >= chance.y && point.y <= chance.y + chance.height) {
                        this.hitFake = false;
                    }
                }
            }
        });
        this.hitChance = !this.hitFake;
        console.log(this.hitChance, this.hitFake);
    }

    attack(): void {
        (this.assets["hit2"] as g.AudioAsset).play();
        this.comboCount++;
        this.currentEnemy.hp -= this.comboCount;
    }

    damage(): void {
        (this.assets["hit3"] as g.AudioAsset).play();
        this.freezeCount = 60 + this.comboCount;
        this.comboCount = 0;
        this.background.cssColor = "red";
        this.scoreLabel.text = this.getScoreText();
        this.scoreLabel.invalidate();
        this.background.modified();
    }


    createEnemy(): void {
        this.currentEnemy = this.enemyFactory.fromLevel(Math.min(Math.floor(this.killCount / 10), this.enemyFactory.maxLevel - 1));
        this.currentEnemy.x = (this.game.width / 2) - this.currentEnemy.width / 2;
        this.append(this.currentEnemy);
    }

    removeEnemy(): void {
        this.currentEnemy.destroy();
        // 1 + (オーバーキル分 * (level +1)^2)がスコアとしてもらえる
        this.game.vars.GameState.score += 1 + (-this.currentEnemy.hp * (this.currentEnemy.level + 1) * (this.currentEnemy.level + 1));
        this.scoreLabel.text = this.getScoreText();
        this.scoreLabel.invalidate();
        this.killCount++;
        this.currentEnemy = undefined;
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

    getScoreText(): string {
        return `score: ${this.game.vars.GameState.score} / ${this.comboCount} Combo!`;
    }

}