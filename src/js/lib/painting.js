/**
 * Created by sercand on 18/12/15.
 */

function distanceBetween(point1, point2) {
  return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
}

function angleBetween(point1, point2) {
  return Math.atan2(point2.x - point1.x, point2.y - point1.y);
}

function OtsimoPainting(game, w, h) {
  this.game = game;
  this.width = w;
  this.height = h;

  this.lastPoint = {x: 0, y: 0};
  this.drawing = false;
  this.init();
}

OtsimoPainting.prototype = {};
OtsimoPainting.prototype.init = function () {
  var self = this;
  var myBitmap = self.game.add.bitmapData(self.width, self.height);
  myBitmap.alpha = 0.2;
  self.game.add.sprite(0, 0, myBitmap);
  self.ctx = myBitmap.context;
  self.ctx.lineJoin = self.ctx.lineCap = 'round';
  this.game.input.addMoveCallback(self.input.bind(self));
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

OtsimoPainting.prototype.clearCtx = function () {
  var ctx = this.ctx;
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
};

OtsimoPainting.prototype.clear = function () {
  this.game.input.deleteMoveCallback(this.input);
};
OtsimoPainting.prototype.onDown = function (pointer, x, y) {
  this.lastPoint = {x: x, y: y};
};
OtsimoPainting.prototype.onMove = function (pointer, x, y) {
  var currentPoint = {x: x, y: y};
  var dist = distanceBetween(this.lastPoint, currentPoint);
  var angle = angleBetween(this.lastPoint, currentPoint);
  var ctx = this.ctx;
  for (var i = 0; i < dist; i += 5) {

    x = this.lastPoint.x + (Math.sin(angle) * i);
    y = this.lastPoint.y + (Math.cos(angle) * i);

    var radgrad = ctx.createRadialGradient(x, y, 10, x, y, 20);

    radgrad.addColorStop(0, '#000000');
    radgrad.addColorStop(0.5, 'rgba(0,0,0,0.5)');
    radgrad.addColorStop(1, 'rgba(0,0,0,0)');

    ctx.fillStyle = radgrad;
    ctx.fillRect(x - 20, y - 20, 40, 40);
  }

  this.lastPoint = currentPoint;
};

OtsimoPainting.prototype.onUp = function (pointer, x, y) {
  this.drawing = false;
};
