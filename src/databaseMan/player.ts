
const nano: any = require('../couch').nano;
const playerCloud: any = nano.db.use('players');

export function getFirstPlayer(): Promise<any> {
    return new Promise((res, rej) => {
        playerCloud.get('FIRST_SOUL', {revs_info: false}, (err: any, body: any) => {
            if(err){
                rej(err);
            }
            res(body);
        })
    })
}