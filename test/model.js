const mvc = require("../bipartite.js");
const chai = require('chai');
const assert = chai.assert;
var sinon = require("sinon");
const events = require('events');
const data = require("./testdata")

const util = require('util')

testData = data.testData
testData2 = data.testData2
compareTestData = data.compareTestData
expectedCompareResult = data.expectedCompareResult
removeTestData = data.removeTestData
updateTestData = data.updateTestData
expectedRemoveResult = data.expectedRemoveResult
testSchema = data.testSchema
query1 = data.query1
query2 = data.query2

let model = new mvc.model(testData2)

describe("model.js/constructor", function() {
  it("Test constructor", function() {
    assert.equal(model.obj.name, "ted", "Test 1")
  })
})

describe("model.js/update", function() {
  it("Model update tests", function() {
    let spy = sinon.spy(
      // function(data){console.log(util.inspect(data, {showHidden: false, depth: null}))}
    )
    model.event.addListener('update', spy);
    sinon.assert.notCalled(spy)
    model.update(updateTestData)
    sinon.assert.called(spy)
    model.event.removeListener('update', function() {})
  })
})

describe("model.js/remove", function() {
  it("Model remove tests", function() {
    let spy = sinon.spy(
      //function(data){console.log(util.inspect(data, {showHidden: false, depth: null}))}
    )
    model.event.addListener('remove', spy);
    sinon.assert.notCalled(spy)
    model.remove(removeTestData)
    sinon.assert.called(spy)
    model.event.removeListener('remove', function() {})
  })
})

describe("model.js/destroy", function() {
  it("Model destroy self", function() {
    //assert.equal(true, false, "have not yet written the function")
  })
})

describe("model.js/detach", function() {
  it("Detach from collections", function() {
    //assert.equal(true, false, "have not yet written the function")
  })
})

describe("model.js/save", function() {
  it("Save to server", function() {
    //assert.equal(true, false, "have not yet written the function")
  })
})

describe("model.js/load", function() {
  it("Load from server", function() {
    //assert.equal(true, false, "have not yet written the function")
  })
})
