class GameManager {
 constructor() {
  //get canvas
  this.canvas = document.getElementById("my_canvas")
  //wapper canvas reponsice mobile and window
  this.canvas_wapper = document.getElementById("my_canvas_wapper")
  this.ctxt = this.canvas.getContext("2d")
  this.margin_left_grid = 10
  this.margin_top_grid = 100
  this.size = 0
  this.rows = 0
  this.cols = 0
  //time clock
  this.timeLimit = 120
  this.minutes = 0
  this.seconds = 0
  this.score = 0
  this.level = 0
  this.type = "animals"
  this.dataStore = {
   level: 0,
   type: 0,
   is_win_game : false
  }
  //width canvas
  this.canvas_width = this.canvas_wapper.offsetWidth
  //height canvas
  this.canvas_height = window.outerHeight
  this.canvas.setAttribute("width", this.canvas_width + "px")
  this.canvas.setAttribute("height", this.canvas_height + "px")
  this.grid_width = this.canvas_width - this.margin_left_grid * 2
  this.isGameAudio = true 
  this.isGamePause = true
  this.isGameOver = false
  this.isGameReset = false
  this.isTimerStart = false
  this.isSetTimer = false
  this.isCheckGameWin = false
  this.isAutoSearchWord = false
  this.timeCountDown = null
  this.words = data
  this.colors = [
   "#ffa31a",
   "#ffd11a",
   "#ff4d94",
   "#ffaa80",
   "#a6ff4d",
   "#47d147",
   "#ff4dff",
   "#d24dff",
   "#80ffaa",
   "#4dffff",
   "#4da6ff",
   "#80e5ff",
   "#6666ff",
   "#ff99ff",
   "#ffc2b3",
   "#ff5c33",
   "#ffff33",
   "#e6e6e6",
   "#c6538c"
  ]
  this.colorsRandom = []
  this.words_selected = []
 }
 //get topic of words
 GetTypes = () => {
  return Object.keys(this.words)
 }

 //load data game store before begin play game
 Load = () => {
  //this.ClearDataStore()
  this.dataStore = this.GetDataStore()
 }
//timer with condition is allow timer start and not pause game 
 Timer = () => {
  if (this.isTimerStart && this.isGamePause == false) {
   this.minutes = Math.floor(this.timeLimit / 60)
   this.seconds = this.timeLimit % 60;
   this.seconds = this.seconds < 10 ? '0' + this.seconds: this.seconds;
   this.minutes = this.minutes < 10 ? '0' + this.minutes: this.minutes
   this.timeLimit--; 
   //if time end check game win or game lose
   if (this.timeLimit < 0) {
    if (this.CheckGameWin() == false) {
     this.isGameOver = true
     this.isGamePause = true 
    }
   }
   //remove safe time countdown
   this.minutes == 0 && this.seconds == 0 ? clearInterval(this.timeCountDown): this.timeCountDown;
  }
 }
 //get data store
 GetDataStore = () => {
  if (localStorage.getItem("dataStore")) {
   return JSON.parse(localStorage.getItem('dataStore'))
  } else {
   return this.dataStore
  }
 }

 //save data store
 SaveDataStore = () => {
  localStorage.setItem("dataStore", JSON.stringify(this.dataStore))
 }
 
 //clear data store
 ClearDataStore = () => {
  localStorage.removeItem("dataStore")
 }

 //get time limit
 GetTimeLimit = () => {
  return  this.words[this.type].collection[this.level].timeLimit
 }
 
 //check word select is exist
 CheckWordSelectExist = (word) => {
  return this.words_selected.indexOf(word) > -1
 }
 
 //push word select after check exist
 PushWordSelect = (word) => {
  this.words_selected.push(word)
 }

 //check topic is valid
 //if index type < index type  check
 CheckTypeIsValid = (typeCheck) => {
  let types = this.GetTypes()
  let index_type = types.indexOf(typeCheck)
  return index_type <= this.dataStore.type
 }

