customElements.define(
  'game-sprite-editor-sprite',
  class GameSpriteEditorSprite extends HTMLElement {
    static get observedAttributes() {
      return ['active', 'name']
    }

    constructor() {
      super()
      this.addFrame = this.addFrame.bind(this)
      this.handleAddFrameClick = this.handleAddFrameClick.bind(this)
      this.handleNameBlur = this.handleNameBlur.bind(this)
      this.handleNameFocus = this.handleNameFocus.bind(this)
      this.setActiveFrame = this.setActiveFrame.bind(this)
      this.setSprite = this.setSprite.bind(this)

      this.attachShadow({ mode: 'open' })
      const template = document.createElement('template')
      template.innerHTML = `
        <link rel="stylesheet" href="/game.css" >
        <style>
          :host([active]) {
            --sprites-background-color: #fff;
          }

          .wrapper {
            background: var(--sprites-background-color);
            padding: var(--sprites-frame-gap) 0 var(--sprites-frame-gap) var(--sprites-frame-gap);
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

          /* Frame & Add Frame */
          .frames {
            padding-right: 0;
          }

          .add-frame,
          .frame {
            display: inline-block;
            padding: 0;
            margin: 0 var(--sprites-frame-gap) var(--sprites-frame-gap) 0;
            width: var(--sprites-frame-size);
            height: var(--sprites-frame-size);
            vertical-align: middle;
            text-align: center;
            font-size: calc(var(--sprites-frame-size) * 0.5);
            border: none;
            line-height: var(--sprites-frame-size);
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
            color: #333;
            background: rgba(0, 0, 0, 0.1);
          }
          .add-frame:hover {
            background: #000;
            color: #fff;
          }
        </style>
        <div class="wrapper">
          <input type="text" class="name" value="${this.editableName}" title="Click to edit">

          <div class="frames">
            <button class="add-frame">+</button>
          </div>
        </div>
      `

      this.shadowRoot.appendChild(template.content.cloneNode(true))

      if (this.active) this.classList.add('active')

      this.$frames = this.shadowRoot.querySelector('.frames')

      this.$name = this.shadowRoot.querySelector('.name')
      this.$name.addEventListener('focus', this.handleNameFocus)
      this.$name.addEventListener('blur', this.handleNameBlur)
      this.$name.addEventListener('keydown', this.handleNameKeyDown)

      this.$addFrame = this.shadowRoot.querySelector('.add-frame')
      this.$addFrame.addEventListener('click', this.handleAddFrameClick)

      this._frameToNodeMap = new Map()
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

      this.$frames.appendChild(template.content.cloneNode(true))
      const frameChildren = this.$frames.querySelectorAll('.frame')
      const $frame = frameChildren[frameChildren.length - 1]
      $frame.addEventListener('click', () => {
        this.setActiveFrame(frame)
        this._emitFrameChange(frame)
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

    _emitFrameChange(frame) {
      this.dispatchEvent(
        new CustomEvent('onframechange', {
          detail: { frame },
          bubble: true,
        })
      )
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
          this.$name.value = this.editableName
          break
      }
    }

    handleAddFrameClick() {
      this.active = true
      const newFrame = this.sprite.addFrame()
      this.addFrame(newFrame)
      this.setActiveFrame(newFrame)
      this._emitFrameChange(newFrame)
    }

    handleNameBlur(e) {
      if (this.name !== e.target.value) {
        this.name = e.target.value
      } else {
        this.$name.value = this.editableName
      }
    }

    handleNameKeyDown(e) {
      switch (e.key) {
        case 'Escape':
          this.$name.blur()
          break
        case 'Enter':
          this.name = e.target.value
          break
      }
    }

    handleNameFocus(e) {
      this.$name.value = this.name
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

customElements.define(
  'game-sprite-editor-sprites',
  class GameSpriteEditorSprites extends HTMLElement {
    constructor() {
      super()

      this.addSprite = this.addSprite.bind(this)
      this.handleFrameChange = this.handleFrameChange.bind(this)
      this.setActiveSprite = this.setActiveSprite.bind(this)

      this.attachShadow({ mode: 'open' })
      const template = document.createElement('template')
      template.innerHTML = `
      <link rel="stylesheet" href="/game.css" >
      <style>
        :host {
          --sprites-background-color: #eee;
          --sprites-frame-size: 32px;
          --sprites-frame-gap: 8px;
          --sprites-frames-per-row: 6;

          grid-area: right;

          /*
           Calculate the width to perfectly fit the tiles.
           Number of tiles + their gap + the container gap.
           */
          width: calc(
            var(--sprites-frame-gap) + (var(--sprites-frame-size) + var(--sprites-frame-gap)) *
              var(--sprites-frames-per-row)
          );

          background: var(--sprites-background-color);
        }
      </style>
`
      this.shadowRoot.appendChild(template.content.cloneNode(true))
    }

    /**
     * @param {GameSprite} sprite
     */
    addSprite(sprite) {
      const $sprite = document.createElement('game-sprite-editor-sprite')
      $sprite.setSprite(sprite)
      $sprite.name = sprite.name
      $sprite.addEventListener('onframechange', this.handleFrameChange)
      this.shadowRoot.appendChild($sprite)

      // When adding the first sprite, it should become active
      if (!this.activeSprite) {
        this.setActiveSprite(sprite)
      }
    }

    handleFrameChange(e) {
      const newFrame = e.detail.frame
      this.shadowRoot.querySelectorAll('game-sprite-editor-sprite').forEach($sprite => {
        $sprite.setActiveFrame(newFrame)
        $sprite.active = $sprite.sprite.frames.some(frame => frame === newFrame)
      })

      this.dispatchEvent(
        new CustomEvent('onframechange', {
          detail: { frame: newFrame },
          bubble: true,
        })
      )
    }

    /**
     * @param {GameSprite} sprite
     */
    setActiveSprite(sprite) {
      this.activeSprite = sprite

      this.dispatchEvent(
        new CustomEvent('onspritechange', {
          detail: { sprite },
          bubble: true,
        })
      )
    }
  }
)
