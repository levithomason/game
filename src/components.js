// // Game
// // ------------------------------------
// class GameCanvas extends HTMLElement {
//   constructor() {
//     super()
//     this.game = game // from window...
//     this.game.height = 500
//     this.game.width = 500
//
//     const template = document.createElement('template')
//     template.innerHTML = `
//       <canvas height="${this.game.height}" width="${this.game.width}"></canvas>
//       <game-controls></game-controls>
//     `
//
//     this.root = this.attachShadow({ mode: 'open' })
//     this.shadowRoot.appendChild(template.content.cloneNode(true))
//   }
//
//   connectedCallback() {
//     // HACK: inject local DOM into game instance...
//     // TODO: fix this weird coupling
//     this.canvas = this.root.querySelector('canvas')
//     this.game.canvas = this.canvas
//     this.game.ctx = this.canvas.getContext('2d')
//     this.root.addEventListener('pause', this.game.pause.bind(game))
//     this.root.addEventListener('start', this.game.start.bind(game))
//     this.game.start()
//   }
// }
//
// class GameControls extends HTMLElement {
//   constructor() {
//     super()
//     const template = document.createElement('template')
//     template.innerHTML = `
//       <button data-action="start">Start</button>
//       <button data-action="pause">Pause</button>
//     `
//
//     this.handleClick = this.handleClick.bind(this)
//     this.root = this.attachShadow({ mode: 'open' })
//     this.root.addEventListener('click', this.handleClick)
//     this.shadowRoot.appendChild(template.content.cloneNode(true))
//   }
//
//   handleClick(e) {
//     const action = e.target.getAttribute('data-action')
//     if (action) {
//       this.dispatchEvent(
//         new CustomEvent(action, {
//           bubbles: true,
//         })
//       )
//     }
//   }
// }
//
// customElements.define('game-canvas', GameCanvas)
// customElements.define('game-controls', GameControls)
//
// // Game Editor
// // ------------------------------------
// class GameEditor extends HTMLElement {
//   connectedCallback() {
//     this.innerHTML = `
//       <div class="sprite-editor">
//         <game-editor-toolbar></game-editor-toolbar>
//         <game-editor-sprite-canvas></game-editor-sprite-canvas>
//         <game-editor-sprite-list></game-editor-sprite-list>
//       </div>
//     `
//   }
// }
//
// class GameEditorToolbar extends HTMLElement {
//   constructor() {
//     super()
//   }
//
//   connectedCallback() {
//     this.innerHTML = `
//       <div class="sprite-editor__tools">
//         <input class="sprite-editor__tool" />
//       </div>
//     `
//   }
// }
//
// class GameEditorSpriteCanvas extends HTMLElement {
//   connectedCallback() {
//     this.innerHTML = `
//       <canvas class="sprite-editor__canvas"></canvas>
//     `
//   }
// }
//
// class GameEditorSpriteList extends HTMLElement {
//   connectedCallback() {
//     this.innerHTML = `
//     `
//   }
// }
//
// customElements.define('game-editor', GameEditor)
// customElements.define('game-editor-toolbar', GameEditorToolbar)
// customElements.define('game-editor-sprite-canvas', GameEditorSpriteCanvas)
// customElements.define('game-editor-sprite-list', GameEditorSpriteList)
