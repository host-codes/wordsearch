/**
 * Line Object Class
 * = descreption 
 *  + create line color when move select word or choose word
 */

class LineObject {
  constructor(ctxt) {
    this.x = 0
    this.y = 0
    this.targetX = 0
    this.targetY = 0
    this.startX = 0
    this.startY = 0
    this.ctxt = ctxt
    this.lineWidth = 4
    this.color = "red"
    this.speed = 15
    this.isHide = false
  }

  Init = () => {
    this.startX = this.x
    this.startY = this.y
  }
 //move from cell position start to cell position selected
  MovingToTarget = () => {
    //calc distance move to target
    let dx = this.targetX - this.x
    let dy = this.targetY - this.y
    let d = Math.sqrt(dx * dx + dy * dy)
    //calc direction move to target
    let angle = Math.atan2(dy, dx)
    let vx = Math.cos(angle) * this.speed
    let vy = Math.sin(angle) * this.speed
    if (d > this.speed / 2) {
      this.x += vx
      this.y += vy
    } else {
      this.x = this.targetX
      this.y = this.targetY
      if(this.isHide){
       this.lineWidth = 0
      }
    }
  }
  //darw line object
  Draw = () => {
    this.ctxt.save()
    this.ctxt.beginPath()
    this.ctxt.strokeStyle = this.color
    this.ctxt.lineWidth = this.lineWidth
    this.ctxt.lineCap = 'round';
    this.ctxt.moveTo(this.startX, this.startY)
    this.ctxt.lineTo(this.x, this.y)
    this.ctxt.lineWidth = 0
    this.ctxt.stroke()
    this.ctxt.closePath()
    this.ctxt.restore()
  }

  Update = () => {
    this.MovingToTarget()
  } 
}