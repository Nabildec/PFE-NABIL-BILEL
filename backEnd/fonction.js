const db = require('./database');
const ping = require('ping');
const nodemailer = require('nodemailer');
const mysql = require('mysql2');
const path = require('path');
var hbs = require('nodemailer-express-handlebars');
const res = require('express/lib/response');





//---Here starts the functions--------
// create reusable transporter object using the default SMTP transport for sending mails
let transporter = nodemailer.createTransport({
  service: 'Hotmail',
  auth: {
    user: "casnos.monitoring@hotmail.com",
    pass: "Casnos.monitor123"
  }
});

const opt = {
  viewEngine: {
    extName: ".handlebars",
    partialsDir: path.resolve('./views'),
    defaultLayout: false,
  },
  viewPath: path.resolve('./views'),
  extName: ".handlebars",

}

transporter.use('compile', hbs(opt));



//9belha wid await exemple const lignes = query(sql,data); 
//sql => requete sql 
// data => vecteur fih les parametre li yjo dakhel la requete
exports.query = (sql, data) => {
  return new Promise((resolve, reject) => {
    db.query(sql, data, (err, rows) => {
      if (err) {
        return reject(err);
      }
      return resolve(rows);
    })
  })
}


//get adminEmails
exports.getAdminEmails = async (type, callback) => {
  sql = `SELECT email FROM users WHERE role=? AND receiveMail=1 ;`
  let data = [type];
  let mails = [];
  const rows = await this.query(sql, data);

  for (let i = 0; i < rows.length; i++) {
    mails.push(rows[i].email);
  }
  callback((mails));
}

exports.getMails = (type) => {
  return new Promise((resolve, reject) => {
    this.getAdminEmails(type, (mails) => {
      return resolve(mails);
    })
  })
}

// retourne l'etat specifique d'un webservice.
exports.getState = (service_id, type) => {
  return new Promise((resolve, reject) => {
    this.getEtat(service_id, type, (obj) => {
      return resolve(obj);
    })
  })
}

// retourne l'etat general d'un webservice.
exports.getGeneralState = (service_id) => {
  return new Promise((resolve, reject) => {
    this.getEtatGeneral(service_id, (obj) => {
      return resolve(obj);
    })
  })
}
// retourne l'etat general de tout les  webservices.
exports.getGeneralStateAll = () => {
  return new Promise((resolve, reject) => {
    this.getEtatGeneralAll((obj) => {
      return resolve(obj);
    })
  })
}


// fonction li 9belha using callback
exports.getEtat = async (service_id/*par ex S_SITEWEB*/, type /*DB*/, callback) => {
  sql = `SELECT * FROM Errors WHERE service_id = ? AND error_type_id= ? ORDER BY error_id DESC LIMIT 1`
  let data = [service_id, type];
  //si il n'y a pas d'erreur on dis que le service up depuis la creation de l'application.
  dateDebApp = new Date('February 22, 2022 22:22:22');
  const rows = await this.query(sql, data);
  if (rows.length == 0) { obj = { status: "Up", date: dateDebApp }; }
  else {
    if (rows[0].error_res_date) { obj = { status: "Up", date: rows[0].error_res_date }; }
    else { obj = { status: "Down", date: rows[0].error_date }; }
  }
  callback(obj);
}


