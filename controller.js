const events = require('events');
const fn = require('./lib.js');

class controller {
  constructor(obj) {
    let self = this
    this.obj = obj
    this.type = obj.constructor.name
    obj.event.addListener('update', function(data) {
      self.update(data, self.obj.obj)
    })
    obj.event.addListener('add', function(data) {
      self.add(data, self.obj.obj)
    })
    obj.event.addListener('remove', function(data) {
      self.remove(data, self.obj.obj)
    })
    obj.event.addListener('destroy', function() {
      self.destroy()
    })
    obj.event.addListener('detach', function(data) {
      self.detach(data)
    })
    /*obj.event.addListener('detached', function() {
      self.detached()
    })*/
    obj.event.addListener('destroyCollection', function() {
      self.destroyCollection()
    })
    obj.event.addListener('load', function() {
      self.load()
    })
    obj.event.addListener('save', function() {
      self.save()
    })
  }
  collection() {
    return this.obj.obj
  }
  update(data, changedata, obj) {
    switch (this.type) {
      case "model":
        console.log("model update (default controller)")
        break;
      case "collection":
        console.log("collection update (default controller)")
        break;
    }
  }
  add(data, changedata, obj) {
    switch (this.type) {
      case "model":
        console.log("model add (default controller)")
        break;
      case "collection":
        console.log("collection add (default controller)")
        break;
    }
  }
  remove(data, changedata, obj) {
    switch (this.type) {
      case "model":
        console.log("model remove (default controller)")
        break;
      case "collection":
        console.log("collection remove (default controller)")
        break;
    }
  }
  destroy(data, changedata) {
    switch (this.type) {
      case "model":
        console.log("model destroy (Model) (default controller)")
        break;
      case "collection":
        console.log("collection destroy (Model) (default controller)")
        break;
    }
  }
  detach(data) {
    switch (this.type) {
      case "model":
        console.log("model detach (Model) (default controller)")
        break;
      case "collection":
        console.log("collection detach (Model) (default controller)")
        break;
    }
  }
  destroyCollection(data, changedata) {
    console.log("collection destroy (Collection) (default controller)")
  }
  load(data, changedata) {
    switch (this.type) {
      case "model":
        console.log("model load (default controller)")
        break;
      case "collection":
        console.log("collection load (default controller)")
        break;
    }
  }
  save(data, changedata) {
    switch (this.type) {
      case "model":
        console.log("model save (default controller)")
        break;
      case "collection":
        console.log("collection save (default controller)")
        break;
    }
  }
}
module.exports = controller