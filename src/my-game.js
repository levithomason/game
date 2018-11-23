//
// My Game
//

const game = new Game()

game.addObject(new GameObject())

game.start()

//
// Images
//

const playerImage = new GameImage('Player')
playerImage.addFrame()
playerImage.addFrame()

const bulletImage = new GameImage('Bullet')

const enemyImage = new GameImage('Enemy')
enemyImage.addFrame()

//
// Image Editor
//
const imageEditor = new GameImageEditor()
imageEditor.addImage(playerImage)
imageEditor.addImage(bulletImage)
imageEditor.addImage(enemyImage)
