const _ = require('lodash')

var AWS = require('aws-sdk');
const cfg = require('../config.js');

// Set the region
AWS.config.update({region: cfg.region})
let ddb = new AWS.DynamoDB.DocumentClient()


function getNpcs(lvl, mapData, tileData) {
    const tilesIndex = tileData.rows.map(oneTile => oneTile.id);
    const nameArr = [];
    const countArr = [];

    let scanParams = {
        TableName: cfg.npcs,
        FilterExpression: "contains(#depth, :v)",
        ExpressionAttributeNames: {
            '#depth': 'depthsAvailable'
        },
        ExpressionAttributeValues: {
            ":v": lvl
        }
    }

    let specialParams = {
        TableName: cfg.npcs,
        FilterExpression: "contains(#depth, :v)",
        ExpressionAttributeNames: {
            '#depth': 'depthsAvailable'
        },
        ExpressionAttributeValues: {
            ":v": -lvl
        }
    }


    return new Promise((res, rej) => {
        ddb.scan(scanParams, function(err, body) {
        //mapCloud.view('views','npc-by-level-' + lvl, {revs_info: false, include_docs: true}, (err: any, body: any) => {
        if(err){
            rej(err);
        }

        console.log(body)
        const finalAmmount = Math.floor(Math.random()
            * (mapData.creaturePointMax - mapData.creaturePointMin)) + mapData.creaturePointMin;

        let currPoints = 0;
        let creatureArr = [];
        while (currPoints < finalAmmount) {
            const pickCreature = Math.floor(Math.random() * body.Items.length);
            let oneCreature = _.cloneDeep(body.Items[pickCreature]);
            console.log(oneCreature)
            let creaturePos = nameArr.indexOf(oneCreature.name);
            oneCreature = placeNpc(creatureArr, oneCreature, mapData, tilesIndex, tileData);
            if(creaturePos < 0) {
                nameArr.push(oneCreature.name);
                countArr.push(0);
            } else {
                countArr[creaturePos]++;
                oneCreature.name = oneCreature.name + countArr[creaturePos];

            }
            currPoints += body.Items[pickCreature].mapCount;
            creatureArr.push(_.cloneDeep(oneCreature));
        }

        const applySpecial = Math.random();
        console.log(applySpecial)
        if(applySpecial <= 0.1) {

            ddb.scan(specialParams, function(err, body) {
                if(err) {
                    console.log(err)
                }
                const pickCreature = Math.floor(Math.random() * body.Items.length);
                let oneCreature = _.cloneDeep(body.Items[pickCreature]);
                let creaturePos = nameArr.indexOf(oneCreature.name);
                oneCreature = placeNpc(creatureArr, oneCreature, mapData, tilesIndex, tileData);
                if (creaturePos < 0) {
                    nameArr.push(oneCreature.name);
                    countArr.push(0);
                } else {
                    countArr[creaturePos]++;
                    oneCreature.name = oneCreature.name + countArr[creaturePos];

                }
                creatureArr.push(_.cloneDeep(oneCreature));

                res(creatureArr);
            });
        } else {
            res(creatureArr);
        }
    })
})
}

function placeNpc(creatureArr, alteredCreature, mapData,  tilesIndex, tileData) {
    //let alteredCreature = _.cloneDeep(oneCreature);
    let newX;
    let newY;

    while(!newX){
        const y = Math.floor(Math.random() * (mapData.tiles.length));
        const x = Math.floor(Math.random() * (mapData.tiles[y].length));


        if(tileData.rows[tilesIndex.indexOf(mapData.tiles[y][x])].canBodyEnter){
            let isUsed = false;
            for(const oneCreature of creatureArr){
                if(oneCreature.x === x && oneCreature.y === y) {
                    isUsed = true;
                }
            }
            if(!isUsed){

                alteredCreature.x = x;
                alteredCreature.y = y;
                alteredCreature._id = alteredCreature.id + '-' + y + '-' + x;
                newX = x;
            }

        }

    }

    alteredCreature.baseLevel = Math.floor(
        (alteredCreature.baseStr +
            alteredCreature.baseAgi +
            alteredCreature.baseDex +
            alteredCreature.baseMgc +
            alteredCreature.baseDef +
            alteredCreature.baseRes) / 5);

    return alteredCreature;
}


module.exports = {
    getNpcs: getNpcs
}