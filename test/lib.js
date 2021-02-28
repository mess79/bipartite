const mvc = require("../bipartite.js");
const fn = require("../lib.js");
const chai = require('chai');
const assert = chai.assert;
const data = require("./testdata")

testData=data.testData
testData2=data.testData2
compareTestData=data.compareTestData
expectedCompareResult=data.expectedCompareResult
removeTestData=data.removeTestData
expectedRemoveResult=data.expectedRemoveResult
testSchema=data.testSchema
query1=data.query1
query2=data.query2

describe("lib.js/clone", function() {
  it("Test clone with sample model", function() {
    let testModel = new mvc.model(testData)
    let testClone = fn.clone(testModel)
    assert.equal(testClone.obj.name, testModel.obj.name, "Test 1")
    assert.equal(testClone.obj.recursive.recursive.recursivething, testModel.obj.recursive.recursive.recursivething, "Test 2")
  })
})

describe("lib.js/id", function() {
  it("Test sequential ID creation", function() {
    let testID = fn.id()
    assert.equal(fn.id(), testID + 1, "Test 1")
    assert.equal(fn.id(), testID + 2, "Test 2")
    assert.notEqual(fn.id(), testID + 2, "Test 2")
  })
})

describe("lib.js/objectTypeValidate", function() {
  it("Test objectTypeValidate", function() {
    let testObj = {
      test: 1
    }
    let testArray = ["test", 1]
    assert.equal(fn.objectTypeValidate(testObj, "object"), testObj, "Test 1")
    assert.equal(fn.objectTypeValidate(testArray, "array"), testArray, "Test 2")
    assert.isObject(fn.objectTypeValidate(undefined, "object"), "Test 3")
    assert.isArray(fn.objectTypeValidate(undefined, "array"), "Test 4")
    assert.isNotArray(fn.objectTypeValidate(testArray, "object"), "Test 5")
    assert.isNotObject(fn.objectTypeValidate(testObj, "array"), "Test 6")
  })
})

describe("lib.js/remove", function() {
  it("Test remove", function() {
    assert.isUndefined(fn.remove(testData2, removeTestData).name, "Test 1")
    assert.isUndefined(fn.remove(testData2, removeTestData).recursive.recursivething, "Test 2")
    assert.isUndefined(fn.remove(testData2, removeTestData).recursive.recursive.recursivestr, "Test 3")
    assert.equal(fn.remove(testData2, removeTestData).list[0], expectedRemoveResult.list[0], "Test 4")
    assert.equal(fn.remove(testData2, removeTestData).truthy, expectedRemoveResult.truthy, "Test 5")
  })
})

describe("lib.js/compare", function() {
  it("Test compare", function() {
    assert.equal(fn.compare(testData, compareTestData).updated.name, expectedCompareResult.updated.name, "Test 1")
    assert.equal(fn.compare(testData, compareTestData).updated.recursive.recursivething, expectedCompareResult.updated.recursive.recursivething, "Test 2")
    assert.equal(fn.compare(testData, compareTestData).removed.name, expectedCompareResult.removed.name, "Test 3")
    assert.equal(fn.compare(testData, compareTestData).removed.list[1], expectedCompareResult.removed.list[1], "Test 4")
    assert.equal(fn.compare(testData, compareTestData).added.truthy, expectedCompareResult.added.truthy, "Test 5")
    assert.isUndefined(fn.compare(testData, compareTestData).updated.wrongplace, expectedCompareResult.updated.wrongplace, "Test 6")
    assert.isUndefined(fn.compare(testData, compareTestData).removed.wrongplace, expectedCompareResult.removed.wrongplace, "Test 7")
  })
})

describe("lib.js/prune", function() {
  it("Test prune", function() {
    assert.equal(fn.prune(testData, testSchema).name, "ted", "Test 1")
    assert.equal(fn.prune(testData, testSchema).defaultPlace, "default place", "Test 2")
    assert.isUndefined(fn.prune(testData, testSchema).wrongplace, "Test 3")
  })
})

describe("lib.js/query", function() {
  it("Test query", function() {
    assert.isNotTrue(fn.query(testData, query1), "Test 1")
    assert.isTrue(fn.query(testData, query2), "Test 1")
  })
})
