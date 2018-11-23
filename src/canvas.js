class Canvas {
  constructor({ width = 500, height = 500 } = {}) {
    this.height = height
    this.width = width
    this.canvas = document.getElementById('game')
    this.ctx = this.canvas.getContext('2d')
    this.canvas.width = this.width
    this.canvas.height = this.height
  }

  /**
   * Clear the entire canvas.
   */
  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height)
  }

  /**
   * Draw a GameSprite onto the canvas.
   * @param {GameSprite} sprite
   */
  drawSprite(sprite) {
    const imageData = new ImageData(sprite.currentFrame.imageData, sprite.currentFrame.width)
  }
}
