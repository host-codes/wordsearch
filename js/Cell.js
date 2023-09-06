class Cell extends GameObject {
  constructor() {
    super()
    // this.GM = window.gameManager
    // this.ctxt = this.GM.ctxt
    this.x = 0
    this.y = 0
    this.indexRow = 0
    this.indexCol = 0
    this.text = "" 
    this.textObject = null
    this.isActive = false
  }

  Init = () => { 
    this.x = this.GM.margin_left_grid + this.GM.size * this.indexCol
    this.y = this.GM.margin_top_grid + this.GM.size * this.indexRow
    this.textObject = new TextObject(this.ctxt, this.text)
    this.textObject.x = this.x + this.GM.size / 2
    this.textObject.y = this.y + this.GM.size / 2
  }

  InSide = (x , y) => {
    return (this.x <= x && x <= this.x + this.GM.size &&
               this.y <= y && y <= this.y + this.GM.size)
  }

  GetDistanceClosestInside = (x, y) => {
    let centerPointX = x
    let centerPointY = y
    let centerX = this.x + this.GM.size / 2
    let centerY = this.y + this.GM.size / 2
    let dx = Math.abs(centerX - centerPointX)
    let dy = Math.abs(centerY - centerPointY)
    return Math.sqrt(dx * dx + dy * dy)
  }
 
  Draw = () => {
    this.textObject.Draw()
   this.ctxt.save()
   this.ctxt.beginPath()  
   if(this.isActive){ 
     this.ctxt.strokeStyle = "red"
   } 
   this.ctxt.closePath() 
   this.ctxt.restore()
  
  }

  Update = () => { 
    this.textObject.text = this.text
    this.textObject.Update()
  }
}