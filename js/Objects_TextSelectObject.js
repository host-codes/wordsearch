/**
 * Text Select Object Class
 * = descreption
 *  + display game loading and when mouse move display words
 */
class TextSelectObject extends GameObject {
  constructor() {
    super() 
    this.text = ""
  } 
  //draw text select
  Draw = () => {
    this.ctxt.save()
    this.ctxt.translate(this.GM.margin_left_grid + (this.GM.size * this.GM.cols) / 2, this.GM.margin_top_grid - 20)
    this.ctxt.font = "15px 'SVN-Bango'"
    this.ctxt.textBaseline = "middle"
    this.ctxt.textAlign = "center"
    this.ctxt.fillText(this.text, 0, 0)
    this.ctxt.restore()
  } 
}