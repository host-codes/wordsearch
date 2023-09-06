/**
 * Text Object
 * descreption:
 *  + include animation, draw, udpate
 *  + class display letter of word on grid
 */
class TextObject{
  constructor(ctxt, text){
    this.x = 0
    this.y = 0
    this.text = text
    this.ctxt = ctxt
    this.isAnimation = false
    this.isAnimationSelected = false
    this.animation_time_limited = 0
    this.animation_time_count = 0
    this.animation_time_count_selected = 0
    this.animation_time_limited_selected = 0
  } 
  Draw = () => {
    this.ctxt.save()
    this.ctxt.beginPath()
    this.ctxt.translate(this.x, this.y)
    if(this.isAnimation){
     this.ctxt.scale(this.animation_time_count / this.animation_time_limited, this.animation_time_count / this.animation_time_limited)
    }

    if(this.isAnimationSelected){
      this.ctxt.scale(this.animation_time_count_selected / this.animation_time_limited_selected, this.animation_time_count_selected / this.animation_time_limited_selected)
    }
    this.ctxt.font = "18px 'SVN-Bango'"
    this.ctxt.textBaseline = "middle"
    this.ctxt.textAlign = "center"
    this.ctxt.fillText(this.text, 0, 0)
    this.ctxt.closePath()
    this.ctxt.restore()
  }

  Update = () => {
    if(this.isAnimation){
       if(++this.animation_time_count > this.animation_time_limited){
         this.isAnimation = false 
       }
    }
    if(this.isAnimationSelected){
      if(++this.animation_time_count_selected >= this.animation_time_limited_selected){
        this.isAnimationSelected = false
        this.animation_time_count_selected = 0
      }
    }
  }
}