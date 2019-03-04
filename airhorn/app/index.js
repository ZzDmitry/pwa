const express = require('express');
const fs = require('fs');

const app = express();

app.use(express.static('public'));

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

app.get(
  '/api/login',
  (req, res) => {
    getUsers()
        .then(users => {
          const {login, password} = req.query;
          const user = users.find(user => user.username === login);
          if (!user) {
            res.status(404).end();
            return;
          }
          if (user.password !== password) {
            res.status(401).end();
            return;
          }
          res.status(200).end();
        });
  },
);

app.listen(8002, () => {
  console.log('Example app listening on port 8002!');
});
