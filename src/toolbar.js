customElements.define(
  'game-toolbar',
  class GameToolbar extends HTMLElement {
    constructor() {
      super()

      this.attachShadow({ mode: 'open' })
      const template = document.createElement('template')
      template.innerHTML = `
        <style>
          :host {
            display: flex;
            flex: 0 0 auto;
            padding: 0.2rem;
            width: 100%;
            color: rgba(255, 255, 255, 0.8);
            font-family: monospace;
            background: #222;
          }

          .tool {
            margin-left: 20px;
            border-left: 1px solid red;
          }
        </style>
        <slot></slot>
`
      this.shadowRoot.appendChild(template.content.cloneNode(true))
    }
  }
)

customElements.define(
  'game-toolbar-button',
  class GameToolbarButton extends HTMLElement {
    constructor() {
      super()

      const name = this.getAttribute('name') || ''
      const label = this.getAttribute('label') || ''

      this.attachShadow({ mode: 'open' })
      const template = document.createElement('template')
      template.innerHTML = `
        <style>
          button {
            color: inherit;
            background: #333;
            border: none;
            cursor: pointer;
          }
          button:hover {
            background: #444;
          }
          button:active {
            background: #111;
          }
        </style>
        <button name="${name}">${label}</button>
`
      this.shadowRoot.appendChild(template.content.cloneNode(true))
    }
  }
)

customElements.define(
  'game-toolbar-slider',
  class GameToolbarSlider extends HTMLElement {
    static get observedAttributes() {
      return ['align', 'label', 'max', 'min', 'name', 'unit', 'value']
    }

    constructor() {
      super()

      this._updateStyle = this._updateStyle.bind(this)
      this._upgradeProperties = this._upgradeProperties.bind(this)

      this.startEditingInput = this.startEditingInput.bind(this)
      this.stopEditingInput = this.stopEditingInput.bind(this)

      this.handleInput = this.handleInput.bind(this)
      this.handleInputKeyDown = this.handleInputKeyDown.bind(this)
      this.handleSliderKeyDown = this.handleSliderKeyDown.bind(this)

      const label = this.getAttribute('label') || ''
      const value = this.getAttribute('value') || '50'
      const min = this.getAttribute('min') || '0'
      const max = this.getAttribute('max') || '100'

      this.attachShadow({ mode: 'open' })
      const template = document.createElement('template')
      template.innerHTML = `
        <style></style>
        <label class="label">${label}</label>
        <input class="slider" type="range" value="${value}" min="${min}" max="${max}">
        <input class="input" value="${value}x">
`
      this.shadowRoot.appendChild(template.content.cloneNode(true))

      this.$style = this.shadowRoot.querySelector('style')

      this.$input = this.shadowRoot.querySelector('.input')
      this.$input.addEventListener('focus', this.startEditingInput)
      this.$input.addEventListener('blur', this.stopEditingInput)
      this.$input.addEventListener('keydown', this.handleInputKeyDown)
      this.$input.addEventListener('input', this.handleInput)

      this.$label = this.shadowRoot.querySelector('.label')

      this.$slider = this.shadowRoot.querySelector('.slider')
      this.$slider.addEventListener('input', this.handleInput)
      this.$slider.addEventListener('keydown', this.handleSliderKeyDown)
    }

    _updateStyle() {
      this.$style.textContent = `
        :host {
          ${!this.align ? '' : this.align === 'left' ? 'margin-right: auto' : 'margin-left: auto'};
        }

        .slider {
          margin: 0;
          width: 3rem;
          vertical-align: middle;
          background: #222;
        }

        .label,
        .input {
          display: inline-block;
          vertical-align: middle;
          color: inherit;
        }

        .input {
          width: 4ch;
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          text-decoration: underline;
        }
        .input--editing {
          text-decoration: none;
          background: #000;
          border-bottom-color: cornflowerblue;
        }
        .input:focus {
          outline: none;
        }
        .input:hover:not(:focus) {
          color: cornflowerblue;
          cursor: pointer;
        }
      `
    }

    // Use attributes as the SSOT for property values
    // https://developers.google.com/web/fundamentals/web-components/best-practices#avoid-reentrancy
    get align() {
      return this.getAttribute('align')
    }
    get label() {
      return this.getAttribute('label')
    }
    get max() {
      return this.getAttribute('max')
    }
    get min() {
      return this.getAttribute('min')
    }
    get name() {
      return this.getAttribute('name')
    }
    get unit() {
      return this.getAttribute('unit')
    }
    get valueWithUnit() {
      return parseInt(this.value) + this.unit
    }
    get value() {
      return this.getAttribute('value')
    }

    set value(val) {
      this.setAttribute('value', String(parseInt(val, 10)))
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
        case 'align':
          this._updateStyle()
          break
        case 'label':
          this.$label = newValue
          break
        case 'max':
          this.$slider.max = newValue
          this.$input.max = newValue
          break
        case 'min':
          this.$slider.min = newValue
          this.$input.min = newValue
          break
        case 'name':
          this.$slider.name = newValue
          this.$input.name = newValue
          break
        case 'unit':
          this.$input.value = this.valueWithUnit
          break
        case 'value':
          this.$slider.value = newValue
          this.$input.value = this.isEditingInput ? newValue : this.valueWithUnit
          break
      }
    }

    get isEditingInput() {
      return this.$input.classList.contains('input--editing')
    }

    startEditingInput() {
      this.$input.value = this.value
      this.$input.type = 'number'
      this.$input.classList.add('input--editing')
      this.$input.select()
    }

    stopEditingInput() {
      this.$input.type = 'text'
      this.$input.value = this.valueWithUnit
      this.$input.classList.remove('input--editing')
    }

    handleInput(e) {
      this.value = e.target.value
      this.dispatchEvent(
        new CustomEvent('input', {
          detail: { name: this.name, value: this.value },
          bubbles: true,
        })
      )
    }

    handleInputKeyDown(e) {
      if (e.key === 'Escape' || e.key === 'Enter') {
        this.stopEditingInput()
        this.$slider.focus()
      }
    }

    handleSliderKeyDown(e) {
      if (/\d/.test(e.key) || e.key === 'Enter') {
        this.startEditingInput()
      }
    }
  }
)
