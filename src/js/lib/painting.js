/**
 * Created by sercand on 18/12/15.
 */


function newPaintingStep(game) {
  var myBitmap = self.game.add.bitmapData(game.width, game.height);
  game.add.sprite(0, 0, myBitmap);

  var ctx = myBitmap.context;
  ctx.lineJoin = ctx.lineCap = 'round';

  return {
    points: [],
    bitmap: myBitmap,
    ctx: ctx,
    lastPoint: {x: 0, y: 0}
  }
}

function addPointToStep(step, point) {
  step.points.push(point);
}

function clearStep(step) {
  var ctx = step.ctx;
  step.points = [];
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  step.bitmap.destroy();
}

function distanceBetween(point1, point2) {
  return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
}

function angleBetween(point1, point2) {
  return Math.atan2(point2.x - point1.x, point2.y - point1.y);
}

function OtsimoPainting(game) {
  this.game = game;
  this.drawing = false;
  this.steps = [];
  this.onfinishdrawing = null;
  this.init();
}

OtsimoPainting.prototype = {};
OtsimoPainting.prototype.init = function () {
  var self = this;

  self.steps.push(newPaintingStep(self.game));

  this.game.input.addMoveCallback(self.input.bind(self));
};


OtsimoPainting.prototype.getLastStep = function () {
  return this.steps[this.steps.length - 1];
};

OtsimoPainting.prototype.input = function (pointer, x, y) {
  var self = this;

  if (!self.drawing && pointer.isDown) {
    self.drawing = true;
    self.onDown(pointer, x, y);
  } else if (self.drawing && pointer.isDown) {
    self.onMove(pointer, x, y);
  } else if (self.drawing && pointer.isUp) {
    self.onUp(pointer, x, y);
  }
};


OtsimoPainting.prototype.newStep = function () {
  var self = this;
  self.steps.push(newPaintingStep(self.game));
};

OtsimoPainting.prototype.clearCtx = function () {
  var step = this.getLastStep();
  clearStep(step);
  this.steps.pop();
};

OtsimoPainting.prototype.clear = function () {
  this.game.input.deleteMoveCallback(this.input);
};

OtsimoPainting.prototype.onDown = function (pointer, x, y) {
  var step = this.getLastStep();
  step.lastPoint = {x: x, y: y};
  step.points.push(step.lastPoint);
};

OtsimoPainting.prototype.onMove = function (pointer, x, y) {
  var step = this.getLastStep();
  var currentPoint = {x: x, y: y};
  var dist = distanceBetween(step.lastPoint, currentPoint);
  var angle = angleBetween(step.lastPoint, currentPoint);

  var ctx = step.ctx;

  step.points.push(currentPoint);

  for (var i = 0; i < dist; i += 5) {

    x = step.lastPoint.x + (Math.sin(angle) * i);
    y = step.lastPoint.y + (Math.cos(angle) * i);

    var radgrad = ctx.createRadialGradient(x, y, 15, x, y, 30);

    radgrad.addColorStop(0, '#FFFF00');
    radgrad.addColorStop(0.5, 'rgba(255,255,0,0.5)');
    radgrad.addColorStop(1, 'rgba(255,255,0,0)');

    ctx.fillStyle = radgrad;
    ctx.fillRect(x - 30, y - 30, 60, 60);
  }

  step.lastPoint = currentPoint;
};

OtsimoPainting.prototype.onUp = function (pointer, x, y) {
  this.drawing = false;
  if (this.onfinishdrawing) {
    this.onfinishdrawing(this.getLastStep())
  }
};
