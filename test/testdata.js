module.exports = {
  testData: {
    name: "ted",
    place: "starting place",
    wrongplace: "should not be here",
    list: ["item 1", "item 2"],
    truthy: false,
    untruthy: "true",
    recursive: {
      recursivething: "1st level recursive",
      recursivestr: 6,
      recursive: {
        recursivething: "2nd level recursive a",
        recursivestr: "2nd level recursive b"
      }
    }
  },
  testData2: {
    name: "ted",
    place: "starting place",
    wrongplace: "should not be here",
    list: ["item 1", "item 2"],
    truthy: false,
    untruthy: "true",
    recursive: {
      recursivething: "1st level recursive extra",
      recursivestr: 6,
      recursive: {
        recursivething: "2nd level recursive a",
        recursivestr: "2nd level recursive b"
      }
    }
  },
  compareTestData: {
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
  },
  expectedCompareResult: {
    updated: {
      name: 'billy bob jimbo',
      place: 'over and away',
      list: ['jjhjssssh', 'trtrtr'],
      truthy: true,
      untruthy: 'kss',
      recursive: {
        recursivething: 'hghghghg',
        recursivestr: 8,
        recursive: [Object]
      }
    },
    removed: {
      name: 'ted',
      place: 'starting place',
      list: ['item 1', 'item 2'],
      untruthy: 'true',
      recursive: {
        recursivething: '1st level recursive',
        recursivestr: 6,
        recursive: [Object]
      }
    },
    added: {
      list: ['jjhjssssh', 'trtrtr'],
      truthy: true,
      recursive: {
        recursive: {}
      }
    }
  },
  updateTestData: {
    fruit: "orange",
    name: "bob",
    recursive: {
      recursivething: "fflah",
      recursivestr: 2,
      recursive: {
        recursivestr: "dsfffd"
      }
    }
  },
  removeTestData: {
    name: false,
    recursive: {
      recursivething: false,
      recursive: {
        recursivestr: false
      }
    }
  },
  expectedRemoveResult: {
    place: 'starting place',
    wrongplace: 'should not be here',
    list: ['item 1', 'item 2'],
    truthy: false,
    untruthy: 'true',
    recursive: {
      recursivestr: 6,
      recursive: {
        recursivething: '2nd level recursive a'
      }
    }
  },
  testSchema: {
    fruit: String,
    name: String,
    place: {
      type: String,
      default: "this place"
    },
    defaultPlace: {
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
  },
  query1: {
    name: "bob",
    recursive: {
      recursivething: "fflah",
      recursivestr: 3
    }
  },
  query2: {
    name: "ted",
    recursive: {
      recursivething: '1st level recursive'
    }
  }
}
