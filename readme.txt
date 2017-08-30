npm install express-generator -g
express --ejs --view ejs --git

npm install --save sequelize sequelize-cli sqlite3
node_modules\.bin\sequelize init


npm install -g sequelize-auto
npm install -g mysql


sequelize-auto -o "./models" -d d02720cc -h w00feb69.kasserver.com -u d02720cc -x W92rq5oNdyVWNxbt -e mysql

models/index.js:
var config    = require(__dirname + '/../config/config.json')[env];

models/movie_info.js:
id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    }


config/config.json:
    "username": "d02720cc",
    "password": "W92rq5oNdyVWNxbt",
    "database": "d02720cc",
    "host": "w00feb69.kasserver.com",
    "dialect": "mysql",
    "define": {
        "timestamps": false
    }


npm install socket.io --save
npm install --save express-session

npm install express-socket.io-session