//Get etat general d'un web service using callback.
exports.getEtatGeneral = async (service_id, callback) => {
  let finalState = {};
  let rows, data, sql, i;
  if (service_id != "S_INTEROPERABILITES") {
    const types = ["FRONT", "SERV", "DB"];



    for (i = 0; i < types.length; i++) {
      sql = `SELECT error_type_name FROM error_types WHERE error_type_id = ? `
      data = [types[i]];
      rows = await this.query(sql, data);
      const obj = await this.getState(service_id, types[i]);

      if (i > 0) {
        //à ecrire apres dans un seul if.
        if (finalState.status == "Down" && obj.status == "Down" && finalState.date.getTime() > obj.date.getTime()) { finalState = obj; finalState.cause = rows[0].error_type_name; }
        if (finalState.status == "Up" && obj.status == "Up" && finalState.date.getTime() < obj.date.getTime()) { finalState = obj; finalState.cause = "Service Up"; }
        if (finalState.status == "Up" && obj.status == "Down") { finalState = obj; finalState.cause = rows[0].error_type_name; }
      }
      else { finalState = obj; if (finalState.status == "Up") finalState.cause = "Service Up"; else finalState.cause = rows[0].error_type_name; }

    }
  }
  else {
    sql = "SELECT service_id , service_status , service_name FROM services  "
    data = [];
    rows = await this.query(sql, data);
    let j = 0;
    let date;
    finalState.date = new Date('December 17, 2023') ;
    for (i = 0; i < rows.length; i++) {
      if (rows[i].service_id.toString().startsWith('_')) {
        if (rows[i].service_status == "Down" && (finalState.date== Date('December 17, 2023') || (await this.getGeneralState(rows[i].service_id)).date.getTime() < finalState.date.getTime())) {
          j++;
          finalState.cause = rows[i].service_name;
          finalState.status = "Down";
          finalState.date = (await this.getGeneralState(rows[i].service_id)).date;
        }
        if (j == 0 && rows[i].service_status == "Up" && (!date || (await this.getGeneralState(rows[i].service_id)).date.getTime() > finalState.date.getTime())) {

          date = (await this.getGeneralState(rows[i].service_id)).date;
        }

      }
    }
    if (j == 0) {
      finalState.cause = "Service Up";
      finalState.status = "Up";
      finalState.date = date;
    }


  }
  finalState.service_id = service_id;
  callback(finalState);

}

exports.getEtatGeneralAll = async (callback) => {
  sql = `SELECT service_id , service_name FROM services `;
  data = [];
  const rows = await this.query(sql, data);
  let states = [];
  let state = {}

  for (let i = 0; i < rows.length; i++) {
    state = await this.getGeneralState(rows[i].service_id);
    state.name = rows[i].service_name;
    states.push(state);
  }
  callback(states);
}

//Callback 
callback = () => {
  return obj;
}
//Fonction pour recuperer l'URL du web service specifique. 
exports.getIp1 = async (service_id, type, callback) => {
  service_type = "service_" + type + "_address";
  sql = `SELECT ${service_type}
  FROM service_addresses
  JOIN services ON service_addresses.service_id = services.service_id
  WHERE service_addresses.service_id= ?   ; `
  data = [service_id];
  const rows = await this.query(sql, data);
  if (type == "FRONT") callback(rows[0].service_FRONT_address);
  if (type == "SERV") callback(rows[0].service_SERV_address);
  if (type == "DB") callback(rows[0].service_DB_address);
 }
 

exports.getIp = (service_id, type) => {
  return new Promise((resolve, reject) => {
    this.getIp1(service_id, type, (obj) => {
      return resolve(obj);
    });
  });
}

//retourne les sous etats d'un webservice.
exports.getSubStates = (service_id) => {
  return new Promise((resolve, reject) => {
    this.getSubEtats(service_id, (obj) => {
      return resolve(obj);
    })
  })
}

//getSub states. 
exports.getSubEtats = async (service_id, callback) => {

  let types = ["DB", "FRONT", "SERV"];
  let state;
  let states = [];
  let IP;
  for (let i = 0; i < types.length; i++) {

    IP = await this.getIp(service_id, types[i]);
    if (IP) {
      state = await this.getState(service_id, types[i]);
      if (types[i] == "DB") { state.name = "Base de données"; }
      if (types[i] == "SERV") { state.name = "Connexion serveur"; }
      if (types[i] == "FRONT") { state.name = "Front end"; }
      states.push(state);
    }
  }
  callback(states);



}




exports.pingDB = (db_config) => {
  return new Promise((resolve, reject) => {
    this.pingDB1(db_config, (obj) => {
      return resolve(obj);
    })
  })
}
exports.pingDB1 = async (db_config, callback/*object config de mssql */) => {
  let bool;
  let pool = mysql.createPool(db_config);
  pool.query('select 1 + 1', (err, rows) => {
    if (err) { bool = false; }
    else { bool = true; }
    callback(bool);
  });

}

