var AWS = require('aws-sdk');
const cfg = require('../config.js');

// Set the region
AWS.config.update({region: cfg.region})
let ddb = new AWS.DynamoDB.DocumentClient()

function getUsedTiles(uniqueTiles) {




    var params = {
        RequestItems: {
            [cfg.tiles]: {
                Keys: [

                ]
            }
        }
    }

    for (let  i=0; i< uniqueTiles.length; i++){
        params.RequestItems[cfg.tiles].Keys.push({_id: uniqueTiles[i]})
    }

    /*
    let values = []
    let valueOfValues = {}

    for (let  i=0; i< uniqueTiles.length; i++){
        let key = ':val' + i
        valueOfValues[key] = uniqueTiles[i]
        values.push(key)
    }

    var params = {
        TableName: cfg.tiles,
        FilterExpression: `#idname in (${values.join(', ')})`,
      "ExpressionAttributeNames": {
        '#idname': '_id'
      },
      ExpressionAttributeValues: {}
    }

    params.ExpressionAttributeValues = valueOfValues
    */

    /*
    let scanParams = {
      "TableName": cfg.players,
      "FilterExpression": `#_id in (:val1, :val2, :val3)`,
      "ExpressionAttributeNames": {
        '#idname': 'ID'
      },
      "ExpressionAttributeValues": {
        ':val1': '123',
        ':val2': '456',
        ':val3': '789'
      }
    }
    */

    return new Promise((res, rej) => {
        ddb.batchGet(params, function(err, data) {
        if (err) {
            console.log("Error", err);
            rej(err)
        } else {
            for(let tile of data.Responses[cfg.tiles]) {
                tile.id = tile._id
            }
            res({rows:data.Responses[cfg.tiles]})
        }
    });
})

    /*
    return new Promise((res, rej) => {
        tilesCloud.fetch({keys: uniqueTiles}, {revs_info: false}, (err: any, body: any) => {
            if(err){
                rej(err);
            }
            res(body);
        })
    })
    */
}

module.exports = {
    getUsedTiles: getUsedTiles
}