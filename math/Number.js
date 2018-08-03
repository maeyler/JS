class Rational {
    constructor(n, d) {
        if (d == 0) throw "division by zero";
        this.num = n;  this.den = d; 
    }
    add(n) {
        if (n instanceof Rational) 
          return Make.rational(this.num*n.den + n.num*this.den, this.den*n.den);
        else return n.add(this);
    }
    mult(n) {
        if (n instanceof Rational) 
          return Make.rational(this.num * n.num, this.den * n.den);
        else return n.mult(this);
    }
    inverse() { return Make.rational(this.den, this.num); }
    value() { return this.num/this.den; }
    toString() { return this.num+"/"+this.den; }
    static gcd(a, b) {
        if (a < 0) a = -a;
        if (b < 0) b = -b;
        while (a!=0 && b!=0) 
            if (a < b) b = b % a;
            else a = a % b;
        if (a == 0) a = b;
        if (a == 0) return 1;
        return a;
    }
 }

class Whole extends Rational {   
    constructor(n) { super(n, 1); }
    add(n) {
        if (n instanceof Whole) 
          return new Whole(this.num + n.num);
        else return n.add(this);
    }
    mult(n) {
        if (n instanceof Whole)
          return new Whole(this.num * n.num);
        else return n.mult(this);
    }  
    toString() { return this.num.toString(); }
}

class Decimal {
    constructor(x) { this.re = x; }
    add(n) { return Make.decimal(this.re + n.value()); }
    mult(n) { return Make.decimal(this.re * n.value()); }
    inverse() { return Make.decimal(1/this.re); }
    value() { return this.re; }  
    toString() { return this.re.toString(); }
}

class Complex {
    constructor(r, i) { 
        this.re = r; this.im = i; 
        this.r2 = r*r + i*i;
    }
    add(n) {
        const c = Complex.fromNumber(n);
        return Make.complex(this.re + c.re, this.im + c.im);
    }
    mult(n) {
        const c = Complex.fromNumber(n);
        const r = this.re*c.re - this.im*c.im;
        const i = this.re*c.im + this.im*c.re;
        return Make.complex(r, i);
    }
    inverse() {
        if (this.r2 == 0) throw "division by zero";
        return Make.complex(this.re/this.r2, -this.im/this.r2);
    }
    value() {
        return Math.sqrt(this.r2);
    }
    angle() { //in degrees
        const eps = 1E-10;  let a;
        if (Math.abs(this.re) < eps) {
            a = (this.im < -eps? -90 : 90);
        } else {
            a = Math.atan(this.im/this.re)*180/Math.PI;
            if (this.re < -eps) a = a +180;
        }
        return a;
    }
    toPolar() {
        return "r:"+value()+"  a:"+angle();
    }
    signedIm(x) {
        if (x > 0) return "+"+x+"i";
        if (x < 0) return "-"+(-x)+"i";
        return "0";
    }
    toString() {
        const s = (this.re == 0? "" : ""+this.re);
        if (this.im == 1) return s+"+i";
        if (this.im ==-1) return s+"-i";
        return s+this.signedIm(this.im);
    }
    static fromPolar(r, a) {
        const d = a/180*Math.PI;
        return Make.complex(r * Math.cos(d), r * Math.sin(d));
    }
    static fromNumber(n) {
        if (n instanceof Complex) return n;
        return new Complex(n.value(), 0);    
    }
}

class Make { //Factory methods for numbers
    static whole(n) {
        return new Whole(n);
    }
    static rational(n, d) {
        if (d < 0) { n = -n; d = -d; }
        const g = Rational.gcd(n, d);
        if (g == d) return new Whole(n/g);
        return new Rational(n/g, d/g);
    }
    static decimal(x) {
        if (x == Math.round(x)) 
             return new Whole(x);
        return new Decimal(x);
    }
    static complex(re, im) {
        if (im == 0) 
             return Make.decimal(re);
        return new Complex(re, im);
    }
}

class Number2 { //testing another approach
  constructor(t, a, b) { 
    if (t[0] == "w") return new Whole(a); 
    if (t[0] == "r") { 
        let n=a, d=b; 
        if (d < 0) { n = -n; d = -d; } 
        const g = Rational.gcd(n, d); 
        if (g == d) return new Whole(n/g); 
        return new Rational(n/g, d/g); 
    }; 
    if (t[0] == "d") { 
        if (x == Math.round(a))  
             return new Whole(a); 
        return new Decimal(a); 
    }; 
    if (t[0] == "c") { 
        if (b == 0)  
             return Make.decimal(a); 
        return new Complex(a, b); 
    }; 
  } 
}
