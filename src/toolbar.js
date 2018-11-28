import Component from './component.js'

customElements.define(
  'game-toolbar',
  class GameToolbar extends Component {
    render() {
      return `
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
    }
  }
)
