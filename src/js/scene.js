import {Randomizer} from './randomizer'
import Introduction from './prefabs/intro'

export default class Scene {
    constructor({session, delegate}) {
        this.session = session;
        this.delegate = delegate;
        this._random = new Randomizer()
        this.steps = []
        this.step = 0
    }

    get random() {
        return this._random;
    }

    get step() {
        return this.current_step | 0;
    }

    set step(value) {
        this.current_step = value;
    }

    /**
     * intializes scene with randomly chosed item
     * @returns {boolean} whether a new step can be created
     */
    next() {
        if (this.step >= otsimo.kv.game.session_step) {
            return false
        }
        this.random.next((item) => {
            this.answerItem = item;
            let intro = new Introduction({ game: otsimo.game, question: item });
            this.intro = intro;
            intro.onComplete.addOnce(this.onIntroCompleted, this);
            intro.show();
        })
        return true
    }

    onIntroCompleted() {
        console.log("onIntroCompleted")        
        this.intro.makeObjectImageSmall();
    }
}