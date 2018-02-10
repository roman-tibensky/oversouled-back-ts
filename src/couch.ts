'use strict';
let couchdb: any;
// let couchdb: any = JSON.parse(process.env.cloud); // require('./cfenv').Credentials(process.env.CLOUDANT);

//if (couchdb === null) {
    // couchdb = require('./../env.json').cloud;
//}

const nano: any = 'N/A'; //require('cloudant')(couchdb.url);
const couchUrl: any = 'N/A'; //couchdb.url;

 module.exports = {
    couchUrl,
    nano,
 };
