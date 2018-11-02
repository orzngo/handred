import {Seikimatsu} from "../enemy/Seikimatsu";
import {Enemy} from "../enemy/Enemy";
import {Chance} from "../chance/Chance";
import {NorthStartFist} from "../chance/NorthStarFist";
import {Background} from "../Background";
import {ComboCounter} from "../ComboCounter";
import {ChibaShigeru} from "../ChibaShigeru";

declare var window:any;

export class FightScene extends g.Scene {
    enemyLayer: g.E | undefined;
    textLayer: g.E | undefined;
    topLayer: g.E | undefined;

    currentEnemy: Enemy | undefined;
    currentChances: Chance[] | undefined;
    scoreLabel: g.Label | undefined;
    comboLabel: ComboCounter | undefined;
    timeLabel: g.Label | undefined;
    background: Background | undefined;
    firstDescription: ChibaShigeru | undefined;


    DEFAULT_REMAINING_TIME: number = 60 * 30;


    enemyFactory: Seikimatsu;
    chanceFactory: NorthStartFist;

    isRunning: boolean = false;

    hitChance: boolean = false;
    hitFake: Boolean = false;

    comboCount: number = 0;
    freezeCount: number = 0;
    enemyDyingCount: number = 0;

    killCount: number = 0;

    sceneTime: number = 0;
    timeLimit: number = 0;
    remainingTime: number = 0;

    parameters:any;

    constructor() {
        super({
            game: g.game,
            assetIds: Seikimatsu.enemies.concat(["hit1", "hit2", "hit3", "alarm1", "alarm2"])
        });

        this.enemyLayer = new g.E({scene: this});
        this.append(this.enemyLayer);
        this.textLayer = new g.E({scene: this});
        this.append(this.textLayer);
        this.topLayer = new g.E({scene: this});
        this.append(this.topLayer);

        this.enemyFactory = new Seikimatsu(this);
        this.chanceFactory = new NorthStartFist(g.game, this);

        if (this.game.vars.isAtsumaru) {
            this.loaded.add(() => {
                this.initialize();
            });
        } else {
            this.message.add((e) => {
                if (e.data && e.data.type === "start") {
                    if (e.data.parameters) {
                        this.parameters = e.data.parameters;
                    }
                    this.initialize(e.data.parameters.gameTimeLimit * 30);
                }
            });
        }
    }

    initialize(timeLimit:number = this.DEFAULT_REMAINING_TIME): void {
        this.game.vars.gameState = {score: 0};
        this.background = new Background({scene: this});

        this.enemyLayer.append(this.background);
        // TODO: アプリ全体で使い回す？
        const font = new g.DynamicFont({game: g.game, fontFamily: g.FontFamily.Serif, size: 40});
        const scoreBackground = new g.FilledRect({
            scene: this,
            cssColor: "rgba(192,192,192,0.5)",
            width: this.game.width,
            height: 40
        });
        this.scoreLabel = new g.Label({scene: this, font, text: this.getScoreText(), fontSize: 40});
        this.scoreLabel.y = 0;
        this.textLayer.append(scoreBackground);
        this.textLayer.append(this.scoreLabel);
        this.comboLabel = new ComboCounter({scene: this});
        this.comboLabel.y = this.game.height - 80;
        this.comboLabel.x = 70;
        this.textLayer.append(this.comboLabel);

        this.timeLimit = timeLimit;
        this.timeLabel = new g.Label({scene: this, font, text: this.remainingTime.toString(), fontSize: 40});
        this.timeLabel.x = this.game.width - 100;
        this.textLayer.append(this.timeLabel);

        this.firstDescription = new ChibaShigeru({scene: this}, 30 * 5);
        this.topLayer.append(this.firstDescription);

        this.update.add(() => {
            this.mainLoop();
        });
        this.pointDownCapture.add((e) => {
            this.onClick(e);
        });
    }

    mainLoop(): void {
        if (this.sceneTime === 30 * 5) {
            (this.assets["alarm2"] as g.AudioAsset).play();
            this.isRunning = true;
            this.remainingTime = this.timeLimit;
        }

        if (!this.currentEnemy) {
            this.createEnemy();
            this.createChances();
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
            this.background.stopDamagedEffect();
            this.currentEnemy.scale(1);
            this.createChances();
        } else if (this.freezeCount > 0) {
            this.currentEnemy.scale(1.2);
            this.currentEnemy.modified();
        }
        this.freezeCount--;
        this.enemyDyingCount--;
        if (this.remainingTime > 0) {
            this.remainingTime--;
        }
        if (this.remainingTime === 1) {
            this.isRunning = false;
            (this.assets["alarm1"] as g.AudioAsset).play();
            if (this.game.vars.isAtsumaru) {
                window.RPGAtsumaru.experimental.scoreboards.setRecord(1, this.game.vars.gameState.score);
                this.setTimeout(()=>{
                    window.RPGAtsumaru.experimental.scoreboards.display(1);
                },3000);
            }
        }
        this.timeLabel.text = this.remainingTime.toString();
        this.timeLabel.invalidate();
        this.comboLabel.setCombo(this.comboCount);
        this.sceneTime++;
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
            if (point.x >= chance.x && point.x <= chance.x + chance.width) {
                if (point.y >= chance.y && point.y <= chance.y + chance.height) {
                    // 一度でも本物に的中判定が出たら、そのフレームでは的中とみなす
                    if (this.hitFake) {
                        this.hitFake = chance.isFake;
                    }
                    chance.hit();
                }
            }
        });
        this.hitChance = !this.hitFake;
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
        this.background.startDamagedEffect();
        this.scoreLabel.text = this.getScoreText();
        this.scoreLabel.invalidate();
    }


    createEnemy(): void {
        this.currentEnemy = this.enemyFactory.fromLevel(Math.min(Math.floor(this.killCount / 10), this.enemyFactory.maxLevel - 1));
        this.currentEnemy.x = (this.game.width / 2) - this.currentEnemy.width / 2;
        this.enemyLayer.append(this.currentEnemy);
    }

    removeEnemy(): void {
        this.currentEnemy.destroy();
        // 1 + (オーバーキル分 * (level +1)^2)がスコアとしてもらえる
        this.game.vars.gameState.score += 1 + (-this.currentEnemy.hp * (this.currentEnemy.level + 1) * (this.currentEnemy.level + 1));
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
            this.enemyLayer.append(chance);
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
        return `score: ${this.game.vars.gameState.score}`;
    }
}