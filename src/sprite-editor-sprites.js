import Component from './component.js'

customElements.define(
  'game-sprite-editor-sprites',
  class GameSpriteEditorSprites extends Component {
    render() {
      return `
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
              /* left gutter */
              var(--sprites-frame-gap) +
              /* right gutter */
              var(--sprites-frame-gap) +
              /* frames */
              (var(--sprites-frame-size) + var(--sprites-frame-gap)) * var(--sprites-frames-per-row)
            );

            background: var(--sprites-background-color);
          }
        </style>
      `
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
      const { frame } = e.detail
      this.shadowRoot.querySelectorAll('game-sprite-editor-sprite').forEach($sprite => {
        $sprite.setActiveFrame(frame)
        $sprite.active = $sprite.sprite.frames.some(f => f === frame)
      })

      this.emit('onframechange', { frame })
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
