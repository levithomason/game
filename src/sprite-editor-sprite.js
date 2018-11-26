customElements.define(
  'game-sprite-editor-sprite',
  class GameSpriteEditorSprite extends Component {
    static get observedAttributes() {
      return ['active', 'name']
    }

    constructor() {
      super()

      if (this.active) this.classList.add('active')

      this.refs.name.addEventListener('focus', this.handleNameFocus)
      this.refs.name.addEventListener('blur', this.handleNameBlur)
      this.refs.name.addEventListener('keydown', this.handleNameKeyDown)

      this.refs.addFrame.addEventListener('click', this.handleAddFrameClick)

      this._frameToNodeMap = new Map()
    }

    render() {
      return `
        <link rel="stylesheet" href="/game.css" >
        <style>
          :host([active]) {
            --sprites-background-color: #fff;
          }

          .wrapper {
            padding: var(--sprites-frame-gap) 0 0 var(--sprites-frame-gap);
            background: var(--sprites-background-color);
          }
          /* Name */
          .name {
            margin-bottom: var(--sprites-frame-gap);
            width: ${this.editableName.length + 1}ch;
            background: none;
            border: none;
            cursor: pointer;
          }
          .name:hover:not(:focus) {
            color: cornflowerblue;
          }
          .name:focus {
            font-weight: normal;
            background: #000;
            color: #fff;
            outline: none;
            cursor: default;
          }
          :host([active]) .name {
            font-weight: bold;
          }

          /* Frames */
          .frames {
            display: flex;
            flex-wrap: wrap;
          }

          .add-frame,
          .frame {
            padding: 0;
            margin: 0 var(--sprites-frame-gap) var(--sprites-frame-gap) 0;
            width: var(--sprites-frame-size);
            height: var(--sprites-frame-size);
            background: none;
            border: none;
            cursor: pointer;
          }
          .frame {
            box-shadow: 0 2px 0 var(--sprites-background-color), 0 2px 0 transparent;
          }
          .frame.active {
            box-shadow: 0 2px 0 var(--sprites-background-color), 0 6px 0 #000;
          }
          .frame:focus {
            outline: none;
          }
          .frame-canvas {
            width: 100%;
          }

          .add-frame {
            font-size: calc(var(--sprites-frame-size) * 0.5);
            color: #333;
            background: rgba(0, 0, 0, 0.1);
          }
          .add-frame:hover {
            background: #000;
            color: #fff;
          }
        </style>
        <div class="wrapper">
          <input ref="name" type="text" class="name" value="${this.editableName}" title="Click to edit">

          <div ref="frames" class="frames">
            <button ref="addFrame" class="add-frame">+</button>
          </div>
        </div>
      `
    }

    /**
     * @param {GameSpriteFrame} frame
     */
    addFrame(frame) {
      // do not append duplicate frames
      if (this._frameToNodeMap.has(frame)) {
        return
      }

      const template = document.createElement('template')
      template.innerHTML = `
        <button ${this.active ? 'active' : ''} class="frame">
          <canvas class="frame-canvas" width="${frame.width}" height="${frame.height}"></canvas>
        </button>
      `

      this.refs.frames.appendChild(template.content.cloneNode(true))
      const frameChildren = this.refs.frames.querySelectorAll('.frame')
      const $frame = frameChildren[frameChildren.length - 1]
      $frame.addEventListener('click', () => {
        this.emit('onframechange', { frame })
      })

      const $canvas = $frame.querySelector('canvas')
      const imageData = new ImageData(frame.imageData, frame.width)
      $canvas.getContext('2d').putImageData(imageData, 0, 0)

      // remember this frame's node so that we can reference it by frame
      this._frameToNodeMap.set(frame, $frame)
    }

    get active() {
      return this.getAttribute('active')
    }

    get editableName() {
      return `✏ ${this.name}`
    }
    get name() {
      return this.getAttribute('name')
    }
    set active(value) {
      if (value) {
        this.setAttribute('active', '')
      } else {
        this.removeAttribute('active')
      }
    }
    set name(value) {
      this.setAttribute('name', value)
    }

    connectedCallback() {
      this._upgradeProperties(this.constructor.observedAttributes)
    }
    // Support lazy properties
    // https://developers.google.com/web/fundamentals/web-components/best-practices#lazy-properties
    _upgradeProperties(props) {
      props.forEach(prop => {
        if (!this.hasOwnProperty(prop)) return

        let value = this[prop]
        delete this[prop]
        this[prop] = value
      })
    }

    attributeChangedCallback(name, oldValue, newValue) {
      switch (name) {
        case 'name':
          this.refs.name.value = this.editableName
          break
      }
    }

    handleAddFrameClick() {
      this.active = true
      const frame = this.sprite.addFrame()
      this.addFrame(frame)
      this.emit('onframechange', { frame })
    }

    handleNameBlur(e) {
      if (this.name !== e.target.value) {
        this.name = e.target.value
      } else {
        this.refs.name.value = this.editableName
      }
    }

    handleNameKeyDown(e) {
      switch (e.key) {
        case 'Escape':
          this.refs.name.blur()
          break
        case 'Enter':
          this.name = e.target.value
          break
      }
    }

    handleNameFocus(e) {
      this.refs.name.value = this.name
      e.target.select()
    }

    /**
     * @param {GameSpriteFrame} activeFrame
     */
    setActiveFrame(activeFrame) {
      this._frameToNodeMap.forEach((node, frame) => {
        if (activeFrame === frame) {
          node.classList.add('active')
        } else {
          node.classList.remove('active')
        }
      })
    }

    /**
     * @param {GameSprite} sprite
     */
    setSprite(sprite) {
      this.sprite = sprite
      sprite.frames.forEach(this.addFrame)
    }
  }
)
