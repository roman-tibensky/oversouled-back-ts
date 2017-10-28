const nano: any = require('../couch').nano;
const mapCloud: any = nano.db.use('maps');

export function getFirstMap(): Promise<any> {
    return new Promise((res, rej) => {
        mapCloud.get('default_map', {revs_info: false}, (err: any, body: any) => {
            if(err){
                rej(err);
            }
            res(body);
        })
    })
}