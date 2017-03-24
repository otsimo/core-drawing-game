export class Randomizer {
    constructor() {
        let kinds = new Set();
        let itemList = otsimo.game.pool.map((i) => {
            return i.item;
        });

        // The game will only select the item if following part is commented out

        /* 
        let itemID = "s";
        filterSingleItem(itemID, itemList);
        */


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

    /**
     * For debugging purposes, the game only selects single item for every scene
     * @param {string} itemID - the id that will be seen
     * @param {list} itemList - the list to be filtered
     * @returns {list} filtered list
     * 
     * @memberOf Randomizer
     */
    filterSingleItem(itemID, itemList) {
        console.log("game will only select items for id: ", itemID);

        return itemList.filter((i) => {
            return i["id"] == itemID;
        });
    }
}