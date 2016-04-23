import Session from '../session'
import Scene from '../scene'

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

export default class Play extends Phaser.State {

    create() {
        let session = new Session({ state: this });
        let scene = new Scene({ delegate: this, session: session });

        this.session = session
        this.scene = scene
        this.game.add.button(25, 25, 'back', this.backAction, this);

        scene.next();
    }

    backAction(button) {
        this.game.state.start('Home');
    }

    render() {
        if (otsimo.debug) {
            this.game.debug.text(this.game.time.fps || '--', 2, 14, "#00ff00");
            this.session.debug(this.game);
        }
    }

    sceneEnded() {
        this.session.end();
        this.game.state.start('Over');
    }
}
