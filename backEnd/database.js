const mysql = require('mysql2'); 

module.exports =  mysql.createConnection(({
     host: 'localhost', 
     user: 'root' , 
     password: 'Dec123.Dec',
     database: 'pfe1'
})) ;


