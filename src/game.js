//
// Renderers
//

class ASCIIRenderer {
  constructor() {
    this.element = document.createElement('pre')
    document.body.appendChild(this.element)
  }

  /**
   * @param {Game} game
   * @param {Array<GameObject>} objects
   */
  render(game, objects) {
    // compute the game box string
    const grid = new Array(game.height)
    for (let i = 0; i <= game.height; i++) {
      grid[i] = new Array(game.width).fill(' ')
    }

    // TODO: needs to handle objects larger than 1x1
    for (let i = 0; i < objects.length; i++) {
      const obj = objects[i]
      grid[obj.y][obj.x] = obj.render() || ' '
    }

    // we don't want to waste DOM updates if the text hasn't changed
    const result = grid.map(row => row.join('')).join('\n')
    if (result !== this.element.innerHTML) {
      // update canvas size
      this.element.style.display = 'block'
      this.element.style.width = game.width + 'ch'
      this.element.style.border = '2px solid #f00'

      this.element.innerHTML = result
    }
  }
}

//
// Game
//

class Game {
  constructor({ width = 80, height = 20, renderer = new ASCIIRenderer() } = {}) {
    this.width = width
    this.height = height
    this.speed = 30
    this.objects = []
    this.renderer = renderer

    this.addObject = this.addObject.bind(this)
    this.update = this.update.bind(this)
    this.render = this.render.bind(this)
    this.play = this.play.bind(this)
    this.pause = this.pause.bind(this)
    this.tick = this.tick.bind(this)
  }

  addObject(object) {
    this.objects.push(object)
  }

  update() {
    this.objects.forEach(o => o.update(this))
  }

  render() {
    this.renderer.render(this, this.objects)
  }

  play() {
    console.log('play')
    this.isRunning = true

    this.tick()
  }

  pause() {
    console.log('pause')
    this.isRunning = false
  }

  tick() {
    if (!this.isRunning) return

    this.update()
    this.render()
    requestAnimationFrame(this.tick)
  }
}

//
// Objects
//

class GameObject {
  constructor({ x = 0, y = 0 } = {}) {
    this.x = x
    this.y = y
  }

  render() {}

  update() {}
}

class Player extends GameObject {
  constructor() {
    super({ x: 40, y: 10 })
    this.attachListeners()
    this.handleKeydown = this.handleKeydown.bind(this)
    this.velocity = 1
  }

  destroy() {
    this.removeListeners()
  }

  attachListeners() {
    window.addEventListener('keydown', this.handleKeydown)
  }

  removeListeners() {
    window.removeEventListener('keydown', this.handleKeydown)
  }

  handleKeydown(e) {
    console.log(e.which)
  }

  render() {
    return '•'
  }

  update(game) {
    const dy = this.y + this.velocity
    if (dy > game.height) {
      this.velocity = -1
      this.y = game.height - 1
    } else if (dy < 0) {
      this.velocity = 1
      this.y = 1
    } else {
      this.y = dy
    }
  }
}
