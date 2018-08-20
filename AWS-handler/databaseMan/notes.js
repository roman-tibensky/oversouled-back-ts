
let AWS = require('aws-sdk');
const cfg = require('./config.js');
const util = require('./util.js');

// Set the region
AWS.config.update({region: cfg.region});
//let ddb = new AWS.DynamoDB({apiVersion: cfg.apiVersion});
let ddb = new AWS.DynamoDB.DocumentClient()

exports.getReleaseNotes = (event, context, callback) => {

    let scanParams = {
        TableName: cfg.notes,
        FilterExpression: "attribute_exists(#id)",//"#id > :v",
        ExpressionAttributeNames: {
            '#id': '_id'
        } /*,
        ExpressionAttributeValues: {
            ":v": 0
        } */
    }

    ddb.scan(scanParams, function(err, body) {
        if (err) {
            console.log('error')
            console.log(err)
            callback(null, util.responseBuilder(err,500))
        } else {
            console.log('done')
            console.log(body)
            callback(null, util.responseBuilder(body,200))
        }
    })
}
