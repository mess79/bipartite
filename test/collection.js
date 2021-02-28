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
let schema = new mvc.schema(testSchema)
let collectionData = {
  schema : schema,
  url: null
}
let collectionObj = new mvc.collection(model1, collectionData)

describe("collection.js/add", function() {
  it("Collection add model", function() {

    //assert.equal(true, false, "have not yet written the function")
  })
})
