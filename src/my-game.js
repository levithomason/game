//
// My Game
//

const game = new Game()

game.addObject(new GameObject())

//
// Sprites
//

const playerSprite = new GameSprite('Player')
playerSprite.addFrame()
playerSprite.addFrame()
playerSprite.addFrame()
playerSprite.addFrame()
playerSprite.addFrame()
playerSprite.addFrame()
playerSprite.addFrame()
playerSprite.addFrame()
playerSprite.addFrame()
playerSprite.addFrame()

const bulletSprite = new GameSprite('Bullet')

const enemySprite = new GameSprite('Enemy')
enemySprite.addFrame()

//
// Sprite Editor
//
const spriteEditor = new GameSpriteEditor()
spriteEditor.addSprite(playerSprite)
spriteEditor.addSprite(bulletSprite)
spriteEditor.addSprite(enemySprite)
