"use strict";
const ones = ["", "bir ","iki ","üç ","dört ","beş "
           ,"altı ","yedi ","sekiz ","dokuz "],
      tens = ["", "on ","yirmi ","otuz ","kırk ","elli "
           ,"altmış ","yetmiş ","seksen ","doksan "],
      word = ["","bin ","milyon ","milyar ","trilyon "],
      num = [1, 1000, 1000000, 1000000000, 1000000000000];
function threeDigits(n) {
    let s = "";
    if (n < 1 || n > 999)
        return "hata "+n;
    if (n > 199) 
        s += ones[Math.trunc(n/100)];
    if (n > 99) {
        s += "yüz "; n %= 100;
    }
    if (n > 9) {
        s += tens[Math.trunc(n/10)]; n %= 10;
    }
    return s + ones[n];
}
function toWord(n) {
    let s = "";
    if (n == 0) return "sıfır";
    if (n < 0) return "eksi "+toWord(-n);
    for (let i=4; i>=0; i--)
        if (n >= num[i]) {
            const k = Math.trunc(n/num[i]);
            if (i==1 && n<2000) s += word[1];
            else s += threeDigits(k)+word[i]; 
            n %= num[i];
        }
    return s;
}

