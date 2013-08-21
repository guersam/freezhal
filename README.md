#### **_This project is no more maintained due to the termination of Frechal club service._**
프리챌 클럽은 결국 멸망했습니다. 이 프로그램은 더이상 동작하지 않아요.



Freezhal
========

Freechal (http://www.freechal.com/) club archiver


## Requirements

* MySQL
* Node.js >= 0.8 (http://www.nodejs.org)
* Python >= 2.7.1
* Need to be able to build libiconv
* Tested on Ubuntu Linux - It may or may not work on Windows.


## How to use

1. Install Node.js & MySQL
   - MySQL root with empty password is required by default. 
   - If you cannot or don't want to, edit `database.json` and `lib/db.coffee`
2. Clone this repository
3. Install coffeescript `$ sudo npm install coffee-script -g`
4. Install dependencies `$ npm install`
5. Change freechal club & login info in accounts.json
6. run by `coffee crawler`


## Known bugs

- Article IDs may conflict in a large community
  - *TODO* Assign a table to each board type instead of just one table for all articles
- Irregular article date when title contains '<' or '>'