 //next level 
 NextLevel = () => {
  let types = this.GetTypes()
  let next = this.GetNextLevel()
  //if next level valid
  if (next) {
   this.type = types[next.type]
   this.level = next.level
  }
 }
 //get color random
 GetColor = () => {
  let wordsLength = this.GetWords().length
  if (this.colorsRandom.length == 0) {
   let colors = Object.assign([], this.colors)
   for (let i = 0; i < wordsLength; i++) {
    if (colors.length == 0) {
     colors = Object.assign([], this.colors)
    }
    let indexRandom = Math.floor(Math.random() * colors.length)
    this.colorsRandom.push(colors[indexRandom])
    colors.splice(indexRandom, 1)
   }
  }
  return this.colorsRandom[this.colorsRandom.length - 1]
 }
 
 //setting rows and cols before play game
 GetRowCols = () => {
  return {
   rows: this.words[this.type].collection[this.level].rows,
   cols: this.words[this.type].collection[this.level].cols
  }
 }

 //pop color random
 PopColorRandom = () => {
  this.colorsRandom.pop()
 }

 //get list words
 //split string to array by commas
 //convert word lowercase to uppercase
 //remove space character "-"
 GetWords = (orignal = false) => {
  let words = []
  let wordsList = this.words[this.type].collection[this.level].data.split(",")
  for (let word of wordsList) {
   let w = word
   if(orignal == false)
   w = w.replaceAll(/\-/g,"")
   words.push(w.toUpperCase())
  }
  return words
 }

 //get word unselected
 //check word have in words selected
 GetWordUnSelected = () => {
  let words = this.GetWords()
  for (let word of words) {
   if (this.words_selected.indexOf(word) < 0) {
    return word
   }
  }
  return null
 }

 //check game win?
 //if list words selected have length == words list length
 //if game win then save data to store
 //and unlock level or topic new in game
 CheckGameWin = () => {
  if (this.isCheckGameWin) {
   let words = this.GetWords()
   if (this.words_selected.length == words.length) {
    let next = this.GetNextLevel() 
    if (next && next.can_save) {
     this.dataStore.level = next.level
     this.dataStore.type = next.type
     this.SaveDataStore()
    } 
    this.isGamePause = true
    this.isGameWin = true
    this.isTimerStart = false
    return true
   }
   return false
  }
 }
 //get next level
 //check level in data store have is on the last level in topic?
 //if is on the last level then unlock topic new and reet level to 0
 //else not unlock level new and return level before
 GetNextLevel = () => {
  let types = this.GetTypes()
  let index_type = types.indexOf(this.type)
  if (index_type == this.dataStore.type) {
   if (this.level == this.dataStore.level) {
    if (this.dataStore.level + 1 < this.words[types[this.dataStore.type]].collection.length) {
     return {
      level: this.dataStore.level + 1,
      type: this.dataStore.type,
      can_save: true
     }
    } else {
     return {
      type: this.dataStore.type + 1,
      level: 0,
      can_save: true
     }
    }
   }
  }
  if (this.level + 1 == this.words[this.type].collection.length) {
   return {
    type: index_type + 1,
    level: 0,
    can_save: false
   }
  } else {
   return {
    type: index_type,
    level: this.level + 1,
    can_save: false
   }
  }
 }

 //Reset Game
 //Reset all parameter in game
 //include variable boolean and size or time ....
 ResetGame = () => {
  this.isGamePause = false
  this.isGameOver = false
  this.isGameReset = false
  this.isCheckGameWin = false
  this.isGameWin = false
  this.isTimerStart = false
  this.isSetTimer = false
  this.isLockButton = false
  this.minutes = 0
  this.seconds = 0
  this.words_selected = []
  this.colorsRandom = []
  this.rows = this.GetRowCols().rows
  this.cols = this.GetRowCols().cols
  this.size = this.grid_width / this.cols
  this.timeLimit = this.GetTimeLimit() 
  if (this.timeCountDown) {
   clearInterval(this.timeCountDown)
  }
 }
}