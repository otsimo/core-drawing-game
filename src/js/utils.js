
function setConstraint(item, constraint) {
    item.x = constraint.x.multiplier * otsimo.game.width + constraint.x.constant;
    item.y = constraint.y.multiplier * otsimo.game.height + constraint.y.constant;
    if (constraint.anchor) {
        item.anchor = constraint.anchor;
    }
}
function calculateConstraint(constraint) {
    let xc = constraint.x.constant | 0;
    let yc = constraint.y.constant | 0;
    let x = constraint.x.multiplier * otsimo.game.width + xc;
    let y = constraint.y.multiplier * otsimo.game.height + yc;
    return {
        x: x,
        y: y,
        anchor: constraint.anchor
    };
}

function gameVisibleName() {
    let lang =otsimo.manifest.default_language;
    if (lang.length > 2) {
        lang = lang.substring(0, 2)
    }
    for (var i = 0; i < otsimo.manifest.metadata.length; i++) {
        var meta = otsimo.manifest.metadata[i];
        if (meta.language == lang) {
            return meta.visible_name;
        }
    }
    return "";
}


export {gameVisibleName , setConstraint, calculateConstraint}