"use strict";
class TabularData {
  constructor(sample, name='TabularData') {
    this.name = name
    this.proto = Object.getPrototypeOf(sample)
    this.keys = Object.getOwnPropertyNames(sample)
    console.log(this.name, this)
    this.data = []
  }
  readData(url, callback) {
    let k = this.keys
    let toArray = (t) => {
      for (let s of t.split('\n')) {
        if (!s) break //end of loop 
        let b = s.split('\t'); //TAB
        let n = Math.min(k.length, b.length)
        let x = {}
        for (let i=0; i<n; i++)
            x[k[i]] = b[i]
        if (n < b.length) { //remainder
          let r = []
          for (let i=n-1; i<b.length; i++) 
              r.push(b[i])
          x[k[n-1]] = r  //last key
        }
        Object.setPrototypeOf(x, this.proto)
        this.data.push(x)
      }
      if (callback) callback(t)
    }
    fetch(url).then(x => x.text()).then(toArray)
  }
  toString() {
    return this.keys.join(', ')
  }
}
