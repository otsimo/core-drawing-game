
function setConstraint(item, constraint) {
    item.x = constraint.x.multiplier * otsimo.game.width + constraint.x.constant;
    item.y = constraint.y.multiplier * otsimo.game.height + constraint.y.constant;
    if (constraint.anchor) {
        item.anchor = constraint.anchor;
    }
}
function calculateConstraint(constraint) {
    let x = constraint.x.multiplier * otsimo.game.width + constraint.x.constant;
    let y = constraint.y.multiplier * otsimo.game.height + constraint.y.constant;
    return {
        x: x,
        y: y,
        anchor: constraint.anchor
    };
}
export {setConstraint, calculateConstraint}