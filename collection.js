const events = require('events');
const fn = require('./lib.js');

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

module.exports = collection
