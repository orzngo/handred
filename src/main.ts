import {FightScene} from "./scene/FightScene";

declare var window: any;

function main(param: g.GameMainParameterObject): void {
    g.game.vars.isAtsumaru = false;

    if (typeof window !== 'undefined' && window.RPGAtsumaru) {
        g.game.vars.isAtsumaru = true;
    }
    g.game.pushScene(new FightScene());
}

export = main;
