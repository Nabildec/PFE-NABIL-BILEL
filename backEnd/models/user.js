
const db = require('../database');
const fun = require('../fonction');

module.exports = class User {

  constructor(name, email, password) {
    this.name = name;
    this.email = email;
    this.password = password;
  }


  static async find (email) {
    console.log("Query Executed");
    let sql = 'SELECT * FROM users WHERE email = ?';
    let data = [email]
    let results = await fun.query(sql,data); 
    return results;
  }

  static async findById(id) {
    console.log("Query Id Executed");
    let sql = 'SELECT * FROM users WHERE id = ?';
    let data = [id];
    let results =await fun.query(sql,data)
    return results
     
  }

  static save(user) {
    return db.execute(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [user.name, user.email, user.password]
    );
  }
};