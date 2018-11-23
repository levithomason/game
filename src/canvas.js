class Game {
  constructor(opts = {}) {
    this.running = false
    this.objects = []

    this.height = opts.height || 500
    this.width = opts.width || 500
    this.canvas = document.getElementById('game')
    this.ctx = this.canvas.getContext('2d')
    this.canvas.setAttribute('width', this.width)
    this.canvas.setAttribute('height', this.height)

    this.tick = this.tick.bind(this)
  }

  start() {
    this.running = true
    this.tick()
  }

  pause() {
    this.running = false
  }

  update() {
    this.ctx.clearRect(0, 0, this.width, this.height)
    for (let i = 0; i < this.objects.length; i++) {
      this.objects[i].update(this)
    }
  }

  render() {
    for (let i = 0; i < this.objects.length; i++) {
      this.objects[i].render(this)
    }
  }

  addObject(object) {
    this.objects[this.objects.length] = object
  }

  tick() {
    if (this.running) {
      this.update()
      this.render()
      requestAnimationFrame(this.tick)
    }
  }
}

class GameObject {
  constructor(opts = {}) {
    this.height = opts.height || 5
    this.width = opts.width || 5
    this.sprite = opts.sprite
  }

  update() {}

  render(game) {
    game.ctx.fillStyle = '#000'
    game.ctx.fillRect(0, 0, 150, 75)
  }
}
