var events = require('events');
var fn = require('./lib.js');

class schema {
  constructor(obj) {
    this.obj = obj
  }
  prune(pruneobj) {
    return fn.prune(pruneobj, this.obj)
  }
}

class model {
  constructor(obj) {
    this.obj = fn.clone(obj)
    this.event = new events.EventEmitter()
    this.change = {}
    if (obj._id) {
      this.id = obj._id
    } else {
      this.id = fn.id();
    }
  }
  update(addObj) {
    if (addObj) {
      this.previousObj = fn.clone(this.obj)
      this.obj = addObj
      if (this.schema) {
        this.schema.prune(this)
      }
      this.change = fn.compare(this.previousObj, this.obj)
      this.event.emit('update', this);
      //console.log("update");
    }
  }
  remove(removeObj) {
    // to remove key from object
    if (removeObj) {
      this.previousObj = fn.clone(this.obj)
      if (this.schema) {
        this.schema.prune(this)
      }
      this.change = fn.compare(this.previousObj, removeObj)
      this.event.emit('remove', this);
    }
  }
  destroy() {
    // destory model
    this.event.emit('destroy');
  }
  detach() {
    console.log("detching from model")
  }
  save() {
    // save model (if not autosaving)
    this.event.emit('save');
  }
  load() {
    // load from remote server (if not autloading)
    this.event.emit('load');
  }
}

class collection {
  constructor(obj, data) {
    this.obj = fn.objectTypeValidate(obj, "array")
    this.event = new events.EventEmitter()
    if (data) {
      if (data.url) {
        this.url = data.url
      }
      if (data.schema) {
        this.schema = data.schema
      }
    }
    this.id = fn.id()
  }
  add(addObj) {
    let self = this
    // add loop to cover array of models
    if (this.schema) {
      addObj = this.schema.prune(addObj)
      addObj.schema = this.schema
    }

    function updateEvent(data) {
      self.event.emit('update', data);
    }

    function removeEvent(data) {
      self.event.emit('remove', data);
    }

    function destroyEvent(data) {
      self.event.emit('destroy', data);
    }

    function loadEvent(data) {
      self.event.emit('load', data);
    }

    function saveEvent(data) {
      self.event.emit('save', data);
    }

    function detachEvent(collection) {
      if (collection === self) {
        addObj.event.removeListener('update', updateEvent)
        addObj.event.removeListener('remove', removeEvent)
        addObj.event.removeListener('destroy', destroyEvent)
        addObj.event.removeListener('load', loadEvent)
        addObj.event.removeListener('save', saveEvent)
        addObj.event.removeListener('detach', detachEvent)
      }
    };

    addObj.event.addListener('update', updateEvent);

    addObj.event.addListener('remove', removeEvent);

    addObj.event.addListener('destroy', destroyEvent);

    addObj.event.addListener('load', loadEvent)

    addObj.event.addListener('save', saveEvent);

    addObj.event.addListener('detach', detachEvent);


    this.obj = this.obj.concat(fn.objectTypeValidate(addObj, "array"))
    this.event.emit('add', this.obj, addObj);
  }
  update(updateObj, query) {
    // to add the same update to all models - bulk
    for (let i of this.obj) {
      if (!query || fn.query(i, query)) {
        i.update(updateObj)
      }
    }
    //this.event.emit('update');
  }
  remove(removeObj, query) {
    // to remove the same update to all models - bulk
    for (let i of this.obj) {
      if (!query || fn.query(i, query)) {
        i.remove(removeObj)
      }
    }
    this.event.emit('remove');
  }
  detach(model) {
    // detach all listeners from collection for model
    if (model) {
      model.event.emit('detach', this);
      this.event.emit("detach", model)
    } else {
      console.log("no model to detach from collection")
    }
  }
  findAndDetach(query) {
    // run a query to then detach each matching model
    for (let i of this.obj) {
      if (Object.keys(query).length > 0 && fn.query(i, query)) {
        this.detach(i)
      }
    }
  }
  destroyCollection() {
    // destroy collection
    this.event.emit('destroyCollection');
  }
  save() {
    // save collection (if not autosaving)
    this.event.emit('save');
  }
  load() {
    // load from remote server (if not autloading)
    this.event.emit('load');
  }
  models() {
    return this.obj.map(x => x.obj);
  }
}

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

module.exports = {
  schema: schema,
  model: model,
  collection: collection,
  controller: controller
}