//Fonction qui actualise la base de données 3la hssab haja specifique f webservice.
exports.actualiser = async (service_id, type /*Plus tard tzid l'URL li ypingi fih */) => {
  const rows = await this.query('SELECT service_name FROM services WHERE service_id= ? ', service_id);
  const service_name = rows[0].service_name;
  let pingRes;
  const IP = await this.getIp(service_id, type);
  if (IP) {
    if (type != "DB") {
      //npingiw had l'IP
      pingRes = await (await ping.promise.probe(IP,{deadline:1})).alive;
    }
    else {

      pingRes = await this.pingDB(IP);
    }

    let state = "";
    let rows;
    let mails;
    let mailsAdmin;
    let msg;
    let inf;
    if (pingRes) {//le service est UP
      state = await this.getState(service_id, type);
      if (state.status == "Down") {
        //fonction addResDate
        sql = `UPDATE Errors SET error_res_date =NOW() WHERE service_id = ? AND error_type_id= ? ORDER BY error_id DESC LIMIT 1`
        data = [service_id, type];
        rows = await this.query(sql, data);
        state = await this.getGeneralState(service_id);
        //Notifier l'admin ta3 type + directeur bli le service raw wela UP.
        mailsAdmin = await this.getMails("Admin");
        mails = (await this.getMails("Admin " + type)).concat(mailsAdmin);
        // envouyer mail l mails
        msg = {
          from: 'casnos.monitoring@hotmail.com',
          to: mails,
          subject: `SERVICE ${type} du service ${service_name} UP`,
          template: 'Up' , 
          context: {
            name: service_name,
            Stype: type,
          },
          attachments: [{
            filename: 'alarm.png',
            path: __dirname + '/images/alarm.png',
            cid: 'alarmPic'
          },
          {
            filename: 'logoCasnos.png',
            path: __dirname + '/images/logoCasnos.png',
            cid: 'logoCasnos'
          }],
        };

        inf = await transporter.sendMail(msg, (err) => {
          if (err) {
            console.log('Error in sending the mail');
          }
          else {
            console.log('Email sent successfully !');
          }
        });

        //Si il n'y a pas d'autres probleme mettre l'etat du service a Up.
        if (state.status == "Up") {
          //n9dro ndiroha fonction SET etat general.
          sql = `UPDATE Services SET service_status = ? WHERE service_id = ?`
          data = [state.status, service_id];
          rows = await this.query(sql, data);
          //notifier le directeur bli service complet wla UP. 
          //envoyer mail l mailsAdmin
          msg = {
            from: 'casnos.monitoring@hotmail.com',
            to: mailsAdmin,
            subject: `SERVICE ${service_name} UP`,
            template: 'Up',
            context: {
              name: service_name,
              Stype: type,
            },
            attachments: [{
              filename: 'coche.png',
              path: __dirname + '/images/coche.png',
              cid: 'upIcon'
            },
            {
              filename: 'logoCasnos.png',
              path: __dirname + '/images/logoCasnos.png',
              cid: 'logoCasnos'
            }],

          };

          const inf = await transporter.sendMail(msg, (err) => {
            if (err) {
              console.log('Error in sending the mail');
            }
            else {
              console.log('Email sent successfully !');
            }
          });
        }


      }

    }
    else {//le service est down.
      state = await this.getState(service_id, type);
      if (state.status == "Up") {
        sql = `INSERT INTO Errors (error_date,error_type_id,service_id)
    VALUES (NOW() , ? , ?)`
        data = [type, service_id];
        rows = await this.query(sql, data);

        //n9dro ndiroha fonction SET etat general.
        sql = `UPDATE Services SET service_status = ? WHERE service_id = ?`
        data = ["Down", service_id];
        rows = await this.query(sql, data);

        //Notifier l'admin (le directeur + l'ingenieur responsable).
        mails = (await this.getMails("Admin " + type)).concat(await this.getMails("Admin"));
        msg = {
          from: 'casnos.monitoring@hotmail.com',
          to: mails,
          subject: `Erreur service ${service_name} DOWN`,
          template: 'down',
          context: {
            name: service_name,
            Stype: type,
          },
          attachments: [{
            filename: 'coche.png',
            path: __dirname + '/images/coche.png',
            cid: 'upIcon'
          },
          {
            filename: 'logoCasnos.png',
            path: __dirname + '/images/logoCasnos.png',
            cid: 'logoCasnos'
          }],
        };

        inf = await transporter.sendMail(msg, (err) => {
          if (err) {
            console.log('Error in sending the mail');
          }
          else {
            console.log('Email sent successfully !');
          }
        });


      }
    }
  }
};

//fonction qui actualise est ping tout les subServices d'un web service. 
exports.actualiserService = async (service_id) => {
  let types = ["SERV", "DB", "FRONT"];
  for (let i = 0; i < types.length; i++) {
    await this.actualiser(service_id, types[i]);
  };
}

