import * as _ from 'lodash';
const nano: any = require('../couch').nano;
const mapCloud: any = nano.db.use('npcs');

export function getNpcs(lvl, mapData, tileData): Promise<any> {
    const tilesIndex = tileData.rows.map(oneTile => oneTile.id);
    const nameArr = [];
    const countArr = [];
    
    return new Promise((res, rej) => {
        mapCloud.view('views','npc-by-level-' + lvl, {revs_info: false, include_docs: true}, (err: any, body: any) => {
            if(err){
                rej(err);
            }
            
            const finalAmmount: number = Math.floor(Math.random()
                * (mapData.creaturePointMax - mapData.creaturePointMin)) + mapData.creaturePointMin;
            
            let currPoints = 0;
            let creatureArr = [];
            while (currPoints < finalAmmount) {
                const pickCreature: number = Math.floor(Math.random() * body.rows.length);
                let oneCreature = _.cloneDeep(body.rows[pickCreature]);
                let creaturePos = nameArr.indexOf(oneCreature.doc.name);
                oneCreature = placeNpc(creatureArr, oneCreature, mapData, tilesIndex, tileData);
                if(creaturePos < 0) {
                    nameArr.push(oneCreature.doc.name);
                    countArr.push(0);
                } else {
                    countArr[creaturePos]++;
                    oneCreature.doc.name = oneCreature.doc.name + countArr[creaturePos];

                }
                currPoints += body.rows[pickCreature].doc.mapCount;
                creatureArr.push(_.cloneDeep(oneCreature));
            }
            
            
            res(creatureArr);
        })
    })
}

function placeNpc(creatureArr:any[], alteredCreature:any , mapData: any,  tilesIndex: any, tileData: any) {
    //let alteredCreature = _.cloneDeep(oneCreature);
    let newX;
    let newY;
    
    while(!newX){
        const y: number = Math.floor(Math.random() * (mapData.tiles.length));
        const x: number = Math.floor(Math.random() * (mapData.tiles[y].length));
        
        
        if(tileData.rows[tilesIndex.indexOf(mapData.tiles[y][x])].doc.canBodyEnter){
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

    alteredCreature.doc.baseLevel = Math.floor(
        (alteredCreature.doc.baseStr +
        alteredCreature.doc.baseAgi +
        alteredCreature.doc.baseDex +
        alteredCreature.doc.baseMgc +
        alteredCreature.doc.baseDef +
        alteredCreature.doc.baseRes) / 5);
    
    return alteredCreature;
}