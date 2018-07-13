function almostEqual(a, b) {
  const eps = 1e-10;
  if (a>b) return (a-b) < a*eps;
  if (a<b) return (b-a) < a*eps;
  return true;
}
function root(x) {
  if (x < 0) return undefined;
  let r = 1;
  while (!almostEqual(r*r, x)) {
    r = (r+x/r)/2;
  }
  return r;
}
function expon(x) {
  let k = 0, t = 1, s = 1;
  while (!almostEqual(t/s, 0)) {
    k = k+1; t = x*t/k; s = s+t;
  }
  return s;
}
function power(a, n) {
  if (n == 0) return 1;
  if (n < 0) return power(1/a, -n);
  if (n%2 == 0) return power(a*a, n/2);
  return a*power(a, n-1); //odd n
}
function gcd(m, n) {
  if (m<=0 || n<=0) return undefined;
  while (!almostEqual(m, n)) { // m!=n
    if (m < n) //use the larger
         n = n - m;
    else m = m - n;
  }
  return m;
}
/* functions in Math
[ "abs", "acos", "acosh", "asin", "asinh", "atan", "atan2", 
  "atanh", "cbrt", "ceil", "clz32", "cos", "cosh", "exp", 
  "expm1", "floor", "fround", "hypot", "imul", "log", "log1p", 
  "log2", "log10", "max", "min", "pow", "random", "round", 
  "sign", "sin", "sinh", "sqrt", "tan", "tanh", "trunc" ]
*/

