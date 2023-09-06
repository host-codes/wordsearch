/**
 * Word List Class 
 * =descreption 
 *  +  show the words that your task must choose
 */

class WordList extends  GameObject{
  constructor(){
    super()
    this.x = 0
    this.y = 0
    this.GM = window.gameManager 
    this.words = []
    this.wordsObject = []
    this.line_height = 40
    this.width_text = 0
    this.element_words = document.getElementById("words")
  }

  Init = () => { 
    this.words = this.GM.GetWords(true) 
    this.element_words.innerHTML = ""
    this.element_words.style.marginTop = this.GM.margin_top_grid + this.GM.rows * this.GM.size + 20
    this.element_words.style.maxWidth = this.canvas_width 
    for(let word of this.words){ 
      let element = document.createElement("div")
      element.innerText = word.replaceAll(/\-/g, " ")
      element.setAttribute("class" , "word")
      element.setAttribute("id" , "word_"+ (word.replaceAll(/\-/g, "")))
      this.element_words.append(element ) 
    }
  } 
  //update check word is have selected
  Update = () => {  
    for(let word of this.words){
      if(this.GM.words_selected.indexOf(word.replaceAll(/\-/g, "").toUpperCase()) > -1){ 
        let element = document.getElementById("word_"+word.replaceAll(/\-/g, ""))
        element.classList.add("word--selected")
       }
    }
  }
}