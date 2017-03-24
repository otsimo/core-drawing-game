
function makeid(length = 5) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

function findErrorRatio() {
    let err_rate = otsimo.kv.game.error_ratio_medium;
    switch (otsimo.settings.difficulty) {
        case "easy":
            err_rate = otsimo.kv.game.error_ratio_easy;
            break;
        case "medium":
            break;
        case "hard":
            err_rate = otsimo.kv.game.error_ratio_hard;
            break;
        default:
            break;
    }
    return err_rate;
}

export default class Session {
    constructor({state}) {
        this.score = 0
        this.stepScore = otsimo.kv.game.step_score;
        this.startTime = new Date();
        this.state = state;
        this.correctAnswerTotal = 0;
        this.wrongAnswerTotal = 0;
        this.wrongAnswerStep = 0;
        this.hintTotal = 0;
        this.hintStep = 0;
        this.stepStartTime = Date.now();
        this.previousInput = Date.now();
        this.id = makeid(10);
        this.sessionStart();
    }

    sessionStart() {
        let payload = {
            id: this.id
        }
        otsimo.customevent("game:start", payload);
    }

    end() {
        let fin = Date.now();
        let delta = fin - this.startTime;
        let err_rate = findErrorRatio();
        let payload = {
            error_rate: err_rate,
            score: this.score,
            duration: delta,
            total_failure: this.wrongAnswerTotal,
            steps: otsimo.kv.game.session_step
        }
        otsimo.customevent("game:session:end", payload);
        //console.log("end session, post to analytics")
    }

    startStep() {
        this.wrongAnswerStep = 0;
        this.hintStep = 0;
        this.stepScore = otsimo.kv.game.step_score;
        this.stepStartTime = Date.now();
        this.previousInput = Date.now();
        //console.log("start step");
    }

    wrongInput(steps, item, hint_step, difference) {
        //console.log("wrong input");
        this.decrementScore();
        this.incrementHint(hint_step);
        let now = Date.now();
        this.wrongAnswerStep += 1;
        this.wrongAnswerTotal += 1;
        let _difficulty = otsimo.settings.difficulty;
        // item number is unnecesarry
        let err_rate = findErrorRatio();
        let payload = {
            difference_ratio: difference,
            item: item.id,
            stepScore: this.stepScore,
            score: this.score,
            hint_step: hint_step,
            time: now - this.stepStartTime,
            delta: now - this.previousInput,
            wrongAnswerStep: this.wrongAnswerStep,
            difficulty: _difficulty,
            error_rate: err_rate,
            id: this.id,
        }
        this.previousInput = now;
        otsimo.customevent("game:failure", payload);
    }

    correctInput(steps, item, hint_step, difference) {
        //console.log("correct input");
        this.incrementHint(hint_step);
        let now = Date.now();
        this.correctAnswerTotal += 1;
        //let _difficulty = otsimo.settings.difficulty;
        //let err_rate = findErrorRatio();
        let payload = {
            item: item.id,
            stepScore: this.stepScore,
            score: this.score,
            hint_step: hint_step,
            time: now - this.stepStartTime,
            delta: now - this.previousInput,
            wrongAnswerStep: this.wrongAnswerStep,
            id: this.id
        }
        this.previousInput = now;
        otsimo.customevent("game:success", payload);
    }

    updateScore() {
        this.score += this.stepScore;
    }

    debug(game) {
        game.debug.text("score: " + this.score, 800, 640, "#00ff00");
        game.debug.text("wrongAnswerTotal: " + this.wrongAnswerTotal, 800, 660, "#00ff00");
        game.debug.text("wrongAnswerStep: " + this.wrongAnswerStep, 800, 680, "#00ff00");
        game.debug.text("hintStep: " + this.hintStep, 800, 700, "#00ff00");
        game.debug.text("hintTotal: " + this.hintTotal, 800, 720, "#00ff00");
        game.debug.text("stepScore: " + this.stepScore, 800, 740, "#00ff00");
    }

    decrementScore() {
        if (this.stepScore > 0) {
            this.stepScore--;
        }
    }

    incrementHint(hintObjectStep) {
        let change = hintObjectStep - this.hintStep;
        if (this.stepScore > 0) {
            this.stepScore -= change;
            if (this.stepScore < 0) {
                this.stepScore = 0;
            }
        }
        this.hintTotal += change;
        this.hintStep = hintObjectStep;
    }

}

