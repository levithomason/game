customElements.define(
  'game-toolbar',
  class Toolbar extends HTMLElement {
    constructor() {
      super()

      this.attachShadow({ mode: 'open' }).innerHTML = `
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
      // TODO: how to get the events from the children and bubble them up?
      // this.shadowRoot.querySelectorAll('button').forEach(button => {
      //   console.log(button)
      //   button.addEventListener('click', e => {
      //     console.log('tool button click', e.target.name)
      //   })
      // })
      //
      // this.shadowRoot.querySelectorAll('input').forEach(input => {
      //   console.log(input)
      //   input.addEventListener('input', e => {
      //     console.log('tool button input', e.target.name, e.target.value)
      //   })
      // })
    }
  }
)

customElements.define(
  'game-toolbar-button',
  class ToolbarButton extends HTMLElement {
    constructor() {
      super()

      const label = this.getAttribute('label') || 'Click'

      this.attachShadow({ mode: 'closed' }).innerHTML = `
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
          button:focus {
            outline: none;
          }
        </style>
        <button name="${label}">${label}</button>
`
    }
  }
)

customElements.define(
  'game-toolbar-slider',
  class ToolbarSlider extends HTMLElement {
    constructor() {
      super()
      this.startEditingInput = this.startEditingInput.bind(this)
      this.stopEditingInput = this.stopEditingInput.bind(this)

      this.updateInputFromSlider = this.updateInputFromSlider.bind(this)
      this.updateSliderFromInput = this.updateSliderFromInput.bind(this)

      this.handleInputKeyDown = this.handleInputKeyDown.bind(this)
      this.handleInputChange = this.handleInputChange.bind(this)

      this.handleSliderKeyDown = this.handleSliderKeyDown.bind(this)
      this.handleSliderChange = this.handleSliderChange.bind(this)

      const label = this.getAttribute('label') || ''
      const value = this.getAttribute('value') || '50'
      const min = this.getAttribute('min') || '0'
      const max = this.getAttribute('max') || '100'

      this.$shadow = this.attachShadow({ mode: 'closed' })

      this.$shadow.innerHTML = `
        <style>
        .slider {
            padding: 0;
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
        </style>
        <div class="tool">
          <label class="label">${label}</label>
          <input class="slider" type="range" value="${value}" min="${min}" max="${max}">
          <input class="input">
        </div>
`

      this.$slider = this.$shadow.querySelector('.slider')
      this.$slider.addEventListener('input', this.handleSliderChange)
      this.$slider.addEventListener('keydown', this.handleSliderKeyDown)

      this.$input = this.$shadow.querySelector('.input')
      this.$input.addEventListener('focus', this.startEditingInput)
      this.$input.addEventListener('blur', this.stopEditingInput)
      this.$input.addEventListener('keydown', this.handleInputKeyDown)
      this.$input.addEventListener('input', this.handleInputChange)

      this.updateInputFromSlider()
    }

    startEditingInput() {
      this.$input.type = 'number'
      this.$input.value = parseInt(this.$slider.value)
      this.$input.classList.add('input--editing')
      this.$input.select()
    }

    stopEditingInput() {
      if (this.$shadow.activeElement !== this.$slider) {
        this.$slider.focus()
      }

      this.$input.type = 'text'
      this.$input.classList.remove('input--editing')
      this.updateInputFromSlider()
    }

    updateInputFromSlider() {
      const unit = this.getAttribute('unit') || ''
      this.$input.value = this.$slider.value + unit
    }

    handleInputKeyDown(e) {
      if (e.key === 'Escape' || e.key === 'Enter') {
        this.stopEditingInput()
      }
    }

    updateSliderFromInput() {
      this.$slider.value = parseInt(this.$input.value)
    }

    handleSliderKeyDown(e) {
      if (/\d/.test(e.key) || e.key === 'Enter') {
        this.startEditingInput()
      }
    }

    handleInputChange() {
      this.updateSliderFromInput()
    }

    handleSliderChange(e) {
      this.updateInputFromSlider()
    }
  }
)
