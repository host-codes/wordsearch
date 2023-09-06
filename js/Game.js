/**
* Class Game
* version: 1.0
*/
class Game extends GameObject {
 constructor() {
  super()  
  //event in game
  this.event = new Event(this.GM.canvas) 
  this.grid = new Grid()
  this.wordList = new WordList()
  this.uiWidget = new UiWidget()
  this.is_cell_touch = false
 }

 Init = () => {
  this.GM.Load()
  this.grid.MAudio.Init()
  this.wordList.Init()
  this.uiWidget.Init()
  this.Update()
 }

 CreateNewGrid = () => {
  if (this.grid.is_grid_complete == false) {
   if (this.grid.is_create_grid == false) {
    this.grid.CreateGrid()
   }
   if (this.grid.is_random_complete == false) {
    this.grid.SetRandomAphalbet()
   } else {
    this.grid.SetFillAphalbet()
    this.grid.SetAnimationAphabet()
    this.grid.is_grid_complete = true
   }
  }
 }

 Draw = () => {
  this.grid.Draw()
 }

 Update = () => {
  if (this.GM.isGameReset) {
   this.grid.ResetGrid()
   this.GM.ResetGame()
   this.wordList.Init()
   this.GM.isGameReset = false
  // console.log("reset")
  }

  this.CreateNewGrid()
  

  if (this.GM.isGamePause == false) {
  // console.log("gane:pause")
  if (this.GM.isSetTimer == false) {
   this.GM.timeCountDown = setInterval(this.GM.Timer, 1000)
     this.GM.isSetTimer = true
    }
   this.GM.CheckGameWin()
   if (this.event.isTouch) {
    if (this.is_cell_touch == false && this.grid.GetSelectedCell(this.event.x, this.event.y)) {
     this.is_cell_touch = true
    }
   } else {
    if (this.is_cell_touch) {
     this.grid.CheckWordMatch()
     this.is_cell_touch = false
    }
   }
   if (this.is_cell_touch && this.event.isTouchMoving) {
    this.grid.GetSelectdCellWhenMove(this.event.x, this.event.y)
   }

   this.ctxt.clearRect(0, 0, this.GM.canvas_width, this.GM.canvas_height)
   this.Draw()
   this.grid.Update()
   this.wordList.Update()
  }
  this.uiWidget.Update()
  window.requestAnimationFrame(this.Update)
 }
}

/**
* Version: 1.0
* Author: Supperman IT
*/
window.onload = function () {
 window.gameManager = new GameManager()
 const game = new Game()
 game.Init()
}