'use strict';

let couchdb: any = JSON.parse(process.env.cloud); // require('./cfenv').Credentials(process.env.CLOUDANT);

if (couchdb === null) {
    couchdb = require('/../env.json').cloud;
}

const nano: any = require('cloudant')(couchdb.url);
const couchUrl: any = couchdb.url;

 module.exports = {
    couchUrl,
    nano,
 };
