#!/usr/bin/env node

"use strict";

const crypto = require('crypto');
const fs = require('fs');
const pkg = require('./package');

const token = process.argv[2];
const wordlist = process.argv[3];

if (typeof (token) === 'undefined' || token === '--help') {
   console.log(
      `jwt-cracker version ${pkg.version}
    Usage:
      jwt-cracker <token> <wordlist>
      token       the full HS256 jwt token to crack
      wordlist    wordlist dictionary file
  `
   );
   process.exit(0);
}

try {
   if (!fs.existsSync(token)) {
      console.log(`token invalid`);
      process.exit(0);
   }
} catch (err) {
   console.error(err)
}

try {
   if (!fs.existsSync(wordlist)) {
      console.log(`wordlist invalid`);
      process.exit(0);
   }
} catch (err) {
   console.error(err)
}

const rawToken = fs.readFileSync(token, { encoding: 'utf8', flag: 'r' });
const [header, payload, signature] = rawToken.split('.');
const content = `${header}.${payload}`;

if (typeof (wordlist) === 'undefined') {
   console.log(`wordlist invalid`);
   process.exit(0);
}

const generateSignature = function (content, secret) {
   return (
      crypto.createHmac('sha256', secret)
         .update(content)
         .digest('base64')
         .replace(/=/g, '')
         .replace(/\+/g, '-')
         .replace(/\//g, '_')
   );
};

const printResult = function (startTime, attempts, result) {
   if (result) {
      console.log('SECRET FOUND: \x1b[32m%s\x1b[0m', result);
   } else {
      console.log('\x1b[31m%s\x1b[0m', 'SECRET NOT FOUND');
   }
   console.log('Time taken (sec):', ((new Date).getTime() - startTime) / 1000);
   console.log('Attempts:', attempts);
};

const pwdList = fs.readFileSync(wordlist, { encoding: 'utf8', flag: 'r' });
const pwdArray = pwdList.split('\n');
let attempts = 0;
const startTime = new Date().getTime();

pwdArray.forEach(pwd => {
   if (pwd && !pwd.startsWith('#')) {
      attempts++;
      const currentSignature = generateSignature(content, pwd);
      if (attempts % 100000 === 0) {
         console.log('Attempts:', attempts);
      }
      if (currentSignature == signature) {
         printResult(startTime, attempts, pwd);
         process.exit(0);
      }
   }
});

printResult(startTime, attempts);
process.exit(1);