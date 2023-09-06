class UiWidget {
  constructor() {
    this.GM = window.gameManager
    this.MAudio = new ManagerAudio()
    this.type = null
    this.screen = {
      HOME: 0,
      LEVEL: 1,
      GAME_PLAY: 2
    }
  }

  Init = () => {
    //when new in game then will open screen home
    let self = this 
    this.MAudio.Init()
    this.ScreenHome()
    this.ToggleButtonAudio() 
    //click audio
    $(document).on("click", "#button--audio", function(event){
     self.GM.isGameAudio = !self.GM.isGameAudio
     self.MAudio.PlayClick()
     self.ToggleButtonAudio()
    })
    //click topic
    $(document).on("click", ".types .type", function (event) {
      if (self.GM.CheckTypeIsValid($(this).data("type"))) { 
        self.GM.type = $(this).data("type")
        self.ScreenLevel()
        self.MAudio.PlayClick()
      }
    })
    //click level screen
    $(document).on("click", ".levels .level", function (event) {
      let level = $(this).data("level")
      if ($(this).hasClass("lock") == false) {
        self.ScreenPlay(level)
        self.MAudio.PlayClick()
      }
    })

   //click button back
    $(document).on("click", "#button--back--levels", function () { 
      self.GM.isGamePause = true
      self.MAudio.PlayClick()
      self.HideBlock()
      self.ScreenLevel()
    })
    //click back page home
    $(document).on("click", "#button--home", function () {
      self.HideBlock()
      self.MAudio.PlayClick()
      self.ScreenHome()
    })
    //click auto search
    //uncomment open autosearch
    // $(document).on("click", "#button--search", function () {
    //   self.GM.isAutoSearchWord = true
    // })
    //reset game
    $(document).on("click", "#button--reset", function () {
       $(".bg--lock").hide()
      self.GM.isGameReset = true
      self.MAudio.PlayClick()
      self.GM.isGamePause = false
      self.HideBlock()
    })
    //pasuse game
    $(document).on("click", "#button--pause", function(){
     self.GM.isGamePause = !self.GM.isGamePause
     self.MAudio.PlayClick()
     self.ToggleButtonPauseGame()
    })
    //next level game
    $(document).on("click", "#button--next", function(){ 
     self.GM.NextLevel()
     self.GM.isGameReset = true 
     self.MAudio.PlayClick()
     $(".link--type").text(self.GM.type)
     $(".link--level").text("Level " +( self.GM.level  + 1) )
     self.HideBlock()
    })
  }

  //hide block when from game play back home or level, topic screen
  HideBlock = () => {
    $(".block--gamewin").removeClass("active")
    $(".block--gameover").removeClass("active")
    $(".bg--lock").hide()
       $("#game--pause").show()
    $("#game--play").hide()
  }

  //update state
  Update = () => {
    //show game win
    if (this.GM.isGameWin) {
      $(".block--gamewin").addClass("active")
      $(".bg--lock").show()
      this.GM.isGameWin = false
      this.MAudio.PlayGameWin()
    }
    //show game over
    if (this.GM.isGameOver) {
      $(".block--gameover").addClass("active")
        $(".bg--lock").show()
      this.MAudio.PlayGameLose()
      this.GM.isGameOver = false
    }
    //set timer
    if (this.GM.isSetTimer) {
      $(".timer").text(this.GM.minutes + ":" + this.GM.seconds)
    } 
  }
  //check state game is pause
  //if game pause show icon play game and hide icon puase game
  //if game play show icon pause game and hide icon play game
  ToggleButtonPauseGame = () => {
   if(this.GM.isGamePause){
    $("#game--pause").hide()
    $("#game--play").show()
   }else{
    $("#game--pause").show()
    $("#game--play").hide()
   }
  }
  //check state audio is turn on?
  //if game audio turn on show icon audio and hide icon audio mute
  //if game audio turn off show icon audio mute and icon audio
  ToggleButtonAudio = () => {
   if(this.GM.isGameAudio){
    $("#button--audio").find("#audio").show()
    $("#button--audio").find("#audio--mute").hide()
   }else{
    $("#button--audio").find("#audio").hide()
    $("#button--audio").find("#audio--mute").show()
   }
  }
  //go to screen level
  GoToScreen = (screen_id) => {
    $(".screen--manager").css({ transform: "translateX(-" + screen_id * 100 + "%)" })
  }
  /**
   * Screen Play
   * Before game play is will reset game once begin level new
   * Show text type current and text level cureent
   */
  ScreenPlay = (level) => {
    
    this.GM.isGameReset = true 
    this.GM.level = level
    $(".link--type").text(this.GM.type)
    $(".link--level").text("Level " + (this.GM.level  + 1))
    this.GoToScreen(this.screen.GAME_PLAY)
  }
  /**
   * Screen Home
   * Lock type when index type current > index type data store
   */
  ScreenHome = () => {
    let isLock = false 
    let types = this.GM.GetTypes()
    $(".types").empty()
    for (let i = 0; i < types.length; i++) { 
      let data = this.GM.words[types[i]] 
      if (i > this.GM.dataStore.type) {
        isLock = true
      }
      $(".types").append(`<div class="type ${isLock ? 'lock' : ''}" data-type='${types[i]}'>
      <img src="${data.image}">
      <div>${data.name}</div>
    </div>`) 
    }
    this.GoToScreen(this.screen.HOME)
  }
  /**
   * Screen Level
   * Lock level when type index > type data store index
   * Lock level when type index == type data store index and level > level data store index 
   */
  ScreenLevel = () => {  
    $(".screen--levels--wapper .levels").empty()
    let types = this.GM.GetTypes()
    let collection = this.GM.words[this.GM.type].collection
    let isLock = false
    for (let i = 0 ; i <  collection.length; i++) {  
      if((types.indexOf(this.GM.type) > this.GM.dataStore.type)){
        isLock = true
      }else if((types.indexOf(this.GM.type) == this.GM.dataStore.type)){
        if(this.GM.dataStore.level < i){
          isLock = true
        }
      }
      let data = this.GM.words[this.GM.type]  
          $(".levels").append(`<div class="level ${isLock ? 'lock' : ''}"  data-level='${i}'>
          <img src="${data.image}" alt="">
          <div>Level ${i + 1}</div>
        </div>`) 
    }
    this.GoToScreen(this.screen.LEVEL)
  }
 
  //proccess auto search
  handlerSearch = () => {
    if (this.GM.isAutoSearchWord == false) {
      this.GM.isAutoSearchWord = true
    }
  }
}