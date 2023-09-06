class Grid extends GameObject {
  constructor() {
    super()
    // this.GM = window.gameManager
    // this.ctxt = this.GM.ctxt
    this.cells = []
    this.lines = []
    this.valid_cells = [] 
    this.list_cell_selected = [] 
    this.line_object = null 
    this.selected_cell = null 
    this.text_select = "" 
    this.is_random_complete = false 
    this.is_create_grid = false
    this.is_grid_complete = true 
    this.is_animation_end = false
    this.text_select_object = new TextSelectObject()
    this.MAudio = new ManagerAudio()
    this.words_in_grid = {}
    this.direction = {
      TOP: 0,
      BOTTOM: 1,
      LEFT: 2,
      RIGHT: 3,
      LEFT_TOP: 4,
      RIGHT_BOTTOM: 5,
      RIGHT_TOP: 6,
      LEFT_BOTTOM: 7
    }
  }

  ResetGrid = () => {
    this.cells = []
    this.lines = []
    this.valid_cells = [] 
    this.list_cell_selected = [] 
    this.line_object = null 
    this.selected_cell = null 
    this.text_select = "" 
    this.is_random_complete = false 
    this.is_create_grid = false
    this.is_grid_complete = false
    this.is_animation_end = false 
    this.text_select_object.text = "Loading..."
    this.words_in_grid = {}  
  }

  CreateGrid = () => {  
    for (let i = 0; i < this.GM.rows; i++) {
      this.cells[i] = []
      for (let j = 0; j < this.GM.cols; j++) {
        let cell = new Cell()
        cell.indexCol = j
        cell.indexRow = i
        cell.size = this.GM.size
        cell.text = ""
        cell.Init()
        this.cells[i][j] = cell
      }
    }
    this.is_create_grid = true
  }

  //set fill aphalbet random in the cell empty of grid
  SetFillAphalbet = () => { 
    for (let i = 0; i < this.GM.rows; i++) {
      for (let j = 0; j < this.GM.cols; j++) {
        let cell = this.cells[i][j]
        //check cell length equal 0 mean is cell empty
        //random index of array aphalbets and set text in the cell
        if (cell.text.length == 0) {
          let indexRandom = Math.floor(Math.random() * this.aphalbets.length)
          cell.text = this.aphalbets[indexRandom]
        }
      }
    }
  } 
  //set word after random in the cell of grid
  SetRandomAphalbet = () => {
    // console.log("step count")
    this.words_in_grid = {}
    //get list words
    let data = this.GM.GetWords()
    //sure set compete in cell we reset text of cell grid
    for (let i = 0; i < this.GM.rows; i++) {
      for (let j = 0; j < this.GM.cols; j++) {
        this.cells[i][j].text = ""
      }
    }
    //get all step and direction possible set text in the cell a way vaild
    for (let i = 0; i < data.length; ++i) {
      let word = data[i]
      let listIndexRowCol = []
      let wordLength = word.length
      //get all direction
      for (let r = 0; r < this.GM.rows; r++) {
        for (let c = 0; c < this.GM.cols; c++) {
          let list_direction = this.GetDirectionList(r, c, word)
          if (list_direction.length > 0) {
            listIndexRowCol.push({ indexRow: r, indexCol: c, directions: list_direction })
          }
        }
      }
      //if have error not found way set word in cell..we will reset function
      if (listIndexRowCol.length == 0) {
        return
      }
      //sure all can set in cell
      //after choose a index random list direction
      let index_list = Math.floor(Math.random() * listIndexRowCol.length)
      let indexRowRandom = listIndexRowCol[index_list].indexRow
      let indexColRandom = listIndexRowCol[index_list].indexCol
      let direction = listIndexRowCol[index_list].directions[Math.floor(Math.random() * listIndexRowCol[index_list].directions.length)]
      //proccess set word
      let positions = []
      for (let j = 0; j < wordLength; j++) {
        //direction top
        if (direction == this.direction.TOP) {
          this.cells[indexRowRandom - j][indexColRandom].text = word[j]
          //save position top
          positions.push({ r: indexRowRandom - j, c: indexColRandom })
        }
        //direction bottom
        else if (direction == this.direction.BOTTOM) {
          this.cells[indexRowRandom + j][indexColRandom].text = word[j]
          //save position bottom
          positions.push({ r: indexRowRandom + j, c: indexColRandom })
        }
        //direction left
        else if (direction == this.direction.LEFT) {
          this.cells[indexRowRandom][indexColRandom - j].text = word[j]
          //save position left
          positions.push({ r: indexRowRandom, c: indexColRandom - j })
        }
        //direction right
        else if (direction == this.direction.RIGHT) {
          this.cells[indexRowRandom][indexColRandom + j].text = word[j]
          //save position right
          positions.push({ r: indexRowRandom, c: indexColRandom + j })
        }
        //direction left top
        else if (direction == this.direction.LEFT_TOP) {
          this.cells[indexRowRandom - j][indexColRandom - j].text = word[j]
          //save position left top
          positions.push({ r: indexRowRandom - j, c: indexColRandom - j })
        }
        //direction right bottom
        else if (direction == this.direction.RIGHT_BOTTOM) {
          this.cells[indexRowRandom + j][indexColRandom + j].text = word[j]
          //save position right bottom
          positions.push({ r: indexRowRandom + j, c: indexColRandom + j })
        }
        //direction right;top
        else if (direction == this.direction.RIGHT_TOP) {
          this.cells[indexRowRandom - j][indexColRandom + j].text = word[j]
          //save position right top
          positions.push({ r: indexRowRandom - j, c: indexColRandom + j })
        }
        //direction left bottom
        else if (direction == this.direction.LEFT_BOTTOM) {
          this.cells[indexRowRandom + j][indexColRandom - j].text = word[j]
          //save position left bottom
          positions.push({ r: indexRowRandom + j, c: indexColRandom - j })
        }
      }
      //save position words recent in cell
      this.words_in_grid[word] = positions
    }
    //after set notifition is compete
    this.is_random_complete = true
  } 
  //set animation word after set random aphalbets compete
  SetAnimationAphabet = () => {
    let animation_time_limited = 2
    for (let i = 0; i < this.GM.rows; i++) {
      for (let j = 0; j < this.GM.cols; j++) {
        let cell = this.cells[i][j]
        let textObject = cell.textObject
        textObject.isAnimation = true
        textObject.animation_time_limited = animation_time_limited
      }
      animation_time_limited += 2
    } 
  }
  //get list direction have random of a word
  GetDirectionList = (indexRowRandom, indexColRandom, word) => {
    let wordLength = word.length - 1
    let list = []
    //check direction top can push generate list random.
    if (indexRowRandom - wordLength >= 0) {
      //check letter set in grid is valid
      let isPush = true
      for (let i = 0; i < word.length; i++) {
        let cell = this.cells[indexRowRandom - i][indexColRandom]
        if (cell.text.length > 0) {
          if (cell.text != word[i]) {
            isPush = false
            break
          }
        }
      }
      if (isPush)
        list.push(this.direction.TOP)
    }
    //check direction left can push generate random.
    if (indexColRandom - wordLength >= 0) {
      //check letter set grid direction left is valid
      let isPush = true
      for (let i = 0; i < word.length; i++) {
        let cell = this.cells[indexRowRandom][indexColRandom - i]
        if (cell.text.length > 0) {
          if (cell.text != word[i]) {
            isPush = false
            break
          }
        }
      }
      //if direction left valid then add direction left in list
      if (isPush)
        list.push(this.direction.LEFT)
    }
    //check direction left-top can push generate random.
    if (indexColRandom - wordLength >= 0 && indexRowRandom - wordLength >= 0) {
       //check letter set grid direction left-top is valid
      let isPush = true
      for (let i = 0; i < word.length; i++) {
        let cell = this.cells[indexRowRandom - i][indexColRandom - i]
        if (cell.text.length > 0) {
          if (cell.text != word[i]) {
            isPush = false
            break
          }
        }
      }
      //if direction left valid then add direction left in list
      if (isPush)
        list.push(this.direction.LEFT_TOP)
    }
    //check direction left-bottom can push generate random.
    if (indexColRandom - wordLength >= 0 && indexRowRandom + wordLength < this.GM.rows) {
       //check letter set grid direction left-bottom is valid
      let isPush = true
      for (let i = 0; i < word.length; i++) {
        let cell = this.cells[indexRowRandom + i][indexColRandom - i]
        if (cell.text.length > 0) {
          if (cell.text != word[i]) {
            isPush = false
            break
          }
        }
      }
      //if direction left-bottom valid then add direction left-bottom in list
      if (isPush)
        list.push(this.direction.LEFT_BOTTOM)
    }
    //check direction bottom can push generate random.
    if (indexRowRandom + wordLength < this.GM.rows) {
       //check letter set grid direction bottom is valid
      let isPush = true
      for (let i = 0; i < word.length; i++) {
        let cell = this.cells[indexRowRandom + i][indexColRandom]
        if (cell.text.length > 0) {
          if (cell.text != word[i]) {
            isPush = false
            break
          }
        }
      }
      //if direction bottom valid then add direction bottom in list
      if (isPush)
        list.push(this.direction.BOTTOM)
    }
    //check direction right can push generate random.
    if (indexColRandom + wordLength < this.GM.cols) {
       //check letter set grid direction right is valid
      let isPush = true
      for (let i = 0; i < word.length; i++) {
        let cell = this.cells[indexRowRandom][indexColRandom + i]
        if (cell.text.length > 0) {
          if (cell.text != word[i]) {
            isPush = false
            break
          }
        }
      }
       //if direction right valid then add direction right in list
      if (isPush)
        list.push(this.direction.RIGHT)
    }
    //check direction right-top can push generate random.
    if (indexColRandom + wordLength < this.GM.cols && indexRowRandom - wordLength >= 0) {
       //check letter set grid direction right-top is valid
      let isPush = true
      for (let i = 0; i < word.length; i++) {
        let cell = this.cells[indexRowRandom - i][indexColRandom + i]
        if (cell.text.length > 0) {
          if (cell.text != word[i]) {
            isPush = false
            break
          }
        }
      }
   
      if (isPush)
        list.push(this.direction.RIGHT_TOP)
    }
    //check direction right-bottom can push generate random.
    if (indexColRandom + wordLength < this.GM.cols && indexRowRandom + wordLength < this.GM.rows) {
       //check letter set grid direction right-bottom is valid
      let isPush = true
      for (let i = 0; i < word.length; i++) {
        let cell = this.cells[indexRowRandom + i][indexColRandom + i]
        if (cell.text.length > 0) {
          if (cell.text != word[i]) {
            isPush = false
            break
          }
        }
      }
     //if direction right-bottom valid then add direction right-bottom in list
      if (isPush)
        list.push(this.direction.RIGHT_BOTTOM)
    }
    return list
  }
 

  //get select cell in gird
  GetSelectedCell = (x, y) => {
    this.valid_cells = []
    this.text_select = ""
    this.selected_cell = null
    for (let i = 0; i < this.GM.rows; i++) {
      for (let j = 0; j < this.GM.cols; j++) {
        let cell = this.cells[i][j]
        //if touch in cell
        //save cell selected make cell start draw line
        if (cell.InSide(x, y)) {
          this.selected_cell = cell
          this.line_object = new LineObject(this.ctxt)
          this.line_object.x = cell.x + cell.size / 2
          this.line_object.y = cell.y + cell.size / 2
          this.line_object.targetX = cell.x + cell.size / 2
          this.line_object.targetY = cell.y + cell.size / 2
          this.line_object.lineWidth = this.GM.size - 10
          this.line_object.color = this.GM.GetColor()
          this.line_object.Init() 
          let { indexCol, indexRow } = this.selected_cell
          //get rows 
          for (let i = 0; i < this.GM.cols; i++) {
            this.valid_cells.push(this.cells[indexRow][i])
          }
          //get cols  
          for (let i = 0; i < this.GM.rows; i++) {
            this.valid_cells.push(this.cells[i][indexCol])
          }
          //get dialog top left - bottom right  
          for (let i = 1; i < Math.max(this.GM.rows, this.GM.cols); i++) {
            if (i + indexRow >= this.GM.rows || i + indexCol >= this.GM.cols)
              break
            this.valid_cells.push(this.cells[indexRow + i][indexCol + i])
          }
          //get dialog bottom right - top left 
          for (let i = 1; i < Math.max(this.GM.rows, this.GM.cols); i++) {
            if (indexRow - i < 0 || indexCol - i < 0) break
            this.valid_cells.push(this.cells[indexRow - i][indexCol - i])
          }
          //get dialog top right - bottom left
          for (let i = 1; i < Math.max(this.GM.rows, this.GM.cols); i++) {
            if (i + indexRow >= this.GM.rows || indexCol - i < 0)
              break
            this.valid_cells.push(this.cells[indexRow + i][indexCol - i])
          }
          //get dialog bottom left - top right
          for (let i = 1; i < Math.max(this.GM.rows, this.GM.cols); i++) {
            if (indexRow - i < 0 || indexCol + i >= this.GM.cols) break
            this.valid_cells.push(this.cells[indexRow - i][indexCol + i])
          }
          return cell
        }
      }
    }
    return null
  } 
  //get select when touch move or mouse move
  GetSelectdCellWhenMove = (x, y) => {
    //check all cell around distance cell lowest then choose
    if (this.valid_cells.length) {
      let distanceMin = 10000
      let cell_target = null
      for (let cell of this.valid_cells) {
        if (cell) {
          let distance = cell.GetDistanceClosestInside(x, y)
          if (distance < distanceMin) {
            distanceMin = distance
            cell_target = cell
          }
        }
      }
      //to cell target
      if (cell_target) {
        this.list_cell_selected = []
        let { indexRow, indexCol } = this.selected_cell
        let indexRowTarget = cell_target.indexRow
        let indexColTarget = cell_target.indexCol
        let text = ""
        if (indexCol == indexColTarget) {
          if (indexRowTarget > indexRow) {
            for (let i = indexRow; i <= indexRowTarget; i++) {
              let cell = this.cells[i][indexCol]
              text += cell.text
              this.list_cell_selected.push(cell)
            }
          } else {
            for (let i = indexRowTarget; i <= indexRow; i++) {
              let cell = this.cells[i][indexCol]
              text = cell.text + text
              this.list_cell_selected.push(cell)
            }
          }
        }
        if (indexRow == indexRowTarget) {
          if (indexColTarget > indexCol) {
            for (let i = indexCol; i <= indexColTarget; i++) {
              let cell = this.cells[indexRow][i]
              text += cell.text
              this.list_cell_selected.push(cell)
            }
          } else {
            for (let i = indexColTarget; i <= indexCol; i++) {
              let cell = this.cells[indexRow][i]
              text = cell.text + text
              this.list_cell_selected.push(cell)
            }
          }
        }
        if (indexRow > indexRowTarget && indexCol > indexColTarget) {
          for (let i = 0; i <= indexRow - indexRowTarget; i++) {
            let cell = this.cells[indexRowTarget + i][indexColTarget + i]
            text = cell.text + text
            this.list_cell_selected.push(cell)
          }
        } else if (indexRow < indexRowTarget && indexCol < indexColTarget) {
          for (let i = 0; i <= indexRowTarget - indexRow; i++) {
            let cell = this.cells[indexRowTarget - i][indexColTarget - i]
            text = cell.text + text
            this.list_cell_selected.push(cell)
          }
        }
        if (indexRowTarget > indexRow && indexColTarget < indexCol) {
          for (let i = 0; i <= indexRowTarget - indexRow; i++) {
            let cell = this.cells[indexRowTarget - i][indexColTarget + i]
            text = cell.text + text
            this.list_cell_selected.push(cell)
          }
        } else if (indexRowTarget < indexRow && indexColTarget > indexCol) {
          for (let i = 0; i <= indexRow - indexRowTarget; i++) {
            let cell = this.cells[indexRow - i][indexCol + i]
            text += cell.text
            this.list_cell_selected.push(cell)
          }
        } 
        let text_select_old = this.text_select
        this.text_select = ""
        for (let cell of this.list_cell_selected) {
          this.text_select += cell.text
        }
        this.text_select_object.text = text
        if(this.text_select != text_select_old){
          this.MAudio.PlayMoveMouse()
        } 
        if (this.text_select.length > 0) { 
          this.line_object.targetX = cell_target.x + cell_target.size / 2
          this.line_object.targetY = cell_target.y + cell_target.size / 2
        }
      }
    }
  }
  //check word match
  //if word match add in list word selects
  //create line new move to target position
  CheckWordMatch = () => {
    let data = this.GM.GetWords()
    let textReverse = [...this.text_select].reverse().join("")
    let isMatch = data.indexOf(this.text_select) > -1
    let isMatchReverse = data.indexOf(textReverse) > -1
    if (this.GM.CheckWordSelectExist(this.text_select) == false &&
      this.GM.CheckWordSelectExist(textReverse) == false) {
      if (isMatch || isMatchReverse) {
        this.lines.push(this.line_object)
        this.MAudio.PlayWordCorrect()
        if (isMatch)
          this.GM.PushWordSelect(this.text_select)
        if (isMatchReverse)
          this.GM.PushWordSelect(textReverse)
        let timeLimited = 5
        for (let cell of this.list_cell_selected) {
          cell.textObject.isAnimationSelected = true
          cell.textObject.animation_time_limited_selected = timeLimited
          timeLimited += 5
        }
        this.GM.PopColorRandom()
      } else { 
        if(this.line_object){
          this.line_object.targetX = this.line_object.startX
          this.line_object.targetY = this.line_object.startY
          this.line_object.isHide = true
        }
      }
    } else { 
      if(this.line_object){
        this.line_object.targetX = this.line_object.startX
        this.line_object.targetY = this.line_object.startY
      }
    }
    this.text_select_object.text = ""
  }
   
  // AutoSearchWord = () => {
  //   if (this.GM.isAutoSearchWord) {
  //     let unselectText = this.GM.GetWordUnSelected()
  //     if (unselectText) {
  //       let item = this.words_in_grid[unselectText]
  //       if (item) {
  //         let start = item[0]
  //         let end = item[item.length - 1]
  //         let cell_start = this.cells[start.r][start.c]
  //         let cell_end = this.cells[end.r][end.c]
  //         let timeLimited = 5
  //         for (let index of item) {
  //           let cell = this.cells[index.r][index.c]
  //           cell.textObject.isAnimationSelected = true
  //           cell.textObject.animation_time_limited_selected = timeLimited
  //           timeLimited += 5
  //         }
  //         this.line_object = new LineObject(this.ctxt)
  //         this.line_object.x = cell_start.x + cell_start.size / 2
  //         this.line_object.y = cell_start.y + cell_start.size / 2
  //         this.line_object.targetX = cell_end.x + cell_end.size / 2
  //         this.line_object.targetY = cell_end.y + cell_end.size / 2
  //         this.line_object.lineWidth = this.GM.size - 10
  //         this.line_object.color = this.GM.GetColor()
  //         this.line_object.Init()
  //         this.GM.PushWordSelect(unselectText)
  //         this.GM.PopColorRandom()
  //         this.lines.push(this.line_object)
  //       }
  //     }
  //     this.GM.isAutoSearchWord = false
  //   }
  // }
  //draw background gird
  //with margin top gird and margin left gift
  DrawBG = () => {
    this.ctxt.save()
    this.ctxt.beginPath()
    this.ctxt.fillStyle = "white"
    this.ctxt.strokeStyle = "rgba(0,0,0,.2)"
    this.ctxt.fillRect(this.GM.margin_left_grid, this.GM.margin_top_grid, this.GM.cols * this.GM.size, this.GM.rows * this.GM.size)
    this.ctxt.strokeRect(this.GM.margin_left_grid, this.GM.margin_top_grid, this.GM.cols * this.GM.size, this.GM.rows * this.GM.size)
    this.ctxt.closePath()
    this.ctxt.restore()
  }

  Draw = () => {
    this.DrawBG()
    this.text_select_object.Draw()
    for (let line of this.lines) {
      line.Draw()
    }
    if (this.line_object) {
      this.line_object.Draw()
    }
    if(this.cells.length > 0){
      for (let i = 0; i < this.GM.rows; i++) {
        for (let j = 0; j < this.GM.cols; j++) {
          this.cells[i][j].Draw()
        }
      }
    }
  }
 
  Update = () => { 
    if(this.is_grid_complete == true && this.is_animation_end == false){ 
      let _is_animation_end = true
       if(this.cells.length > 0){
        for(let i = 0; i < this.GM.rows; i++){
           for(let j = 0; j < this.GM.cols; j++){
             if(this.cells[i][j].textObject.isAnimation){
               _is_animation_end = false
             }
           }
         }
         this.GM.isTimerStart = true
         this.is_animation_end = _is_animation_end
         this.text_select_object.text = "" 
       }
    }
 
  //  this.AutoSearchWord()
    if (this.line_object) {
      this.line_object.Update()
    }
    if(this.cells.length > 0){
     let is_animation_select_end = true
      for (let i = 0; i < this.GM.rows; i++) {
        for (let j = 0; j < this.GM.cols; j++) {
          let cell = this.cells[i][j]
          if(cell.textObject.isAnimationSelected)
          {
           is_animation_select_end = false
          }
          cell.Update()
        }
      }
      this.GM.isCheckGameWin = is_animation_select_end
    }
  }
}