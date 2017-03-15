import Session from '../session'
import Scene from '../scene'
import { calculateConstraint } from '../utils'
import Paint from '../prefabs/paint'

function starContainsPoint(point, p2) {
    var minx = p2.x - 30;
    var miny = p2.y - 30;
    var maxx = p2.x + 30;
    var maxy = p2.y + 30;
    var bRet = false;
    if (point.x >= minx && point.x <= maxx
        && point.y >= miny && point.y <= maxy) {
        bRet = true;
    }
    return bRet;
}

function createPool() {
    let itemList = otsimo.kv[otsimo.kv.game.items];
    let pool = [];

    for (let i = 0; i < itemList.length; i++) {
        let item = new Paint({ game: otsimo.game, item: itemList[i]});
        pool.push(item);
    }
    otsimo.game.pool = pool;
}


export default class Play extends Phaser.State {

    create() {
        createPool();
        
        let session = new Session({ state: this });
        let scene = new Scene({ delegate: this, session: session });

        this.session = session
        this.scene = scene
        if (otsimo.kv.play_screen.background_color) {
            this.game.stage.backgroundColor = otsimo.kv.play_screen.background_color;
        }
        if (otsimo.kv.play_screen.background_image) {
            let back = this.game.add.image(this.game.world.centerX, this.game.world.centerY, otsimo.kv.play_screen.background_image)
            back.anchor.set(0.5, 0.5);
        }
        this.initDecoration();
        this.game.add.button(25, 25, 'back', this.backAction, this);
        if (otsimo.currentMusic) {
            otsimo.currentMusic.volume = otsimo.kv.game_music.volume_play_screen;
        }
        scene.next();
    }

    backAction(button) {
        this.game.state.start('Home');
        this.scene.cleanup({ isBack: true });
    }

    render() {
        if (otsimo.debug) {
            this.game.debug.text(this.game.time.fps || '--', 2, 14, "#00ff00");
            this.session.debug(this.game);
            this.game.debug.text("Time until event: " + this.game.time.events.duration, 300, 50);
        }
    }

    sceneEnded() {
        this.session.end();
        this.game.state.start('Over');
    }

    initDecoration() {
        if (otsimo.kv.decoration) {
            for (let d of otsimo.kv.decoration) {
                let c = calculateConstraint(d);
                let img = this.game.add.image(c.x, c.y, d.image, d.frame);
                img.anchor.set(c.anchor.x, c.anchor.y);
            }
        }
    }
}
