export class GameSprite {
  constructor(name = gameUtils.randomName(), { width = 16, height = 16 } = {}) {
    this.width = width
    this.height = height
    this.name = name

    this.frames = []
    this.currentFrame = this.addFrame()

    this.speed = 30
  }

  addFrame() {
    const frame = new GameSpriteFrame({
      sprite: this,
      width: this.width,
      height: this.height,
    })

    this.frames.push(frame)

    return frame
  }
}

export class GameSpriteFrame {
  /**
   * @param {GameSprite} sprite
   * @param {number} width
   * @param {number} height
   * @param {number[]} backgroundColor - An array containing R G B and A values.
   */
  constructor({ sprite, width, height, backgroundColor = [255, 0, 255, 127] } = {}) {
    if (!width || !height) {
      throw new Error(`GameSpriteFrame requires a width and height, received: ${width} and ${height}`)
    }

    this.sprite = sprite
    this.width = width
    this.height = height

    // store a 1d array of consecutive RGBA values
    this.imageData = new Uint8ClampedArray(width * height * 4).fill(0)

    for (let i = 0; i < this.imageData.length; i += 4) {
      this.imageData[i + 0] = Math.round(Math.random() * 255) // backgroundColor[0] // R value
      this.imageData[i + 1] = Math.round(Math.random() * 255) // backgroundColor[1] // G value
      this.imageData[i + 2] = Math.round(Math.random() * 255) // backgroundColor[2] // B value
      this.imageData[i + 3] = Math.round(Math.random() * 255) // backgroundColor[3] // A value
    }
  }
}
