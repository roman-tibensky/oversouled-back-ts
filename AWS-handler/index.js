/*
import { getFirstPlayer } from './databaseMan/player';
import { getFirstMap } from './databaseMan/map';

import { getUsedTiles } from './databaseMan/tiles';
import { getAllReleaseNotes } from './databaseMan/release-notes';
import { getNpcs } from './databaseMan/npcs';
*/

const player = require('./databaseMan/player');
const map = require('./databaseMan/map');
const tiles = require('./databaseMan/tiles');
const npcs = require('./databaseMan/npcs');
const Utils = require('./utils.js');


var AWS = require('aws-sdk');
// Set the region
AWS.config.update({region: 'eu-west-1'});

// Create the DynamoDB service object


exports.handler = (event, context, callback) => {
    // TODO implement
    //callback(null, 'Hello from Lambda');

    console.log(event.body)
    let body = JSON.parse(event.body)
    console.log(body)
    // Call DynamoDB to read the item from the table





    player.getFirstPlayer().then(playerData =>{
        map.getFirstMap().then(mapData =>{
        let uniqueTiles = [];
    for(let row of mapData.tiles) {
        for(let tile of row){
            if(uniqueTiles.indexOf(tile) === -1) {
                uniqueTiles.push(tile);
            }
        }
    }


    tiles.getUsedTiles(uniqueTiles).then(tileData =>{
        npcs.getNpcs(body.lvl, mapData, tileData).then(npcData => {
        callback(null, Utils.responseBuilder({
        playerData: playerData,
        npcData: npcData,
        mapData: mapData,
        tileData: tileData
    }, 200))
}).catch(e => {
        console.log(e);
    callback(null, Utils.responseBuilder(e, 500))
});
}).catch(e => {
        console.log(e);
    callback(null, Utils.responseBuilder(e, 500))
});
}).catch(e => {
        console.log(e);
    callback(null, Utils.responseBuilder(e, 500))
});



}).catch(e => {
        console.log(e);
    callback(null, Utils.responseBuilder(e, 500))
});



};