
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
    }

    end() {
        let fin = Date.now();
        let delta = fin - this.startTime;

        let payload = {
            score: this.score,
            duration: delta,
            failure: this.wrongAnswerTotal,
            success: this.correctAnswerTotal
        }
        //console.log("end session, post to analytics")
    }

    startStep() {
        this.wrongAnswerStep = 0;
        this.hintStep = 0;
        this.stepScore = otsimo.kv.game.step_score;
        this.stepStartTime = Date.now();
        this.previousInput = Date.now();
        console.log("start step")
    }

    wrongInput(steps, item, hint_step) {
        console.log("wrong input");
        this.decrementScore();
        this.incrementHint(hint_step);
        let now = Date.now();
        this.wrongAnswerStep += 1;
        this.wrongAnswerTotal += 1;
        let payload = {
            item: item.id,
            kind: item.kind,
            steps: steps,
            hint_step: hint_step,
            time: now - this.stepStartTime,
            delta: now - this.previousInput
        }
        this.previousInput = now;
        otsimo.customevent("game:failure", payload);
    }

    correctInput(steps, item, hint_step) {
        console.log("correct input");
        this.incrementHint(hint_step);
        let now = Date.now();
        this.correctAnswerTotal += 1;
        let payload = {
            item: item.id,
            kind: item.kind,
            steps: steps,
            hint_step: hint_step,
            time: now - this.stepStartTime,
            delta: now - this.previousInput
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
        console.log("change: ", change);
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