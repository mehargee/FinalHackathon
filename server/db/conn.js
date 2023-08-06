const mongoos = require('mongoose');


//Database Altas connection
const DB = process.env.DATABASE;

//mongo compas connection
//const DB = 'mongodb://0.0.0.0:27017/mernstack'

mongoos.connect(DB).then(() => {
    console.log(`DB connection Sucessfull..!`);
}).catch((e) => {
    console.log(`no connetion`);
});
