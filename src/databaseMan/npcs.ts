const nano: any = require('../couch').nano;
const mapCloud: any = nano.db.use('npcs');

export function getNpcs(lvl, mapData): Promise<any> {
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
                
                
                oneCreature = placeNpc(creatureArr, oneCreature, mapData);
                currPoints += oneCreature.mapCount;
                creatureArr.push(oneCreature);
            }
            
            
            res(creatureArr);
        })
    })
}

function placeNpc(creatureArr:any[], oneCreature:any , mapData: any[]) {
    
}