"use strict";
var title, output;  //global elements
const ones = ["", "bir ","iki ","üç ","dört ","beş "
           ,"altı ","yedi ","sekiz ","dokuz "],
      tens = ["", "on ","yirmi ","otuz ","kırk ","elli "
           ,"altmış ","yetmiş ","seksen ","doksan "],
      word = ["yüz ","bin ","milyon ","milyar ","trilyon "],
    trillion = 1000000000000, billion = 1000000000,
    million = 1000000, thousand = 1000;

function trunc(n) {
    var s = ""+n;
    var k = s.indexOf('.');
    if (k<0) return n;
    return s.substr(0,k);
}
function threeDigits(n) {
    var s = "";
    if (n < 1 || n > 999)
        return "illegal value "+n;
    if (n > 199) 
        s += ones[trunc(n/100)];
    if (n > 99) {
        s += word[0]; //"yüz "; 
        n %= 100;
    }
    if (n > 9) {
        s += tens[trunc(n/10)]; 
        n %= 10;
    }
    return s + ones[n];
}
function toWord(n) {
    var s = "";
    if (n == 0) 
        return "sifir";
    if (n < 0) 
        return "eksi "+toWord(-n);
    if (n >= trillion) {
        s += threeDigits(trunc(n/trillion))+word[4]; 
        n %= trillion;
    }
    if (n >= billion) {
        s += threeDigits(trunc(n/billion))+word[3]; 
        n %= billion;
    }
    if (n >= million) {
        s += threeDigits(trunc(n/million))+word[2]; 
        n %= million;
    }
    if (n >= thousand) {
        if (n<2000) s += word[1];
        else s += threeDigits(trunc(n/thousand))+word[1]; 
        n %= thousand;
    }
    if (n >= 1) 
        s += threeDigits(n);
    return s;
}

