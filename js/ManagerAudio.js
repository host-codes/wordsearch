class ManagerAudio {
  constructor() {
    this.audioMoveMouse = new Audio("https://host-codes.github.io/wordsearch/audio/move-mouse.wav")
    this.audioWordIncorrect = new Audio("https://host-codes.github.io/wordsearch/audio/word-incorrect.wav") 
    this.GM = window.gameManager
  }
  //load before game play
  Init = () => { 
    this.audioWordIncorrect.load()
    this.audioMoveMouse.load()
  }
  //audio mouse move
  PlayMoveMouse = () => {
    this.audioMoveMouse.volume = this.GM.isGameAudio ? 1 : 0
    this.audioMoveMouse.play()
  }
  //audio play word correct
  PlayWordCorrect = () => {
    let audioWordCorrect = new Audio("https://host-codes.github.io/wordsearch/audio/word-correct.wav")
    audioWordCorrect.volume = this.GM.isGameAudio ? 1 : 0
    audioWordCorrect.play()
  }
  //audio play word incorrect
  PlayWordIncorrect = () => {

    this.audioWordIncorrect.volume = this.GM.isGameAudio ? 1 : 0
    this.audioWordIncorrect.play()
  }
  //audio play game win
  PlayGameWin = () => {
    let audioGameWin = new Audio("https://host-codes.github.io/wordsearch/audio/game-win.wav")
    audioGameWin.volume = this.GM.isGameAudio ? 1 : 0
    audioGameWin.play()
  }
  //audio play game lose
  PlayGameLose = () => {
    let audioGameLose = new Audio("https://host-codes.github.io/wordsearch/audio/game-lose.wav")
    audioGameLose.volume = this.GM.isGameAudio ? 1 : 0
    audioGameLose.play()
  }
   
  //audio play click
  PlayClick = () => {
    let audioClick = new Audio("https://host-codes.github.io/wordsearch/audio/click.wav")
    audioClick.volume = this.GM.isGameAudio ? 1 : 0
    audioClick.play()
  }
}