//fonction qui actualise tout les web subServices de tout les webservice.
exports.actualiserAll = async () => {
  sql = `SELECT service_id FROM services `;
  data = [];
  const rows = await this.query(sql, data);
  for (let i = 0; i < rows.length; i++) {
    await this.actualiserService(rows[i].service_id);
  }
}
//Fonction pour avoir l'historique des changements de status.
exports.getHisto = async (callback) => {
  sql = `SELECT service_name , error_type_name , error_date , error_res_date 
     FROM Errors
     JOIN Services ON Errors.service_id = Services.service_id 
     JOIN Error_Types ON Errors.error_type_id =Error_Types.error_type_id   ; `
  let data = [];
  objs = [];
  const rows = await this.query(sql, data);
  for (let i = 0; i < rows.length; i++) {
    obj = rows[i];
    obj1 = {
      service_name: obj.service_name,
      error_type_name: obj.error_type_name,
      date: obj.error_date,
      state: "Down"
    }
    if (obj.error_res_date) {
      obj2 = {
        service_name: obj.service_name,
        error_type_name: obj.error_type_name,
        date: obj.error_res_date,
        state: "Up"
      }
      objs.push(obj1, obj2);
    }
    else objs.push(obj1);

  }

  objs.sort((a, b) => { return (b.date.getTime() - a.date.getTime()); });


  callback(objs.sort());
};

exports.getHistorique = () => {
  return new Promise((resolve, reject) => {
    this.getHisto((obj) => {
      return resolve(obj);
    })
  })
}
//fonction pour avoir l'hitorique des erreurs.
exports.getHistoP = async (callback) => {
  sql = `SELECT service_name , error_type_name , error_date , error_res_date 
     FROM Errors
     JOIN Services ON Errors.service_id = Services.service_id 
     JOIN Error_Types ON Errors.error_type_id =Error_Types.error_type_id   ; `
  let data = [];
  objs = [];
  let rows = await this.query(sql, data);
  rows.sort((a, b) => { return (b.error_date.getTime() - a.error_date.getTime()); });
  rows = rows.sort();
  for (let i = 0; i < rows.length; i++) {
    obj = rows[i];
    if (rows[i].error_res_date) { obj.resolue = true; }
    else { obj.resolue = false; }
    objs.push(obj);
  }

  callback(objs.sort());
};

exports.getHistoriquePannes = () => {
  return new Promise((resolve, reject) => {
    this.getHistoP((obj) => {
      return resolve(obj);
    })
  })
}
//Fonction gestion des utilisateurs. 
//Fonction ajouter 
exports.addUser = async (user) => {
  const sql = `INSERT INTO users ( first_name, last_name,email,password,role,receiveMail)
               VALUES (?,?,?,?,?,?)`;
  const data = [user.first_name, user.last_name, user.email, user.password, user.role,user.receiveMail]
  await this.query(sql, data);
}


exports.modifyUser = async (user,id ) => {
  const sql = `UPDATE users  
  SET  first_name=? , last_name=? ,password=? ,role=?,receiveMail=?  
  WHERE id=? `;
  const data = [user.first_name, user.last_name, user.password, user.role,user.receiveMail,id];
  await this.query(sql, data);
}

exports.deleteUser = async (mail) => {
  const sql = `DELETE FROM users   
  WHERE email = ?`;
  const data = [mail];
  await this.query(sql, data);
}

