'use strict';

const Agenda = require('agenda');
const configs = require.main.require('./configs');

// Export a method so expressively can auto call it
module.exports = start;

function start(services) {
    let agenda = new Agenda({
            name : `Pinyin-Hanyu-${process.pid}`,
            db : {
                address: `${configs.grasshopper.db.base}/agenda`
            }
        });

    agenda.define('sync merge requests', (job, done) => {
        console.log('I am running the custom service!');
        services.customServiceName()
            .catch(e => { console.log('sync merge requests error: ', e); })
            .finally(() => {
                done();
            });
    });

    agenda.define('get profile pictures / avatars', (job, done) => {
        console.log('Getting profile pictures / avatars');
        services.otherService()
            .catch(e => { console.log('get profile pictures / avatars error: ', e); })
            .finally(() => {
                done();
            });
    });

    agenda.on('ready', () => {
        console.log('agenda is ready', new Date);
        // use crontab format if more precision is needed 0 0 * * * *
        agenda.every('1 day', 'sync merge requests');
        agenda.every('12:30am', 'get profile pictures / avatars');
        // agenda.schedule('in 20 seconds', 'sync merge requests');
        agenda.start();
    });
}