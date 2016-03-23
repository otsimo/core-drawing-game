import {Randomizer} from './randomizer'

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
            console.log("choosen item is", item);
        })
        return true
    }
}