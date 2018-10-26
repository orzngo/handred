import {Seikimatsu} from "./enemy/Seikimatsu";

function main(param: g.GameMainParameterObject): void {
    const scene = new g.Scene({game: g.game, assetIds:Seikimatsu.enemies});
    const enemyFactory = new Seikimatsu(scene);
    scene.loaded.add(() => {
        // 以下にゲームのロジックを記述します。
        const enemy = enemyFactory.fromLevel(0);

        enemy.update.add(() => {
            // 以下のコードは毎フレーム実行されます。
            enemy.x++;
            if (enemy.x > g.game.width) enemy.x = 0;
            enemy.modified();
        });
        scene.append(enemy);
    });
    g.game.pushScene(scene);
}

export = main;
