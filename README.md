# jwt-bf : Json Web Token (JWT) brute force

jwt brute force cracker via node js. supports dictionary attacks against HS256.

```bash
Usage:
    jwt-bf <token> <wordlist>
    token       the full HS256 jwt token to crack
    wordlist    wordlist dictionary file
```

## Install

```bash
npm install --global jwt-bf
```

## Usage
```bash
jwt-bf <token> <wordlist>
```

## Example
```bash
jwt-bf /path/to/token.txt /path/to/wordlist.txt
```

## Example Result
```bash
SECRET FOUND: 1234
Time taken (sec): 0.006
Attempts: 4
```