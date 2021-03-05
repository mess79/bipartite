const events = require('events');
const fn = require('./lib.js');

class view {
  constructor(el, controller, model) {
    this.el = el;
    this.id = fn.id()
    this.controller = controller
    this.model = model
    this.type = controller.type
    this.list = this.el.querySelectorAll("[bi]")
    this.props = []
    this.view_collection = []
    //if (this.type === "collection") {}
    for (let i = 0; i < this.list.length; i++) {
      this.props.push(this.list[i].attributes.bi.value)
    }
    if (this.controller) {
      this.addView()
    }
    this.listen()
  }
  addView() {
    this.controller.addView(this)
  }
  removeView() {
    this.controller.removeView(this)
    //this.stopListen()
  }
  // from controller
  propsUpdate(event) {
    for (let i = 0; i < this.props.length; i++) {
      let prop = this.props[i].split(".")
      try {
        let result = this.controller.obj.obj
        for (let p = 0; p < prop.length; p++) {
          result = result[prop[p]]
        }
        this.viewUpdate(this.props[i], result)
      } catch (err) {
        console.log(err)
      }
    }
  }
  viewUpdate(prop, result) {
    for (let p of this.list) {
      if (p.getAttribute("bi") === prop) {
        switch (p.tagName) {
          case "DIV":
            if (p.innerHTML !== result) {
              p.innerHTML = result
            }
            break;
          case "SELECT":
          case "TEXTAREA":
            if (p.value !== result) {
              p.value = result
            }
            break;
          case "INPUT":
            switch (p.getAttribute("type")) {
              case "checkbox":
                if (typeof result === "string") {
                  result = (result === "true")
                }
                if (p.checked !== result) {
                  p.checked = result
                }
                break;
              case "radio":
                if (p.value === result) {
                  p.checked = true;
                } else {
                  p.checked = false;
                }
                break;
              default:
                if (p.value !== result) {
                  p.value = result
                }
                break;
            }
            break
        }
      }
    }
  }
  /*stopListen(){
    for (let p of this.list) {
      p.removeEventListener("input", checkAndUpdate)
    }
  }*/
  listen() {
    let self = this
    for (let p of this.list) {
      let checkAndUpdate = function() {
        let obj = {}
        let props = p.getAttribute("bi").split(".")
        let o = obj;
        for (let i = 0; i < props.length; i++) {
          let end = {}
          if (i + 1 === props.length) {
            if (p.tagName === "INPUT" && p.getAttribute("type") === "checkbox") {
              end = p.checked
            } else {
              end = p.value
            }
          }
          o = o[props[i]] = end;
        }
        self.controller.obj.update(obj)
      }
      switch (p.tagName) {
        case "SELECT":
        case "TEXTAREA":
          p.addEventListener("input", checkAndUpdate)
          break;
        case "INPUT":
          switch (p.getAttribute("type")) {
            case "checkbox":
              p.addEventListener("change", checkAndUpdate)
              break;
            case "radio":
              p.addEventListener("change", checkAndUpdate)
              break;
            default:
              p.addEventListener("input", checkAndUpdate)
              break;
          }
          break
      }
    }
  }
}

module.exports = view
