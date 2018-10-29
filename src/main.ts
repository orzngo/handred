import {FightScene} from "./scene/FightScene";

function main(param: g.GameMainParameterObject): void {
    g.game.pushScene(new FightScene());
}

export = main;
