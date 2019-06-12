// Nodejs encryption with CTR
/*const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);*/
// Nodejs encryption with CTR

var CryptoJS = require("crypto-js");

var passphrase = 'dynamiquesautee';

module.exports = {
  
  /*formatJSON: function(data) {
      console.log('whatever')
  },
  otherFunction: function() {

  }*/
  
  /*encrypt:function (text) {
   let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
   let encrypted = cipher.update(Buffer.from("Some serious stuff","utf-8"), 'utf-8', 'hex');
   encrypted = Buffer.concat([encrypted, cipher.final()]);
   return JSON.stringify({ iv: iv.toString(), encryptedData: encrypted.toString() });
  },

  decrypt:function (text) {
   //text = JSON.parse(text)
   let iv = Buffer.from(text.iv);
   let encryptedText = Buffer.from(text.encryptedData);
   let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
   let decrypted = decipher.update(encryptedText, 'hex', 'utf-8');
   decrypted = Buffer.concat([decrypted, decipher.final()]);
   return decrypted.toString();
  }*/
  
  // Encrypt
  encrypt:function (text) {
   var ciphertext = CryptoJS.AES.encrypt(text, passphrase);
   return ciphertext;
  },

  // Decrypt
  decrypt:function (ciphertext) {
   var bytes  = CryptoJS.AES.decrypt(ciphertext.toString(), passphrase);
   var plaintext = bytes.toString(CryptoJS.enc.Utf8);
   return plaintext;
  },
 
  // Represents object var data = [{id: 1}, {id: 2}]

  // Object Encrypt
  Oencrypt:function (data) {
   var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), passphrase);
   
   return ciphertext;
  },

  // OIbject Decrypt
  Odecrypt:function (ciphertext) {
   var bytes  = CryptoJS.AES.decrypt(ciphertext.toString(), passphrase);
   var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
   
   return decryptedData;
  }

  
}