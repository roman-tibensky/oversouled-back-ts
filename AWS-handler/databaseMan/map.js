var AWS = require('aws-sdk');
const cfg = require('../config.js');

// Set the region
AWS.config.update({region: cfg.region});
//let ddb = new AWS.DynamoDB({apiVersion: cfg.apiVersion});
let ddb = new AWS.DynamoDB.DocumentClient()

function getFirstMap(){
//    var params = {
//      TableName: cfg.maps,
//      Key: {
//        '_id' : {S:'default_map'},
//     }
//    };

    var params = {
        Key: {
            _id: 'default_map',
        },
        TableName: cfg.maps
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
    getFirstMap: getFirstMap
}