exports.getAllUsers = () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM users`
    db.query(sql, (err, rows) => {
      if (err) {
        return reject(err);
      }
      return resolve(rows);
    })
  })
}

exports.getUser1 = async (mail, callback) => {
  const sql = `SELECT id FROM users WHERE email= ?`
  const data = [mail];
  rows = await this.query(sql, data);
  if (rows.length != 0) callback(rows[0].id);
  else callback(null);

}

exports.getUser = (mail) => {
  return new Promise((resolve, reject) => {
    this.getUser1(mail, (id) => {
      return resolve(id);
    })
  })
}

exports.testMail = async () => {
  msg = {
    from: 'casnos.monitoring@hotmail.com',
    to: 'nabil.lion.14@gmail.com , nabil.hand.14@gmail.com' ,
    subject: `SERVICE NOMSERVICE  DOWN`,
    template: 'down',
    attachments: [{
      filename: 'alarm.png',
      path: __dirname + '/images/alarm.png',
      cid: 'alarmPic'
    },
    {
      filename: 'logoCasnos.png',
      path: __dirname + '/images/logoCasnos.png',
      cid: 'logoCasnos'
    }],


  };

  await transporter.sendMail(msg, (err) => {
    if (err) {
      console.log('Error in sending the mail'+err);
    }
    else {
      console.log('Email sent successfully !');
    }
  });

}

//fonction statistiques. 

exports.nbErr = async (duration, service, callback) => {

  if (duration.toString().toUpperCase() == "WEEK") {
    sql = `SELECT * from errors WHERE error_date >= DATE_ADD(CURDATE(), INTERVAL -6 DAY)`;
  } else if (duration.toString().toUpperCase() == "MONTH") {
    sql = `SELECT * from errors WHERE  error_date >= DATE_ADD(CURDATE(), INTERVAL -29 DAY)`;
  }
  if (service) {
    sql = sql + ` AND service_id = ?`;
  }

  data = [service];
  res1 = await this.query(sql, data);


  callback(res1.length);
}

exports.nbError = (duration, service) => {
  return new Promise((resolve, reject) => {
    this.nbErr(duration, service, (nbError) => {
      return resolve(nbError);
    })
  })
}

exports.lastDown = () => {
  return new Promise((resolve, reject) => {
    this.lastDown1((service) => {
      return resolve(service);
    })
  })
}

exports.lastDown1 = async (callback) => {
  sql = `SELECT service_name FROM Errors 
         JOIN Services ON Errors.service_id = Services.service_id
         ORDER BY error_date DESC LIMIT 1 `;
  data = [];
  let res = await this.query(sql, data);
  callback(res);

}

exports.delaiMoy = async (duration, callback) => {
  let moy = 0;
  if (duration.toString().toUpperCase() == "WEEK") {
    sql = `SELECT * from errors WHERE error_date >= DATE_ADD(CURDATE(), INTERVAL -6 DAY)`;
  } else if (duration.toString().toUpperCase() == "MONTH") {
    sql = `SELECT * from errors WHERE  error_date >= DATE_ADD(CURDATE(), INTERVAL -29 DAY)`;
  }

  data = [];
  let res1 = await this.query(sql, data);

  for (let i = 0; i < res1.length; i++) {
    if (res1[i].error_res_date) {
      if (moy == 0) { moy = res1[i].error_res_date.getTime() - res1[i].error_date.getTime() }
      else { moy = ((moy + (res1[i].error_res_date.getTime() - res1[i].error_date.getTime())) / 2); }

    }
  }
  //rendre le format HH:MM:SS
  moy = new Date(moy).toISOString().slice(11,19);
  callback(moy); 
}

exports.delaiMoyen = (duration) => {
  return new Promise((resolve, reject) => {
    this.delaiMoy(duration, (moy) => {
      return resolve(moy);
    })
  })
}



exports.dataErrorsPerS = async (duration, callback) => {
  sql = `SELECT service_id FROM services`;
  data = [];
  let rows = await this.query(sql, data);
  let resultat = [];
  let resultat1 = [];
  let resultat2 = [];



  for (let i = 0; i < rows.length; i++) {
    let obj = {};

    obj.name = rows[i].service_id;
    obj.value = await this.nbError(duration, rows[i].service_id);
    if (!rows[i].service_id.toString().startsWith('_') && rows[i].service_id != 'S_INTEROPERABILITES') {
      resultat1.push(obj);
    }
    else if(rows[i].service_id != 'S_INTEROPERABILITES'){ resultat2.push(obj); }

  }
  resultat.push(resultat1, resultat2);
  callback(resultat);
}

exports.dataErrorsPerService = (duration) => {
  return new Promise((resolve, reject) => {
    this.dataErrorsPerS(duration, (obj) => {
      return resolve(obj);
    })
  })
}


exports.evolutionErr = async (duration,service ,  callback) => {
  sql = `SELECT  DATE(error_date) name, COUNT(DISTINCT error_id) value
         FROM    errors
        `;
    data = []

    if(service){ sql = sql + ` WHERE service_id = "${service}"
    GROUP   BY  DATE(error_date)
    ORDER BY name ` ; }
    else {sql = sql + `GROUP   BY  DATE(error_date)
    ORDER BY name ` ;

    }
    var resultat = await this.query(sql, data);
    date = new Date();
    let nextDate;

    if (resultat.length == 0 || (resultat[resultat.length - 1].name != new Date())  ) resultat.push({
      name: date,
      value: 0
  });
  if(resultat.length<30){
    let dateC = new Date() ; 
    resultat.unshift({
      name: new Date(dateC.getTime() - 30 * 24 * 60 * 60 * 1000),
      value: 0});

  }


    for (let i = 0; i < resultat.length - 1; i++) {
        dateA = new Date(resultat[i].name);
        nextDate = new Date(dateA.getTime() + 24 * 60 * 60 * 1000);

        if (resultat[i + 1].name.getTime() > nextDate.getTime()) {
            obj = {
                name: nextDate ,
                value: 0
            }
            resultat.splice(i + 1, 0, obj);
        }
    }
    
 resultat.pop(); 
   for(let i = 0 ; i<resultat.length ; i++ ){
     resultat[i].name = resultat[i].name.toLocaleDateString(); 
   }
   // if week njibo -7  if month njibo -30 
    let j ; 
    if(duration.toString().toUpperCase()=="WEEK") j= 7 ; 
     else if(duration.toString().toUpperCase()=="MONTH") j = 30 ; 

     for(let i = 0; i < resultat.length; i++){

      resultat[i].name = new Date(resultat[i].name).toLocaleDateString('fr-FR');
     }
  callback(resultat.slice(-j));
}

exports.evolutionErrors = (duration , service) => {
  return new Promise((resolve, reject) => {
    this.evolutionErr(duration , service ,  (obj) => {
      return resolve(obj);
    })
  })
}


exports.evolutionErrPerS = async (duration, callback) => {
  sql = `SELECT service_id FROM services`;
  data = [];
  let rows = await this.query(sql, data);
  let resultat = [];
  let resultat1 = [];
  
  
  
  for (let i = 0; i < rows.length; i++) {
    let obj = {};
    obj.name = rows[i].service_id;
    obj.series = await this.evolutionErrors(duration, rows[i].service_id);
      resultat1.push(obj);
  }
  
  resultat.push(resultat1 , [{name : "All services" ,
  series :  await this.evolutionErrors(duration)}]);
   callback(resultat);
 }
 

exports.dataEvolutionPerService = (duration) => {
  return new Promise((resolve, reject) => {
    this.evolutionErrPerS(duration, (obj) => {
      return resolve(obj);
    })
  })
}



exports.dataEnt = async (duration , callback) => {
  //write here. 
  let resultat = [] ; 
  let lastDown =  await this.lastDown() ; 
 let  obj1 = {  name : "Nombre d'erreur totale" , 
                value :await this.nbError(duration) }
                , obj2 = {name : "Dernier service down" , 
                          value : lastDown[0].service_name }  ,
                          obj3 = { name : "Délai moyen de coupure",
                                   value : await this.delaiMoyen(duration)  
                          } ; 
                          resultat.push(obj1 , obj2 , obj3 ) ; 
  callback(resultat);
}
exports.dataEntete = (duration) => {
  return new Promise((resolve, reject) => {
    this.dataEnt(duration ,  (obj) => {
      return resolve(obj);
    })
  })
}


exports.getAUser = (id) => {
  return new Promise((resolve, reject) => {
  const sql = `SELECT * FROM users WHERE id=?`
  const data =[id]
  db.query(sql,data,(err, rows) => {
    if (err) {
      return reject(err);
    }
    return resolve(rows);
  })
  })
}



exports.getUserbyId1 = async (id, callback) => {
  const sql = `SELECT id FROM users WHERE id= ?`
  const data = [id];
  rows = await this.query(sql, data);
  if (rows.length != 0) callback(rows[0].id);
  else callback(null);

}


exports.getUserbyId = (userId) => {
  return new Promise((resolve, reject) => {
    this.getUser1(userId, (id) => {
      return resolve(id);
    })
  })
}

exports.setReceive1 =async (id)=>{
 
  const sql=`UPDATE users SET receiveMail=? WHERE id=?`;
  const data =[true,id];
  await this.query(sql, data);
}

exports.setReceive0 =async (id)=>{
  const sql=`UPDATE users SET receiveMail=? WHERE id=?`;
  const data =[false,id];
  await this.query(sql, data);
}

exports.getAUser = (id) => {
  return new Promise((resolve, reject) => {
  const sql = `SELECT * FROM users WHERE id=?`
  const data =[id]
  db.query(sql,data,(err, rows) => {
    if (err) {
      return reject(err);
    }
    return resolve(rows);
  })
  })
}

  //---here ends the functions------


