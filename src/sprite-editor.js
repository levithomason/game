import Component from './component.js'

customElements.define(
  'game-sprite-editor',
  class GameSpriteEditor extends Component {
    constructor() {
      super()

      this.refs.toolbar.addEventListener('input', this.handleToolbarInput)
      this.refs.sprites.addEventListener('onframechange', this.handleFrameChange)

      this.setFrame(this.refs.sprites.activeSprite)
      if (!this.zoom) this.zoom = 8
    }

    render() {
      return `
        <link rel="stylesheet" href="/game.css" >
        <style>
          :host {
            display: grid;
            grid-template:
              'toolbar toolbar      toolbar' auto
              'left    view         right  ' auto
              'left    view-toolbar right  ' auto / auto 1fr auto
          }
  
          /****************************
                      View
          ****************************/
          .sprite-editor__view {
            grid-area: view;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 340px;
            background: #333;
          }
  
          .sprite-editor__canvas {
            background: url('data:sprite/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAKUlEQVQoU2NkYGAwZkAD////RxdiYBwKCv///4/hGUZGkNNRAeMQUAgAtxof+nLDzyUAAAAASUVORK5CYII=');
            border: 1px solid black;
          }
  
          /****************************
                 TEMP CSS GRID
          ****************************/
          .toolbar {
            grid-area: toolbar;
            border: 2px solid #000;
          }
          .left {
            grid-area: left;
            border: 2px solid #000;
          }
          .right {
            grid-area: right;
            border: 2px solid #000;
          }
          .view {
            grid-area: view;
            border: 2px solid #000;
          }
          .view-toolbar { grid-area: view-toolbar }
        </style>
  
        <div class="toolbar">
         Toolbar
        </div>
  
        <div class="left">
         Drawing Tools
        </div>
  
        <div class="sprite-editor__view">
          <canvas ref="canvas" class="sprite-editor__canvas"></canvas>
        </div>
  
        <game-toolbar ref="toolbar" class="view-toolbar">
          <game-toolbar-slider
            align="right"
            label="Zoom"
            name="zoom"
            unit="x"
            min="1"
            max="20"
            value="8"
          ></game-toolbar-slider>
        </game-toolbar>
  
        <game-sprite-editor-sprites ref="sprites" class="right"></game-sprite-editor-sprites>
      `
    }

    get zoom() {
      return this.getAttribute('zoom')
    }

    set zoom(value) {
      this.setAttribute('zoom', value)

      this.refs.canvas.style.width = this.refs.canvas.width * value + 'px'
      this.refs.canvas.style.height = this.refs.canvas.height * value + 'px'
    }

    // TODO: should we be proxying these through like this?
    addSprite(...args) {
      return this.refs.sprites.addSprite(...args)
    }

    handleFrameChange(e) {
      this.setFrame(e.detail.frame)
    }

    handleToolbarInput(e) {
      this[e.detail.name] = e.detail.value
    }

    /**
     * @param {GameSpriteFrame} frame
     */
    setFrame(frame) {
      this.frame = frame

      if (!frame) {
        this.refs.canvas.style.display = 'none'
      } else {
        this.refs.canvas.style.display = ''
        const frameImageData = new ImageData(frame.imageData, frame.width)

        this.refs.canvas.width = frame.width
        this.refs.canvas.height = frame.height
        this.zoom = this.zoom

        this.refs.canvas.getContext('2d').putImageData(frameImageData, 0, 0)
      }
    }
  }
)
