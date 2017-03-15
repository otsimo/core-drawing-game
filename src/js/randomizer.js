export class Randomizer {
    constructor() {
        let kinds = new Set();
        let itemList = otsimo.game.pool.map((i) => {
            return i.item;
        });

        for (let i of itemList) {
            kinds.add(i.kind)
        }

        this.itemList = itemList;
        this.values = new Set(kinds.values());
        this.kinds = kinds;
    }

    randomKind() {
        let randomNumber = Math.floor(Math.random() * this.values.size);
        return [...this.values][randomNumber];
    }

    randomItemOfKind(set, kind, excluded) {
        let f = [...set].filter(l => {
            if (kind != null && l.kind != kind) {
                return false;
            }
            if (excluded != null && excluded.indexOf(l.kind) >= 0) {
                return false;
            }
            return true;
        });

        return f[Math.floor(Math.random() * f.length)]
    }
    /**
     * next will generate next item
     * @param {Function} callback the callback which will return the next item
     */
    next(callback) {
        if (this.values.size == 0) {
            this.values = new Set(this.kinds.values());
        }
        let s = this.randomKind();
        this.values.delete(s);

        let correct = this.randomItemOfKind(this.itemList, s, []);
        return callback(correct);
    }
}