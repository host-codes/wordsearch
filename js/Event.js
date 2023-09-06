/**
 * Class Event 
 * Version 1.0
 * descreption:
 *  + this is class check event touch or click move mouse...
 *  + return position x and y when touch or move mouse...
 */

class Event {
  constructor(canvas) {
    this.x = 0
    this.y = 0
    this.isTouch = false
    this.isTouchMoving = false
    this.canvas = canvas
    this.Init()
  }

  Init = () => {
    this.canvas.addEventListener("mousedown", this.MouseDownHandler, false)
    this.canvas.addEventListener("mouseup", this.MouseUpHandler, false)
    this.canvas.addEventListener("mousemove", this.MouseMoveHandler, false)
    this.canvas.addEventListener("mouseout", this.MouseUpHandler, false)
    
    this.canvas.addEventListener("touchstart", this.MouseDownHandler, false)
    this.canvas.addEventListener("touchcancel", this.MouseUpHandler, false)
    this.canvas.addEventListener("touchmove" , this.MouseMoveHandler)
    this.canvas.addEventListener("touchend" , this.MouseUpHandler, false)
  }

  MouseMoveHandler = (e) => {
    let rect =  e.target.getBoundingClientRect()
    if(e.type == 'touchmove' ){
        var touch = e.touches[0] || e.changedTouches[0]; 
        this.x = touch.pageX - rect.left;
        this.y = touch.pageY - rect.top;
    } else if (e.type == 'mousemove') {
        this.x = e.clientX - rect.left;
        this.y = e.clientY - rect.top;
    }
    this.isTouchMoving = true 
  }

  MouseUpHandler = (event) => {
    this.isTouch = false
    this.isTouchMoving = false
  }

  MouseDownHandler = (e) => { 
    let rect =  e.target.getBoundingClientRect()
    if(e.type == 'touchstart' ){
        var touch = e.touches[0] || e.changedTouches[0]; 
        this.x = touch.pageX - rect.left;
        this.y = touch.pageY - rect.top;
    } else if (e.type == 'mousedown') {
        this.x = e.clientX - rect.left;
        this.y = e.clientY - rect.top;
    }
    this.isTouch = true
    e.preventDefault()
  }
}