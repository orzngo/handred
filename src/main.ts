import {Seikimatsu} from "./enemy/Seikimatsu";
import {Chance} from "./Chance";

function main(param: g.GameMainParameterObject): void {
    const scene = new g.Scene({game: g.game, assetIds:Seikimatsu.enemies});
    const enemyFactory = new Seikimatsu(scene);
    const font = new g.DynamicFont({game:g.game, fontFamily:g.FontFamily.Serif, size:40});
    scene.loaded.add(() => {
        // 以下にゲームのロジックを記述します。
        const enemy = enemyFactory.fromLevel(0);
        const chance = new Chance({scene},font, scene);

        enemy.update.add(() => {
            // 以下のコードは毎フレーム実行されます。
            enemy.x++;
            if (enemy.x > g.game.width) enemy.x = 0;
            enemy.modified();
        });
        scene.append(enemy);
        scene.append(chance);
    });
    g.game.pushScene(scene);
}

export = main;
