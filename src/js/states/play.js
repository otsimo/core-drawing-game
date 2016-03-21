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
        console.log("AlphabetGame create");
        game.stage.backgroundColor = '#ffffff';
        this.input.onDown.add(this.onInputDown, this);
        game.add.image(0, 0, "game_background.png");


        Game.AlphabetGame.sepet = game.add.image(game.width - 40, game.height, "atlas", Game.nextAlpha.objectImg);
        Game.AlphabetGame.sepet.anchor.set(1, 1);

        var style = { font: "Arial", fill: "#000000", align: "center", fontSize: "64px" };
        var text = game.add.text(game.world.centerX, game.height * 0.9, Game.nextAlpha.object, style);
        text.anchor.set(0.5, 0.5);

        Game.AlphabetGame.sepet = game.add.image(game.world.centerX, game.world.centerY - 100, "atlas", Game.nextAlpha.big);
        Game.AlphabetGame.sepet.anchor.set(0.5, 0.5);
        Game.AlphabetGame.step = 0;

        Game.AlphabetGame.stepGroup = [];
        Game.AlphabetGame.score = 0;

        this.drawSteps();

        Game.AlphabetGame.sepet = game.add.image(40, game.height, "atlas", "bucket.png");
        Game.AlphabetGame.sepet.anchor.set(0, 1);

        var scoreStyle = { font: "Arial", fill: "#FF0000", align: "center", fontSize: "64px" };
        this.scoreText = game.add.text(110, game.height - 60, "0", scoreStyle);
        this.scoreText.anchor.set(0.5, 0.5);

        this.painting = new OtsimoPainting(game, 1024, 768);
        var self = this;
        this.painting.onfinishdrawing = function(step) {
            self.checkDrawing(step);
        }
    }

    checkDrawing(step) {
        console.log("Checking drawing ");
        var self = this;
        var checkPoints = Game.nextAlpha.steps[Game.AlphabetGame.step];
        var checking = [];
        for (var j = 0; j < checkPoints.length; j++) {
            checking.push(false);
        }
        for (var i = 1; i < step.points.length; i++) {
            var pre = step.points[i - 1];
            var now = step.points[i];
            var dist = distanceBetween(pre, now);
            var angle = angleBetween(pre, now);
            for (var t = 0; t < dist; t++) {
                var x = pre.x + (Math.sin(angle) * t);
                var y = pre.y + (Math.cos(angle) * t);
                for (var jj = 0; jj < checkPoints.length; jj++) {
                    var p = checkPoints[jj];
                    var x2 = game.world.centerX - 142 + p.x;
                    var y2 = game.world.centerY - 266 + p.y;

                    if (starContainsPoint({ x: x, y: y }, { x: x2, y: y2 })) {
                        checking[jj] = true;
                    }
                }
            }
        }

        for (var k = 0; k < checkPoints.length; k++) {
            if (checking[k] === false) {
                console.log("Checking false on ", k);
                self.painting.clearCtx();
                self.painting.newStep();
                return;
            }
        }
        self.finishStep();
    }

    finishStep() {
        var self = this;
        this.finishAnim();

        if (Game.AlphabetGame.step + 1 < Game.nextAlpha.steps.length) {
            self.painting.newStep();
            Game.AlphabetGame.step += 1;
            self.drawSteps();
        } else {
            self.finishGame();
        }
    }

    finishAnim() {
        for (var i = 0; i < Game.AlphabetGame.stepGroup.length; i++) {
            moveSpriteTo(Game.AlphabetGame.stepGroup[i]);
            Game.AlphabetGame.score += 10;
        }
        this.scoreText.text = Game.AlphabetGame.score.toString();
        Game.AlphabetGame.stepGroup = [];
    }
    finishGame() {

        var style = { font: "Arial", fill: "#FF0000", align: "center", fontSize: "128px" };
        var text = game.add.text(game.world.centerX, game.world.centerY, "Kazandın!!!", style);
        text.anchor.set(0.5, 0.5);

        setTimeout(function() {
            this.game.state.start("alphabetMenu");
        }, 1000);
    }
    onInputDown() {
        //  this.game.state.start('alphabetMenu');
    }

    drawSteps() {
        var points = Game.nextAlpha.steps[Game.AlphabetGame.step];
        Game.AlphabetGame.stepGroup = [];
        for (var i = 0; i < points.length; ++i) {
            var x = points[i].x;
            var y = points[i].y;
            var img = "star_middle.png";
            if (i == 0 || i == points.length - 1) {
                img = "start_end.png";
            }

            var sepetImg = game.add.image(game.world.centerX - 142 + x, game.world.centerY - 266 + y, "atlas", img);
            sepetImg.anchor.set(0.5, 0.5);
            Game.AlphabetGame.stepGroup.push(sepetImg);
        }
    }
}

function moveSpriteTo(sprite) {
    var tween = game.add.tween(sprite);
    tween.to({ y: (game.height - 110) + (Math.random() * 20), x: 40 + Math.random() * 140 }, 300);
    tween.start();
}