const nano: any = require('../couch').nano;
const tilesCloud: any = 'N/A'; // nano.db.use('release_notes');

export function getAllReleaseNotes(): Promise<any> {
    return new Promise((res, rej) => {
        tilesCloud.get('_all_docs', {revs_info: false, include_docs: true, descending: true}, (err: any, body: any) => {
            if(err){
                rej(err);
            }
            res(body);
        })
    })
}