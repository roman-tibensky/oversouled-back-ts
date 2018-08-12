var AWS = require('aws-sdk');
const cfg = require('../config.js');

// Set the region
AWS.config.update({region: cfg.region})
let ddb = new AWS.DynamoDB.DocumentClient()

function getFirstPlayer(){
//    var params = {
//      TableName: cfg.players,
//      Key: {
//        '_id' : {S:'UNIVERSAL_MIGRATOR'},
//      }
//    };


    var params = {
        Key: {
            _id: 'UNIVERSAL_MIGRATOR',
        },
        TableName: cfg.players
    }

    return new Promise((res, rej) => {
        ddb.get(params, function(err, data) {
        if (err) {
            console.log("Error", err);
            rej(err)
        } else {
            console.log('OKAY')
            res(data.Item)
        }
    });
})
}


module.exports = {
    getFirstPlayer: getFirstPlayer
}