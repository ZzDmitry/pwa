const express = require('express');
const fs = require('fs');

const app = express();

function getUsers() {
  return new Promise((resolve, reject) => {
    fs.readFile('./users.json', 'utf8', (err, text) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(JSON.parse(text));
    });
  });
}

function loginUser(login, password) {
  console.log('loginuser', login, password);
  return getUsers()
    .then((users) => {
      const user = users.find(user => user.username === login);
      if (!user) {
        return 404;
      }
      if (user.password !== password) {
        return 401;
      }
      return user;
    });
}

app.get(
  '/login',
  (req, res) => {
    const { login, password } = req.query;
    loginUser(login, password)
      .then((userOrStatus) => {
        if (typeof userOrStatus !== 'object') {
          res.status(userOrStatus).end();
          return;
        }
        res.status(200).end(`${login}\n${password}\n${+new Date()}`);
      });
  },
);

app.get(
  '/userinfo',
  (req, res) => {
    const { token } = req.query;
    const [login, password, date] = token.split('\n');
    const secToExpiration = Math.floor(60000 - (new Date() - date) / 1000);
    if (secToExpiration < 0) {
      res.status(401).end();
      return;
    }
    loginUser(login, password)
      .then((userOrStatus) => {
        if (typeof userOrStatus !== 'object') {
          res.status(userOrStatus).end();
          return;
        }
        res.status(200).json({ ...userOrStatus, secToExpiration });
      });
  },
);

app.listen(8003, () => {
  console.log('Example app listening on port 8003!');
});
