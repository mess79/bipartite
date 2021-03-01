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

//create some test modelas
let model1 = new mvc.model(testData)
let model2 = new mvc.model(testData2)
let model3 = new mvc.model(testData)
let schema = new mvc.schema(testSchema)
let collectionData = {
  schema: schema,
  url: null
}
let coll = new mvc.collection(model1, collectionData)

describe("collection.js/add", function() {
  it("Collection add model", function() {
    let spy = sinon.spy(
      //function(data){console.log(util.inspect(data, {showHidden: false, depth: null}))}
    )
    coll.event.addListener('add', spy);
    //sinon.assert.notCalled(spy)
    coll.add(model2)
    sinon.assert.called(spy)
    coll.event.removeListener('add', spy)
  })
})

describe("collection.js/update", function() {
  it("Collection updates model(s)", function() {
    let spy = sinon.spy(
      //function(data){console.log(util.inspect(data, {showHidden: false, depth: null}))}
    )
    coll.event.addListener('update', spy);
    //sinon.assert.notCalled(spy)
    coll.update(updateTestData, query2)
    coll.update(updateTestData)
    sinon.assert.calledThrice(spy)
    coll.event.removeListener('update', spy)
    // reset the collection:
    model1 = new mvc.model(testData)
    model2 = new mvc.model(testData2)
    coll = new mvc.collection([model1, model2], collectionData)
  })
})



describe("collection.js/remove", function() {
  it("Collection removes model(s)", function() {
    let spy = sinon.spy(
      //function(data){console.log(util.inspect(data, {showHidden: false, depth: null}))}
    )
    coll.event.addListener('remove', spy);
    //sinon.assert.notCalled(spy)
    coll.remove(removeTestData, query2)
    coll.remove(removeTestData)
    sinon.assert.calledThrice(spy)
    coll.event.removeListener('remove', spy)
  })
})

describe("collection.js/detach", function() {
  it("Collection detaches model", function() {
    let spy = sinon.spy(
      //function(data){console.log(util.inspect(data, {showHidden: false, depth: null}))}
    )
    // send fake event from model within the collectionData
    // call 1
    coll.event.addListener('update', spy);
    model1.event.emit('update');
    coll.event.addListener('detach', spy);
    // detach teh model
    // call 2
    coll.detach(model1)
    // resend the event from the detached model to see if it is detected
    // call 3 (should fail)
    model1.event.emit('update');
    // test passes if only 2 calls picked up
    sinon.assert.calledTwice(spy)
    coll.event.addListener('remove', spy);
    coll.event.removeListener('detach', spy)
    // reset the collection:
    model1 = new mvc.model(testData)
    model2 = new mvc.model(testData2)
    coll = new mvc.collection([model1, model2], collectionData)
  })
})

describe("collection.js/findAndDetach", function() {
  it("Collection finds using a query and detaches model(s)", function() {
    let spy = sinon.spy(
      //function(data){console.log(util.inspect(data, {showHidden: false, depth: null}))}
    )
    coll.add(model3)
    // send fake event from model within the collectionData
    // call 1
    coll.event.addListener('update', spy);
    model1.event.emit('update');
    coll.event.addListener('detach', spy);
    // detach the model (should find two matching)
    // call 2 and 3
    coll.findAndDetach(query2)
    // resend the event from the detached model to see if it is detected
    // call 4 (should fail)
    model1.event.emit('update');
    // test passes if only 3 calls picked up
    sinon.assert.calledThrice(spy)
    coll.event.addListener('remove', spy);
    coll.event.removeListener('detach', spy)
    // reset the collection:
    model1 = new mvc.model(testData)
    model2 = new mvc.model(testData2)
    model3 = new mvc.model(testData)
    coll = new mvc.collection([model1, model2], collectionData)
  })
})
