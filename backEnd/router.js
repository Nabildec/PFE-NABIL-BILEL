var express = require('express');
var router = express.Router();
const fun = require('./fonction');
const Joi = require('joi');
router.use(express.json());
const mysql = require('mysql2');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('./models/user');


//getState working!!!
router.get('/api/etat/:id/:type', async (req, res) => {
    const state = await fun.getState(req.params.id, req.params.type);
    res.send(state);
});

//getGeneralState working!!!
router.get('/api/etat/:id', async (req, res) => {
    const state = await fun.getGeneralState(req.params.id);
    res.send(state);
});


//get etat de tout les web services avec nouvelle fonctions PS working now !!!.
router.get('/api/etat', async (req, res) => {
    await fun.actualiserAll();
    const states = await fun.getGeneralStateAll();
    res.send(states);
});


//working !!
router.get('/ping/:id/:type', async (req, res) => {
    await fun.actualiser(req.params.id, req.params.type);
    res.send('Success');
});

router.get('/ping1/:id/:type', async (req, res) => {
    await fun.actualiser(req.params.id, req.params.type);
    const state = await fun.getState(req.params.id, req.params.type);
    res.send(state);
});


router.get('/getHistorique', async (req, res) => {
    his = await fun.getHistorique();
    res.send(his);
});

router.get('/getSubStates/:service_id', async (req, res) => {
    his = await fun.getSubStates(req.params.service_id);
    res.send(his);
});

router.get('/api/test', async (req, res) => {
    let results = [];
    await fun.actualiserAll();
    let result = await fun.getGeneralStateAll();
    for (let i = 0; i < result.length; i++) {
        if (!result[i].service_id.toString().startsWith('_')) { results.push(result[i]); }
    }
    res.send(results);
});
router.get('/api/testInteroperabilites', async (req, res) => {
    let results = [];
    await fun.actualiserAll();
    let result = await fun.getGeneralStateAll();
    for (let i = 0; i < result.length; i++) {
        if (result[i].service_id.toString().startsWith('_')) { results.push(result[i]); }
    }
    res.send(results);;
});

router.post('/api/addUser', async (req, res) => {
    /* const schema = Joi.object({
         first_name: Joi.string().min(3).required(),
         last_name: Joi.string().min(3).required(),
         email: Joi.string().min(3).required(),
         password: Joi.string().min(3).required(),
         role: Joi.string().min(3).required()
     })
     const validation = schema.validate(req.body);
     if (validation.error) res.send(validation.error.message);
 */

    /*const salt = await bcrypt.genSalt(2);
    console.log(salt);
    const hashedPassword = await bcrypt.hash(req.body.password, salt)*/


    user = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role,
        receiveMail: req.body.receiveMail | null
    }
    let id = await fun.getUser(user.email);
    if (!id) { console.log(user.password); await fun.addUser(user); res.send("User added successfully"); }
    else { res.send(`User with entered email already exists. Try again with a different email`); }
});

router.put('/api/modifyUser/:id', async (req, res) => {
    user = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        password: req.body.password,
        role: req.body.role,
        receiveMail: req.body.receiveMail
    }

    const userId =req.params.id
    
 
  await fun.modifyUser(user, userId); res.send("User modified successfully"); 
  


}

);




router.delete('/api/deleteUser', async (req, res) => {
    const schema = Joi.object({ email: Joi.string().min(3).required() })
    const validation = schema.validate(req.body);
    if (validation.error) res.send(validation.error.message);


    let id = await fun.getUser(req.body.email);
    if (id) { await fun.deleteUser(req.body.email); res.send("User deleted successfully"); }
    else { res.send(`User with given email doesn't exist`); }
});

router.get('/api/getAllUsers', async (req, res) => {
    let result = await fun.getAllUsers();
    res.send(result);
});

router.get('/getHistoriqueP', async (req, res) => {
    let result = await fun.getHistoriquePannes();
    res.send(result);
});


router.post('/login', async (req, res) => {
    

    let user = await User.find(req.body.email);
    console.log(user.length);

    if (user.length != 1) {
        return res.status(404).send({
            message: 'Email inexistant'
        })
    }

    if (req.body.password != user[0].password) {
        return res.status(400).send({
            message: 'Mot de passe incorrecte'
        })
    }

    const token = jwt.sign({ _id: user[0].id }, "secrett")

    res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    })

    res.send({
        message: 'success'
    })
})


router.get('/user', async (req, res) => {
    try {
        const cookie = req.cookies['jwt']

        //decode jwt
        const claims = jwt.verify(cookie, 'secrett')

        if (!claims) {
            return res.status(401).send({
                message: 'unauthenticated'
            })
        }
        // res.send(claims)
        console.log(claims._id);

        const user = await User.findById(claims._id)
        res.send(user)
        //remove the password from the sent 
        //const { password, ...data } = await user.toJSON()
        // res.send(data)
    } catch (e) {
        return res.status(401).send({
            message: 'unauthenticated'
        })
    }
})

router.post('/logout', (req, res) => {
    res.cookie('jwt', '', { maxAge: 0 })

    res.send({
        message: 'success'
    })
})

router.get('/api/email', async (req, res) => {
    await fun.testMail();
    res.send('Success');

});

router.get('/api/nbErrorsEvolution/:duration', async (req, res) => {
  
    resultat = await fun.dataEvolutionPerService(req.params.duration);
    res.send(resultat);
  
 });
 
router.get('/api/nbErrors/:duration', async (req, res) => {
    resultat = await fun.dataErrorsPerService(req.params.duration);
    console.log(req.params.duration);
    res.send(resultat);

});

router.get('/api/nbErrorsEntete/:duration', async (req, res) => {
    resultat = await fun.dataEntete(req.params.duration);
    res.send(resultat);
});



router.post('/loginTest', async (req, res) => {


    let user = await User.find(req.body.email);
    console.log(user.length);

    if (user.length != 1) {
        return res.status(404).send({
            message: 'Email inexistant'
        })
    }

    const isEqual = await bcrypt.compare(req.body.password, user[0].password);
    if (!isEqual) {
        return res.status(400).send({
            message: 'Mot de passe incorrecte'
        })
    }

    const token = jwt.sign({ _id: user[0].id }, "secrett")

    res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    })

    res.send({
        message: 'success'
    })
})


router.delete('/api/deleteUsert/:email', async (req, res) => {


    let email = req.params.email
    let id = await fun.getUser(email);
    if (id) { await fun.deleteUser(req.params.email); res.send("User deleted successfully"); }
    else { res.send(`User with given email doesn't exist`); }
});

router.put('/api/setReceive1/:email', async (req, res) => {

    try {
        let id = await fun.getUser(req.params.email);
        console.log(id);
        if (id) { await fun.setReceive1(id); res.send("User will receive mails"); }
        else { res.send(`User with given email doesn't exist`); }

    } catch (err) {
        console.log(err.message);
    }


});

router.put('/api/setReceive0/:email', async (req, res) => {

    try {
        let id = await fun.getUser(req.params.email);
        console.log(id);
        if (id) { await fun.setReceive0(id); res.send("User will not receive mails"); }
        else { res.send(`User with given email doesn't exist`); }

    } catch (err) {
        console.log(err.message);
    }

});



router.get('/api/getAUser/:id', async (req, res) => {

    let result = await fun.getAUser(req.params.id);
    res.send(result);
});



module.exports = router;

