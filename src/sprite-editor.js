customElements.define(
  'game-sprite-editor',
  class GameSpriteEditor extends HTMLElement {
    constructor() {
      super()

      this.addSprite = this.addSprite.bind(this)

      this.handleFrameChange = this.handleFrameChange.bind(this)
      this.handleZoomChange = this.handleZoomChange.bind(this)

      this.attachShadow({ mode: 'open' })
      const template = document.createElement('template')
      template.innerHTML = `
      <link rel="stylesheet" href="/game.css" >
      <style>
        /****************************
               Sprite Editor
        ****************************/

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
        <canvas class="sprite-editor__canvas"></canvas>
      </div>

      <game-toolbar class="view-toolbar">
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

      <game-sprite-editor-sprites class="right"></game-sprite-editor-sprites>
`
      this.shadowRoot.appendChild(template.content.cloneNode(true))

      this.shadowRoot.querySelector('game-toolbar').addEventListener('input', e => {
        this.zoom = e.detail.value
      })

      this.$canvas = this.shadowRoot.querySelector('.sprite-editor__canvas')
      this.$sprites = this.shadowRoot.querySelector('game-sprite-editor-sprites')
      this.$sprites.addEventListener('onframechange', this.handleFrameChange)

      this.setFrame(this.$sprites.activeSprite)
      if (!this.zoom) this.zoom = 8
    }

    get zoom() {
      return this.getAttribute('zoom')
    }

    set zoom(value) {
      this.setAttribute('zoom', value)

      this.$canvas.style.width = this.$canvas.width * value + 'px'
      this.$canvas.style.height = this.$canvas.height * value + 'px'
    }

    // TODO: should we be proxying these through like this?
    addSprite(...args) {
      return this.$sprites.addSprite(...args)
    }

    handleFrameChange(e) {
      this.setFrame(e.detail.frame)
    }

    handleZoomChange(e) {
      this.zoom = parseInt(e.target.value)
    }

    /**
     * @param {GameSpriteFrame} frame
     */
    setFrame(frame) {
      this.frame = frame

      if (!frame) {
        this.$canvas.style.display = 'none'
      } else {
        this.$canvas.style.display = ''
        const frameImageData = new ImageData(frame.imageData, frame.width)

        this.$canvas.width = frame.width
        this.$canvas.height = frame.height
        this.zoom = this.zoom

        this.$canvas.getContext('2d').putImageData(frameImageData, 0, 0)
      }
    }
  }
)
