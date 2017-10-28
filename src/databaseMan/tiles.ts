const nano: any = require('../couch').nano;
const tilesCloud: any = nano.db.use('tiles');

export function getUsedTiles(uniqueTiles): Promise<any> {
    return new Promise((res, rej) => {
        tilesCloud.fetch({keys: uniqueTiles}, {revs_info: false}, (err: any, body: any) => {
            if(err){
                rej(err);
            }
            res(body);
        })
    })
}