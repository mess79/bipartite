let idVar = -1

module.exports = {
  clone: function(obj) {
    obj = JSON.parse(JSON.stringify(obj));
    return obj
  },
  id: function() {
    idVar++
    return idVar
  },
  objectTypeValidate: function(obj, type) {
    switch (type) {
      case "array":
        if (Array.isArray(obj)) {} else {
          if (!obj) {
            obj = [];
          } else {
            obj = [obj];
          }
        }
        break;
      case "object":
        if (typeof obj === 'object' && obj !== null && !Array.isArray(obj)) {} else {
          obj = {}
        }
        break;
    }
    return obj
  },
  update: function(obj1, obj2) {
    obj1 = this.clone(obj1)
    obj2 = this.clone(obj2)
    //console.log("update 1: "+obj2.truthy)
    const compareRecursive = function(obj1, obj2) {
      for (let key in obj2) {
        if (typeof obj2[key] === 'object' && Object.keys(obj2[key]).length > 0) {
          if(!obj1[key]){
            obj1[key]={}
          }
          compareRecursive(obj1[key], obj2[key])
        } else if (typeof obj2[key] === 'string' || typeof obj2[key] === 'boolean') {
          obj1[key] = obj2[key]
        }
      }
    }
    compareRecursive(obj1, obj2)
    //console.log("update 2: "+obj2.truthy)
    return obj1
  },
  remove: function(obj1, obj2) {
    obj1 = this.clone(obj1)
    obj2 = this.clone(obj2)
    const compareRecursive = function(obj1, obj2) {
      for (let key in obj2) {
        if (obj2[key] === false) {
          delete obj1[key]
        } else if (typeof obj2[key] === 'object' && Object.keys(obj2[key]).length > 0) {
          compareRecursive(obj1[key], obj2[key])
        }
      }
    }
    compareRecursive(obj1, obj2)
    return obj1
  },
  compare: function(obj1, obj2) {
    //console.log(obj1, obj2)
    obj1 = this.clone(obj1)
    obj2 = this.clone(obj2)
    let obj = {
      updated: {},
      removed: {},
      added: {}
    };
    const compareRecursive = function(obj1, obj2, updated, removed, added) {
      for (let key in obj2) {
        if (Array.isArray(obj1[key])) {
          let diff = obj2[key].filter(x => !obj1[key].includes(x));
          let invDiff = obj1[key].filter(x => !obj2[key].includes(x));
          if (diff.length > 0 || invDiff > 0) {
            added[key] = diff
            removed[key] = invDiff
            updated[key] = obj2[key]
          }
        } else {
          if (obj2[key] === obj1[key]) {} else if (typeof obj1[key] === 'object' && obj1[key] !== null && Object.keys(obj1[key]).length > 0) {
            //console.log(obj2)
            if (!updated[key]) {
              updated[key] = {}
            }
            if (!removed[key]) {
              removed[key] = {}
            }
            if (!added[key]) {
              added[key] = {}
            }
            compareRecursive(obj1[key], obj2[key], updated[key], removed[key], added[key])
          } else if (obj1[key]) {
            //console.log(obj2[key])
            updated[key] = obj2[key]
            removed[key] = obj1[key]
            //delete obj1[key]
          } else {
            updated[key] = obj2[key]
            added[key] = obj2[key]
          }
        }
      }
    }
    const removeRecursive = function (obj1, obj2, removed){
      for (let key in obj1) {
        if(!obj2[key]){
          removed[key] = obj1[key]
        } else if (typeof obj1[key] === 'object' && obj1[key] !== null && Object.keys(obj1[key]).length > 0) {
          removeRecursive(obj1[key], obj2[key], removed[key])
        }
      }
    }
    compareRecursive(obj1, obj2, obj.updated, obj.removed, obj.added)
    removeRecursive(obj1, obj2, obj.removed)
    //console.log(obj)
    return obj;
  },
  prune: function(obj, schema) {
    let output = {}
    const compareRecursive = function(obj, schema, output) {
      for (let key in schema) {
        let option = schema[key];
        let defaultData = "";
        if (schema[key].type || schema[key].default) {
          option = schema[key].type
          if (schema[key].default) {
            defaultData = schema[key].default
          }
        }
        if (obj && typeof option === 'object' && obj[key] !== null && Object.keys(obj).length > 0) {
          output[key] = {}
          compareRecursive(obj[key], schema[key], output[key])
        }
        if (defaultData && !obj[key]) {
          output[key] = defaultData;
        } else if (obj) {
          //console.log(option)
          switch (option) {
            case String:
              //console.log(obj[key]);
              if (typeof obj[key] === "string") {
                output[key] = obj[key]
              }
              break;
            case Number:
              if (typeof obj[key] === "number") {
                output[key] = obj[key]
              }
              break;
            case Boolean:
              if (typeof obj[key] === "boolean") {
                output[key] = obj[key]
              } else if (obj[key] === "true" || obj[key] === "false"){
                output[key] = (obj[key] === "true")
              }
              break;
            case Array:
              if (Array.isArray(obj[key])) {
                output[key] = obj[key]
              }
              break;
          }
        }
      }
    }
    compareRecursive(obj, schema, output)
    return output
  },
  query: function(obj, query) {
    let result = true
    const compareRecursive = function(o, q) {
      for (let key in q) {
        if (typeof q[key] === 'object' && Object.keys(q[key]).length > 0) {
          compareRecursive(o[key], q[key])
        } else if (o[key] !== q[key]) {
          result = false
        }
      }
    }
    compareRecursive(obj, query)
    return result
  }
}
