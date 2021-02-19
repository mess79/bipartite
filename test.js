const mvc = require("./bipartite_server.js")

const schemaObj = {
  fruit: String,
  name: String,
  place: {
    type: String,
    default: "this place"
  },
  defaulPlace: {
    type: String,
    default: "default place"
  },
  list: Array,
  truthy: Boolean,
  untruthy: Boolean,
  recursive: {
    recursivething: String,
    recursivestr: String,
    recursive: {
      recursivething: String,
      recursivestr: String
    }
  }
}

const data = {
  url: "www.google.com",
  schema: new mvc.schema(schemaObj)
}

const obj2 = {
  name: "ted",
  place: "over here",
  wrongplace: "should not be here",
  list: ["jjhjh", "trtrtr"],
  truthy: false,
  untruthy: "true",
  recursive: {
    recursivething: "blah",
    recursivestr: 6,
    recursive: {
      recursivething: "blah",
      recursivestr: "dsfd"
    }
  }
}

const obj3 = {
  name: "billy bob jimbo",
  place: "over and away",
  wrongplace: "should not be here",
  list: ["jjhjssssh", "trtrtr"],
  truthy: true,
  untruthy: "kss",
  recursive: {
    recursivething: "hghghghg",
    recursivestr: 8,
    recursive: {
      recursivething: "sdd",
      recursivestr: "aaaa"
    }
  }
}

let modelObj2 = new mvc.model(obj2)
let modelObj3 = new mvc.model(obj3)
let modelController = new mvc.controller(modelObj2)


modelController.update = function(model) {
  switch (this.type) {
    case "model":
      console.log("model update (set in controller)")
      break;
    case "collection":
      console.log("collection update (set in controller)")
      break;
  }
}

modelController.add = function(model) {
  switch (this.type) {
    case "model":
      console.log("model added (set in controller)")
      break;
    case "collection":
      console.log("collection added (set in controller)")
      break;
  }
}

modelController.remove = function(model) {
  switch (this.type) {
    case "model":
      console.log("model removed (set in controller)")
      break;
    case "collection":
      console.log("collection removed (set in controller)")
      break;
  }
}

let collectionObj = new mvc.collection(null, data)
let controller2 = new mvc.controller(collectionObj)

controller2.add = function(model) {
  switch (this.type) {
    case "model":
      console.log("model add (set in controller)")
      break;
    case "collection":
      console.log("collection add (set in controller)")
      //console.log(model)
      break;
  }
}
controller2.update = function(model) {
  switch (this.type) {
    case "model":
      console.log("model update (set in controller)")
      //console.log(model.obj)
      break;
    case "collection":
      console.log("collection update (set in controller)")
      //console.log(model.obj)
      //console.log(model.obj);
      //console.log(this.obj)
      break;
  }
}
controller2.remove = function(model) {
  switch (this.type) {
    case "model":
      console.log("model remove (set in controller)")
      break;
    case "collection":
      console.log("collection remove (set in controller)")
      break;
  }
}

controller2.detach = function(model) {
  switch (this.type) {
    case "model":
      console.log("model detach (set in controller)")
      break;
    case "collection":
      console.log("Model: "+model.id+" removed from collection: " + this.obj.id)
      break;
  }
}

collectionObj.add(modelObj2)
collectionObj.add(modelObj3)

let updateObj = {
  fruit: "orange",
  name: "bob",
  recursive: {
    recursivething: "fflah",
    recursivestr: 2,
    recursive: {
      recursivestr: "dsfffd"
    }
  }
}

let removeObj = {
  fruit: false,
  recursive: {
    recursivething: false,
    recursive: {
      recursivestr: false
    }
  }
}

let query = {
  name: "bob",
  recursive: {
    recursivething: "fflah",
    recursivestr: 3
  }
}

let detachQuery = {
  fruit: "orange"
}

collectionObj.update(updateObj)
collectionObj.update(updateObj, query)
collectionObj.remove(removeObj)
collectionObj.detach()
collectionObj.findAndDetach(detachQuery)
collectionObj.update(updateObj)
collectionObj.destroyCollection()
collectionObj.load()
collectionObj.save()


modelObj2.update({
  list: ["jjhjh", "jjddddhjh", "trtjrtr", "gfgfgfffgf"],
  fruit: "apple",
  name: "jim",
  more: {
    thing: "no",
    otherthing: "kaaakj",
    newthing: "jsjsj",
    list: ["more jjhjh", "more trtrtr"]
  }
})

modelObj2.update({
  fruit: "orange",
  name: "bob",
  recursive: {
    recursivething: "fflah",
    recursivestr: 2,
    recursive: {
      recursivestr: "dsfffd"
    }
  }
})



modelObj2.remove()
modelObj2.destroy()
modelObj2.load()
modelObj2.save()

//console.log(collectionObj.models())
