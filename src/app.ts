/**
 * Created by aRTie on 21/08/2017.
 */

import { getFirstPlayer } from './databaseMan/player';
import { getFirstMap } from './databaseMan/map';
import { getUsedTiles } from './databaseMan/tiles';
import { getAllReleaseNotes } from './databaseMan/release-notes';
import { getNpcs } from './databaseMan/npcs';


const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const bodyparser = require('body-parser');
// const encrkey = require('../env.json').encrkey;
// const test = require('../env.json').test;



/*
const mongo = require('mongodb');
const monk = require('monk');
const logDb = monk((process.env.IP || "0.0.0.0") + ':27017/logs');
*/
const messages= [
    {
        updateBy: 'nobody',
        text: 'nothing is working now'
    },
    {
        updateBy: 'nobody',
        text: 'nope, still nothing is working'
    }
];

const users: any[] = [{
    user: 'doop',
    email: 'noop',
    pass: 'loop'
}];

app.use(bodyparser.json());

app.use((req,res,next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-with, Content-Type, Accept, Authorization');
    next();
});

// Make our db accessible to our router
app.use((req,res,next) => {
//    req.logDb = logDb;
    next();
});

const api = express.Router();
const auth = express.Router();

api.get('/', (req, res) => {
    // res.send('sup homie');
    /*
    const logData = req.logDb;
    var collection = logData.get('mainLogs');
    collection.find({}, {}, (e,data) => {
        if(e){
            res.send(e);
        } else {
            res.send(data);
        }
    })*/
    /*
    getFirstPlayer().then(data =>{
        res.send(data);
    }).catch(e => {
        console.log(e);
        res.send(e);
    });
    */

    res.send('OKAY');
});

api.get('/release', (req, res) => {
    
    
    getAllReleaseNotes().then(messages =>{
        res.json(messages);
    }).catch(e => {
        res.status(400).send(e);
    });
});

api.get('/release/:user', (req, res) => {
    const result = messages.filter(oneUpdate => oneUpdate.updateBy === req.params.user)
    res.json(result);
});

api.post('/oneupdate', (req, res) => {
    console.log(req.body);
    messages.push(req.body.oneMessage);
    res.json(req.body.oneMessage);
});

api.get('/current-user', isAuthenticated ,(req, res) => {
    console.log(req.userId);
    res.json(users[req.userId]);
});

api.post('/current-user', isAuthenticated ,(req, res) => {
    const user: any= users[req.userId];

    user.firstName= req.body.firstName;
    user.lastName= req.body.lastName;
    res.json(user);
});


auth.post('/register', (req, res) =>{
    const index = users.push(req.body) -1;
    users[index].id = index;
    res.json({user:users[index].user, tuhken: sendToken(users[index])});


});



api.post('/new-game', (req, res) => {

    getFirstPlayer().then(playerData =>{
        getFirstMap().then(mapData =>{
            let uniqueTiles = [];
            for(let row of mapData.tiles) {
                for(let tile of row){
                    if(uniqueTiles.indexOf(tile) === -1) {
                        uniqueTiles.push(tile);
                    }
                }
            }
            
            getUsedTiles(uniqueTiles).then(tileData =>{
                getNpcs(req.body.lvl, mapData, tileData).then(npcData => {
                    res.send({
                        playerData: playerData,
                        npcData: npcData,
                        mapData: mapData,
                        tileData: tileData
                    });
                }).catch(e => {
                    console.log(e);
                    res.status(400).send(e);
                });
            }).catch(e => {
                console.log(e);
                res.status(400).send(e);
            });
                
        }).catch(e => {
            console.log(e);
            res.status(400).send(e);
        });
            
            
            
    }).catch(e => {
        console.log(e);
        res.status(400).send(e);
    });
    
    
    
});






auth.post('/login', (reg,res)=>{
    const foundUser = users.find(oneUser => (oneUser.user === reg.body.user && oneUser.pass === reg.body.pass));

    if(!foundUser) {
        return res.json({success: false})
    } else {
        return res.json({success: true, user: foundUser.user, tuhken: sendToken(foundUser)})
    }
});

function sendToken(user) {
    return jwt.sign(user.id, 'imastand1nkey')
}

function isAuthenticated(req, res, next) {
    if(!req.header('authorization')){
        return res.status(401).send({success: false, message:'Unauthorised access: no header'})
    }

    const token = req.header('authorization').split(' ')[1];

    const payload = jwt.decode(token, 'imastand1nkey');

    if(!payload){
        return res.status(401).send({success: false, message:'Unauthorised access: header invalid'})
    }

    req.userId = payload;

    next();
}


app.use('/api', api);
app.use('/auth', auth);

app.listen(process.env.PORT || 8080 /*, process.env.IP || "174.138.6.130" */, () => {
    console.log("Oversouled backed server listening at", (process.env.IP || "huh")  + ":" +  (process.env.PORT || 8080));
});
