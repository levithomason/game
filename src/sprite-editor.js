/**
 * Holds an array of GameSprite objects.
 * Renders sprites to canvas with basic sprite editing capability.
 */
class GameSpriteEditor {
  constructor() {
    this.setActive = this.setActive.bind(this)
    this.setZoom = this.setZoom.bind(this)
    this.handleZoomChange = this.handleZoomChange.bind(this)

    this.zoom = 8

    this.$root = document.createElement('div')
    this.$root.classList.add('sprite-editor')
    document.body.appendChild(this.$root)

    this.$tools = document.createElement('div')
    this.$tools.classList.add('sprite-editor__tools')
    const $zoom = document.createElement('input')
    $zoom.classList.add('sprite-editor__tool')
    $zoom.style.width = '5rem'
    $zoom.type = 'range'
    $zoom.value = this.zoom
    $zoom.min = 4
    $zoom.max = 20
    $zoom.addEventListener('input', this.handleZoomChange)
    this.$tools.appendChild($zoom)
    this.$root.appendChild(this.$tools)

    this.$view = document.createElement('div')
    this.$view.classList.add('sprite-editor__view')
    this.$root.appendChild(this.$view)

    this.$canvas = document.createElement('canvas')
    this.$canvas.classList.add('sprite-editor__canvas')
    this.$view.appendChild(this.$canvas)

    this.sprites = []
    this.$sprites = document.createElement('div')
    this.$sprites.classList.add('sprite-editor__sprites')
    this.$root.appendChild(this.$sprites)
  }

  /**
   * @param {GameSprite} sprite
   */
  addSprite(sprite) {
    this.sprites.push(sprite)

    if (!this.activeSprite && !this.activeFrame) {
      this.setActive(sprite, sprite.frames[0])
    }

    this.render()
  }

  /**
   * @param {GameSprite} sprite
   * @param {GameSpriteFrame} frame
   */
  setActive(sprite, frame) {
    console.log(sprite, frame)
    this.activeSprite = sprite
    this.activeFrame = frame
    this.render()
  }

  setZoom(zoom = 1) {
    this.zoom = zoom
    this.render()
  }

  //
  // handlers
  //
  handleZoomChange(e) {
    console.log(e.target.value)
    this.setZoom(parseInt(e.target.value))
  }

  //
  // Render
  //

  renderActiveFrame() {
    if (!this.activeFrame) return

    const frameImageData = new ImageData(this.activeFrame.imageData, this.activeFrame.width)

    this.$canvas.width = this.activeFrame.width
    this.$canvas.height = this.activeFrame.height
    this.$canvas.style.width = this.activeFrame.width * this.zoom + 'px'
    this.$canvas.style.height = this.activeFrame.height * this.zoom + 'px'

    this.$canvas.getContext('2d').putImageData(frameImageData, 0, 0)
  }

  renderSprites() {
    console.log('renderSprites')

    this.$sprites.innerHTML = ''

    this.sprites.forEach(sprite => {
      const isSpriteActive = this.activeSprite === sprite
      const $sprite = document.createElement('div')
      $sprite.classList.add('sprite-editor__sprite')
      if (isSpriteActive) $sprite.classList.add('sprite-editor__sprite--active')

      const $name = document.createElement('input')
      const editableName = `✏ ${sprite.name}`
      $name.classList.add('sprite-editor__sprite-name')
      $name.title = 'Click to edit'
      $name.value = editableName
      $name.style.width = $name.value.length + 1 + 'ch'
      $name.addEventListener('focus', e => {
        $name.value = sprite.name
        e.target.select()
      })
      $name.addEventListener('blur', e => {
        if (sprite.name !== e.target.value) {
          sprite.name = e.target.value
          this.render()
        } else {
          $name.value = editableName
        }
      })
      $name.addEventListener('keydown', e => {
        switch (e.key) {
          case 'Escape':
            $name.blur()
            break
          case 'Enter':
            sprite.name = e.target.value
            this.render()
            break
        }
      })
      $sprite.appendChild($name)

      const $frames = document.createElement('div')
      $frames.classList.add('sprite-editor__sprite-frames')
      $sprite.appendChild($frames)

      sprite.frames.forEach(frame => {
        const isFrameActive = this.activeFrame === frame
        const frameImageData = new ImageData(frame.imageData, frame.width)

        const $frame = document.createElement('button')
        $frame.classList.add('sprite-editor__sprite-frame')
        if (isFrameActive) $frame.classList.add('sprite-editor__sprite-frame--active')
        $frame.addEventListener('click', () => {
          this.setActive(sprite, frame)
        })

        const $canvas = document.createElement('canvas')
        $canvas.classList.add('sprite-editor__sprite-frame-canvas')
        $canvas.width = frame.width
        $canvas.height = frame.height
        $canvas.getContext('2d').putImageData(frameImageData, 0, 0)
        $frame.appendChild($canvas)

        $frames.appendChild($frame)
      })

      const $addFrame = document.createElement('button')
      $addFrame.classList.add('sprite-editor__add-frame')
      $addFrame.innerHTML = '+'
      $addFrame.addEventListener('click', () => {
        sprite.addFrame()
        this.setActive(sprite, sprite.frames[sprite.frames.length - 1])
        this.render()
      })
      $frames.appendChild($addFrame)

      this.$sprites.appendChild($sprite)
    })
  }

  render() {
    console.log('spriteEditor render')
    this.renderActiveFrame()
    this.renderSprites()
  }
}
