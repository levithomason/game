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
   * @param {GameObject} gameObject
   */
  render(game, gameObject) {
    // compute the game box string
    const dot = '•'
    const row = dot.repeat(game.width) + '\n'

    const newString = [row, (dot + ' '.repeat(game.width - 2) + dot + '\n').repeat(game.height - 2), row]
      .join('')
      .trim()

    // we don't want to waste DOM updates if the text hasn't changed
    if (newString !== this.element.innerHTML) {
      // update canvas size
      this.element.style.display = 'block'
      this.element.style.width = game.width + 'ch'
      this.element.style.border = '2px solid #f00'

      this.element.innerHTML = newString
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
    this.objects.forEach(o => o.update())
  }

  render() {
    this.objects.forEach(o => this.renderer.render(this, o))
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

    setTimeout(this.tick, 1000 / this.speed)
  }
}

//
// Objects
//

class GameObject {
  constructor({ x = 0, y = 0 } = {}) {
    this.x = 0
    this.y = 0
  }

  update() {}
}
