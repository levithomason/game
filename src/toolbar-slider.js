import Component from './component.js'

customElements.define(
  'game-toolbar-slider',
  class GameToolbarSlider extends Component {
    static get observedAttributes() {
      return ['align', 'label', 'max', 'min', 'name', 'unit', 'value']
    }

    render() {
      const label = this.getAttribute('label') || ''
      const value = this.getAttribute('value') || '50'
      const min = this.getAttribute('min') || '0'
      const max = this.getAttribute('max') || '100'

      return `
        <style ref="style"></style>
        <label ref="label" class="label">${label}</label>
        <input ref="slider" class="slider" type="range" value="${value}" min="${min}" max="${max}">
        <input ref="input" class="input" value="${value}x">
      `
    }

    constructor() {
      super()

      this.refs.input.addEventListener('focus', this.startEditingInput)
      this.refs.input.addEventListener('blur', this.stopEditingInput)
      this.refs.input.addEventListener('keydown', this.handleInputKeyDown)
      this.refs.input.addEventListener('input', this.handleInput)

      this.refs.slider.addEventListener('input', this.handleInput)
      this.refs.slider.addEventListener('keydown', this.handleSliderKeyDown)
    }

    _updateStyle() {
      this.refs.style.textContent = `
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
          this.refs.label = newValue
          break
        case 'max':
          this.refs.slider.max = newValue
          this.refs.input.max = newValue
          break
        case 'min':
          this.refs.slider.min = newValue
          this.refs.input.min = newValue
          break
        case 'name':
          this.refs.slider.name = newValue
          this.refs.input.name = newValue
          break
        case 'unit':
          this.refs.input.value = this.valueWithUnit
          break
        case 'value':
          this.refs.slider.value = newValue
          this.refs.input.value = this.isEditingInput ? newValue : this.valueWithUnit
          break
      }
    }

    get isEditingInput() {
      return this.refs.input.classList.contains('input--editing')
    }

    startEditingInput() {
      this.refs.input.value = this.value
      this.refs.input.type = 'number'
      this.refs.input.classList.add('input--editing')
      this.refs.input.select()
    }

    stopEditingInput() {
      this.refs.input.type = 'text'
      this.refs.input.value = this.valueWithUnit
      this.refs.input.classList.remove('input--editing')
    }

    handleInput(e) {
      this.value = e.target.value
      this.emit('input', { name: this.name, value: this.value })
    }

    handleInputKeyDown(e) {
      if (e.key === 'Escape' || e.key === 'Enter') {
        this.stopEditingInput()
        this.refs.slider.focus()
      }
    }

    handleSliderKeyDown(e) {
      if (/\d/.test(e.key) || e.key === 'Enter') {
        this.startEditingInput()
      }
    }
  }
)
