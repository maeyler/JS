//uses /JS/math/Number.js
class Row {
   constructor(d, n) { //given: Array of JS numbers
      this.data = []   //store: Array of Numbers
      for (let x of d) {
          if (typeof x == "string") x = Make.fromString(x)
          if (typeof x == "number") x = Make.decimal(x)
          this.data.push(x)
      }
      this.name = n
   }
   static fromString(s, n) { //given: numbers separated by tab or comma
      let a = s.split(/[ \t,]+/)
      return new Row(a, n)
   }
   multiply(c) { //by Number
      for (let j=0; j<this.data.length; j++)  {
          this.data[j] = this.data[j].mult(c);
      }
   }
   addRow(c, r) { //add c times r
      for (let j=0; j<this.data.length; j++)  {
          this.data[j] = this.data[j].add(r.data[j].mult(c));
      }
   }
   clone() {
      let d = []
      for (let x of this.data) d.push(x)
      return new Row(d);
   }
   augmentZero() { 
      let c = this.clone();
      for (let x of this.data) c.data.push(ZERO)
      return c
   }
   toHTML() {
      let s = '<td>'+this.data.join('</td><td>')+'</td>'
      if (this.name) s = '<th>'+this.name+'</th>'+s
      return '<tr>'+s+'</tr>'
   }
   toString() { 
      return this.data.join("\t")
   }
}  

//Row operations
class Swap {
   constructor(ri, rk) {
      this.ri = ri; this.rk = rk
   }
   exec() {
      let d = this.ri.data
      this.ri.data = this.rk.data
      this.rk.data = d 
   }
   undo() {
      this.exec() //swap again
   }
   toString() { 
      return "swap "+this.ri.name+" <=> "+this.rk.name
   }
}
class Mult {
   constructor(ri, c) {
      this.ri = ri; this.c = c
   }
   exec() {
      this.ri.multiply(this.c)
   }
   undo() {
      this.ri.multiply(this.c.inverse())
   }
   toString() { 
      return "mult "+this.ri.name+" by "+this.c
   }
}
class Add {
   constructor(ri, c, rk) {
      this.ri = ri; this.c = c; this.rk = rk 
   }
   exec() {
      this.ri.addRow(this.c, this.rk)
   }
   undo() {
      this.ri.addRow(this.c.mult(MINUS), this.rk)
   }
   toString() { 
      return "add to "+this.ri.name+"  "+this.c+" x "+this.rk.name
   }
}

//Main class
const
   ZERO = new Whole(0),
   ONE  = new Whole(1),
   MINUS = new Whole(-1),
   NAME = [ "x", "y", "z", "p", "q", "s", "t" ];
// M Rows x N Numbers
class Matrix  {
   constructor(ra) { //given: Array of Rows
      this.M = ra.length; this.row = ra; 
      this.N = ra[0].data.length; this.det = ONE
      this.description = this.M+"x"+this.N+" matrix"
      let large = (this.N > NAME.length)
      this.name = [];
      for (let j=1; j<=this.N; j++) {
          this.name.push(large ? "x"+j : NAME[j-1])
      }
   }
   static fromString(s) { //given: rows separated by \n
      let a = s.split('\n')
      let i = 1, ra = []   //store: Array of Rows
      for (let x of a) ra.push(Row.fromString(x,'R'+(i++)))
      return new Matrix(ra)
   }
   static fromArray2D(a) { //given: 2D Array of JS numbers
      let i = 1, ra = []   //store: Array of Rows
      for (let x of a) ra.push(new Row(x,'R'+(i++)))
      return new Matrix(ra)
   }
   getRowCount() { return this.M; }
   getColumnCount() { return this.N; }
   isSquare() {
      return this.M == this.N
   }
   printData() { //not used
      let s = ''
      for (let r of this.row) s += r.toString()
      return s+'\n'
   }
   abs_val(i, j) {
      return Math.abs(this.getValueAt(i, j).value())
   }
   swap(i, k) {
      if (i == k) return null
      let op = new Swap(this.row[i], this.row[k])
      this.det = this.det.mult(MINUS)
      op.exec(); return op
      //console.log("swap "+ri.name+" <=> "+rk.name)
   }
   multiply(i, c) {
      let v = c.value()
      if (v == 0 || v == 1) return null
      let op = new Mult(this.row[i], c)
      this.det = this.det.mult(c.inverse());
      op.exec(); return op
      //console.log("mult "+ri.name+" by "+c);
   }
   addRow(i, c, k) { //c: Number  i, k: int
      if (i == k || c.value() == 0) return null
      let op = new Add(this.row[i], c, this.row[k])
      op.exec(); return op
      //console.log("add to "+ri.name+"  "+c+" x "+rk.name);
   }
   solve() {
     let m = this //not visible within functions
     function pickRow(k) { //not used
       let m = k
       for (let i=k+1; i<this.M; i++) 
          if (this.abs_val(m, k) < this.abs_val(i, k)) m = i
       return m
     }
     function forward(k) { //finds pivot column j in row k
       //returns true if work is completed
       let j = 0;
       while (j < m.N && m.abs_val(k, j) < 1E-10) j++;
       //if (m.abs_val(k, k) < 1E-10) { let j = pickRow(k); swap(j, k); }
       if (j > k) m.det = ZERO; 
       if (j == m.N) return true; //cannot continue
       let p = m.getValueAt(k, j)
       list.add(m.multiply(k, p.inverse()))
       for (let i=k+1; i<m.M; i++) {
             let mij = m.getValueAt(i, j).mult(MINUS)
             list.add(m.addRow(i, mij, k))
           }
       return (k == m.M-1);
     }
     function backward() {
       for (let k=m.M-1; k>0; k--) 
           for (let i=0; i<k; i++) {
             let mik = m.getValueAt(i, k).mult(MINUS)
             list.add(m.addRow(i, mik, k))
           }
     }
     let k = 0, done = false, list = []
     list.add = (x) => { if (x) list.push(x)}
     while (!done) {
         done = forward(k); k++
     }
     if (!this.isSquare()) backward()
     return list
   }
   getValueAt(i, j) { return this.row[i].data[j]; }
   setValueAt(v, i, j) { 
       this.row[i].data[j] = v;  //Number
   }
   getColumnName(j) { return this.name[j]; }
   clone() { 
      let a = [];
      for (let i=0; i<this.M; i++) 
          a.push(this.row[i].clone());
      return new Matrix(a);
   }
   augmentIdentity() {
      let a = [];
      for (let i=0; i<this.M; i++) { //for each row
          a.push(this.row[i].augmentZero());
          a[i].data[this.M+i] = ONE;
      }
      return new Matrix(a);
   }
   toHTML() {
      let h = []
      for (let x of this.row) h.push(x.toHTML())
      let s = this.name.join('</th><th>')
      s = '<tr><th></th><th>'+s+'</th></tr>'
      return s+'\n'+h.join('\n')
   }
   toString() {
       return this.description;
   }
}

