//uses /JS/math/Number.js
class Row {
   constructor(d, n) { //given: Array of JS numbers
      this.data = []   //store: Array of Numbers
      for (let x of d) 
          this.data.push(Make.decimal(x))
      this.name = n
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
   printData() {
      let s = ''
      for (let r of this.row) s += r.toString()
      return s+'\n'
   }
   abs_val(i, j) {
      return Math.abs(this.getValueAt(i, j).value())
   }
   pickRow(k) { //not used
      let m = k
      for (let i=k+1; i<this.M; i++) 
          if (this.abs_val(m, k) < this.abs_val(i, k)) m = i
      return m
   }
   exchange(i, k) { //not used
      if (i == k) return;
      let r = this.row[i]; this.row[i] = this.row[k]; this.row[k] = r; 
      det = det.mult(MINUS)  //-det;
      console.log("exchange row "+i+" <=> row "+k);
   }
   multiplyR(i, num, den) { //not used
      this.multiply(i, Make.rational(num, den));
   }
   multiply(i, c) {
      let v = c.value();
      if (v == 0 || v == 1) return;
      this.row[i].multiply(c)
      this.det = this.det.mult(c.inverse());
      console.log("mult row "+i+" by "+c);
   }
   addRowR(i, num, den, k) { //not used
      addRow(i, Make.rational(num, den), k); 
   }
   addRow(i, c, k) { //c: Number  i, k: int
      if (i == k || c.value() == 0) return;
      this.row[i].addRow(c, this.row[k]); 
      console.log("add to row "+i+"  "+c+" x row "+k);
   }
   forward(k) { //finds pivot column j in row k
       //returns true if work is completed
       let j = 0;
       while (j < this.N && this.abs_val(k, j) < 1E-10) j++;
       //if (abs_val(k, k) < 1E-10) { let j = pickRow(k); exchange(j, k); }
       if (j > k) this.det = ZERO; 
       if (j == this.N) return true; //cannot continue
       let p = this.getValueAt(k, j);
       this.multiply(k, p.inverse());
       for (let i=k+1; i<this.M; i++) 
           this.addRow(i, this.getValueAt(i, j).mult(MINUS), k)
       return (k == this.M-1);
   }
   backward() {
       for (let k=this.M-1; k>0; k--) 
           for (let i=0; i<k; i++) 
               this.addRow(i, this.getValueAt(i, k).mult(MINUS), k);
   }
   solve() {
       let s =  this.printData()
       let k = 0, done = false
       while (!done) {
           done = this.forward(k)
           k++; s += this.printData()
       }
       if (!this.isSquare()) this.backward()
       return s+ this.printData() +"\ndet = "+this.det
   }
   getValueAt(i, j) { return this.row[i].data[j]; }
   setValueAt(v, i, j) { 
       this.row[i].data[j] = v;  //Number
   }
   getColumnName(j) { return this.name[j]; }
   clone() { 
      a = [];
      for (let i=0; i<this.M; i++) 
          a.push(this.row[i].clone());
      return new Matrix(a);
   }
   augmentID() { //not used
      a = [];
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
