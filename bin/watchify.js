#!/usr/bin/env node
'use strict';
const BB = require('bluebird');
const glob = BB.promisify(require('glob'));
const exec = require('child_process').execSync;
const fs = require('fs');
const path = require('path');
const cwd = process.cwd();
const chalk = require('chalk');
const inquirer = require('inquirer');
console.log('cwd', cwd);
let port = 3000;
// options is optional
glob('app/http/**/*.client.js')
    .then(files => {
        if (files.length) {
            return inquirer.prompt([
                {
                    name: 'files',
                    type: 'checkbox',
                    choices: files,
                    message: 'Choose the files you wish to watch and build.'
                }
            ]);
        }
        return {files: []};
    })
    .then(answers => {
        const files = answers.files;
        console.log('files', files);
        let commands = files.map(file => {
            const entry = path.join(cwd, file);
            const output = path.join('app', 'http', 'public', 'bundles', path.basename(file).replace('client', 'bundle'));
            console.log('entry', entry);
            return `watchify -vd -p [ browserify-hmr -p ${++port} -u http://localhost:${port}] -e ${entry} -o ${output}`;
        });
        exec([...commands, 'bin/startup.sh'].join('&'), {stdio:'inherit'});
    })
    .catch(e => console.log('globe error', e));