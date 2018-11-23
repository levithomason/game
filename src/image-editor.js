/**
 * Holds an array of GameImage objects.
 * Renders imgaes to canvas with basic image editing capability.
 */
class GameImageEditor {
  constructor() {
    this.setActive = this.setActive.bind(this)
    this.setZoom = this.setZoom.bind(this)
    this.handleZoomChange = this.handleZoomChange.bind(this)

    this.zoom = 4

    this.$root = document.createElement('div')
    this.$root.style.display = 'inline-block'
    document.body.appendChild(this.$root)

    this.$canvas = document.createElement('div')
    this.$canvas.className = 'image-editor-canvas'
    this.$canvas.style.display = 'flex'
    this.$canvas.style.alignItems = 'center'
    this.$canvas.style.justifyContent = 'center'
    this.$canvas.style.width = '360px'
    this.$canvas.style.height = '240px'
    this.$canvas.style.background = '#333'
    this.$root.appendChild(this.$canvas)

    this.$tools = document.createElement('div')
    this.$tools.style.background = '#222'
    this.$tools.style.padding = '0.2rem'
    const $zoom = document.createElement('input')
    $zoom.style.width = '5rem'
    $zoom.type = 'range'
    $zoom.value = this.zoom
    $zoom.min = 1
    $zoom.max = 12
    $zoom.addEventListener('input', this.handleZoomChange)
    this.$tools.appendChild($zoom)
    this.$root.appendChild(this.$tools)

    this.images = []
    this.$images = document.createElement('div')
    this.$images.className = 'image-editor-images'
    this.$images.style.padding = '0.5rem'
    this.$images.style.background = '#ccc'
    this.$root.appendChild(this.$images)
  }

  /**
   * @param {GameImage} image
   */
  addImage(image) {
    this.images.push(image)

    if (!this.activeImage && !this.activeFrame) {
      this.setActive(image, image.frames[0])
    }

    this.render()
  }

  /**
   * @param {GameImage} image
   * @param {GameImageFrame} frame
   */
  setActive(image, frame) {
    console.log(image, frame)
    this.activeImage = image
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
    this.$canvas.innerHTML = ''

    if (!this.activeFrame) return

    const frameImageData = new ImageData(this.activeFrame.imageData, this.activeFrame.width)

    const $image = document.createElement('canvas')
    $image.width = this.activeFrame.width
    $image.height = this.activeFrame.height
    $image.style.width = this.activeFrame.width * this.zoom + 'px'
    $image.style.height = this.activeFrame.height * this.zoom + 'px'
    $image.style.borderColor = 'black'
    $image.style.borderWidth = '1px'
    $image.style.borderStyle = 'solid'
    $image.style.backgroundImage =
      'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAKUlEQVQoU2NkYGAwZkAD////RxdiYBwKCv///4/hGUZGkNNRAeMQUAgAtxof+nLDzyUAAAAASUVORK5CYII=")'

    $image.getContext('2d').putImageData(frameImageData, 0, 0)

    this.$canvas.appendChild($image)
  }

  renderImages() {
    console.log('renderImages')

    this.$images.innerHTML = ''

    this.images.forEach((image, imageIdx) => {
      const isImageActive = this.activeImage === image
      const $imageContainer = document.createElement('div')

      const $name = document.createElement('span')
      $name.innerHTML = image.name + '&emsp;'
      $name.style.display = 'inline-block'
      $name.style.width = '60px'
      $name.style.fontWeight = isImageActive ? 'bold' : 'normal'
      $imageContainer.appendChild($name)

      image.frames.forEach((frame, frameIdx) => {
        const isFrameActive = this.activeFrame === frame
        const frameImageData = new ImageData(frame.imageData, frame.width)

        const $frame = document.createElement('canvas')
        $frame.width = image.width
        $frame.height = image.height
        $frame.style.width = '32px'
        $frame.style.height = '32px'
        $frame.style.display = 'inline-block'
        $frame.style.margin = '0 0.25rem 0.25rem 0'
        $frame.style.verticalAlign = 'middle'
        $frame.style.cursor = 'pointer'
        $frame.style.borderColor = isFrameActive ? 'black' : 'transparent'
        $frame.style.borderWidth = '1px'
        $frame.style.borderStyle = 'solid'
        $frame.addEventListener('click', () => {
          this.setActive(image, frame)
        })
        $frame.getContext('2d').putImageData(frameImageData, 0, 0)

        $imageContainer.appendChild($frame)
      })

      this.$images.appendChild($imageContainer)
    })
  }

  render() {
    console.log('ImageEditor render')
    this.renderActiveFrame()
    this.renderImages()
  }
}
