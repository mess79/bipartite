//const events = require('events');
const fn = require('./lib.js');

class view {
  constructor(args) {

    if (args.controller) {
      this.controller = args.controller
    }
    /*
    //in the pipeline to use for creating full connection to controller and model from the view
    if(args.model){
      this.model = args.model
    }
    */
    if (args.el) {
      this.el = args.el
    } else {
      this.el = el;
    }
    this.id = fn.id()
    this.list = this.el.querySelectorAll("[bi]")
    //working on this
    //this.map = this.el.querySelectorAll("[bi-map]")
    this.props = []
    this.view_collection = []
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
        let result = this.controller.model.change.updated
        if (event === "setup" || Object.keys(result).length === 0 && obj.constructor === Object) {
          result = this.controller.model.obj
        }
        for (let p = 0; p < prop.length; p++) {
          if (Array.isArray(result[prop[p]]) || typeof result[prop[p]] === "number" || typeof result[prop[p]] === "boolean" || typeof result[prop[p]] === "string" || result[prop[p]] && Object.keys(result[prop[p]]).length > 0 && result[prop[p]].constructor === Object) {
            result = result[prop[p]]
            if (p + 1 === prop.length) {
              this.viewUpdate(this.props[i], result)
            }
          }
        }
      } catch (err) {
        console.log(err)
      }
    }
  }
  viewUpdate(prop, result) {
    //console.log(prop, result)
    for (let p of this.list) {
      if (p.getAttribute("bi") === prop || p.getAttribute("bi-temp") === prop) {

        const domChanger = function(p, result) {
          //console.log(p, result)
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
        if (Array.isArray(result) && p.getAttribute("bi-type") === "map") {
          let items = p.querySelectorAll("[bi-type='template']")
          //console.log(items)
          if (items.length > 0 && !items[0].hasAttribute("bi-count")) {
            items[0].setAttribute("bi-count", "0")
            this.listen(items[0].querySelectorAll('[bi-temp]'))
            //this.listen()
          }
          for (i = items.length; i < result.length; i++) {
            let clonedTemplate = items[0].cloneNode(true)
            clonedTemplate.setAttribute("bi-count", i)
            this.listen(clonedTemplate.querySelectorAll('[bi-temp]'))
            p.appendChild(clonedTemplate)
          }
          //items = p.querySelectorAll('[bi-temp]')
          for (i = 0; i < items.length; i++) {
            item = items[i].querySelectorAll('[bi-temp]')
            for (a = 0; a < item.length; a++) {
              let itemProp = item[a].getAttribute("bi-temp")
              let itemResult = result[i][itemProp]
              if (itemProp === "*") {
                itemResult = result[i]
              }
              domChanger(item[a], itemResult)
            }
          }
        } else {
          //console.log(p, result)
          domChanger(p, result)
        }
      }
    }
  }
  /*stopListen(){
    for (let p of this.list) {
      p.removeEventListener("input", checkAndUpdate)
    }
  }*/
  listen(list) {

    /////////////////// sort out listening to arrays

    let self = this
    //console.log(this.list)
    if (!list) {
      list = this.list
    }
    //console.log(list)
    for (let p of list) {


      let checkAndUpdate = function() {
        let obj = {}
        let props = []
        let propsChildren = []
        let propCount
        if (p.getAttribute("bi")) {
          props = p.getAttribute("bi").split(".")
        } else if (p.getAttribute("bi-temp")) {
          props = p.closest("[bi-type='map']").getAttribute("bi").split(".") //.split(".")
          propsChildren = p.getAttribute("bi-temp").split(".")
          propCount = p.closest("[bi-type='template']").getAttribute("bi-count")
          props = props.concat([propCount], propsChildren)
        }
        let output = obj;
        for (let a = 0; a <= propsChildren.length; a++) {
          for (let i = 0; i < props.length; i++) {
            let end = {}
            if (!isNaN(props[i+1])) {
              end = []
            }
            if (i + 1 === props.length) {
              if (p.tagName === "INPUT" && p.getAttribute("type") === "checkbox") {
                end = p.checked
              } else {
                end = p.value
              }

            }
            output = output[props[i]] = end;
          }
        }
        console.log("view", obj)
        self.controller.model.update(obj)
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
