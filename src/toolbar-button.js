import Component from './component.js'

customElements.define(
  'game-toolbar-button',
  class GameToolbarButton extends Component {
    render() {
      const name = this.getAttribute('name') || ''
      const label = this.getAttribute('label') || ''

      return `
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
    }
  }
)
