'use strict';

const mongoose = require('mongoose');
module.exports = TemplateService;

function TemplateService () {

    if (!(this instanceof TemplateService)) {
        return new TemplateService();
    }

    this.model = mongoose.model('Template');

    this.list = list;
};

function list() {
    // return this.model.find({}, (err, docs) => {
    //     if (err) {
    //         throw err;
    //     }
    // });
}


////////copied callMergeRequestService stuff - not working, no API key
'use strict';

//controller import stuff
const pkg = require.main.require('../package.json');
const mongoose = require('mongoose');
const superagent = require('superagent');
const Promise = require('bluebird');
const _ = require('lodash');
const PAGE_COUNT = 100;

module.exports = updateMergeDB;

function getProjectsPerGroup(groupsResponse) {
    //get all projects for each group
    return Promise.each(_.range(0, groupsResponse.body.length), i => {
        //for all groups in response ranging from index 0 to total response length, query projects per group
        return Promise.each(_.range(1, 20), p => {
            //get all pages containing projects for each group query
            return superagent.get(`https://git.soliddigital.com/api/v3/groups/${groupsResponse.body[i].id}/projects?per_page=${PAGE_COUNT}&page=${p}`)
            .set('PRIVATE-TOKEN', 'MISSINGTOKEN')
            .then(projectsResponse => {
                console.log('Projects request ' + i + 'complete');

                //call function to get all merge requests for each project
                return getMergeRequestsPerProject(projectsResponse);
            })
        })
        .catch(err => {
            console.log('Project Error', err.message);
        });
    });
}

function getMergeRequestsPerProject(projectsResponse) {

    return Promise.each(_.range(0, projectsResponse.body.length), j => {

        let projectName = projectsResponse.body[j].name_with_namespace;
        console.log(projectName);

        //get all merge request pages for each project up to page 19
        return Promise.each(_.range(1, 20), function(q) {
            //get all merge requests for each project
            return superagent.get(`https://git.soliddigital.com/api/v3/projects/${projectsResponse.body[j].id}/merge_requests?state=all&per_page=${PAGE_COUNT}&page=${q}`)
            .set('PRIVATE-TOKEN', 'MISSINGTOKEN')
            .then(mergeResponse => {
                // console.log('Merges request ' + j + 'complete');

                //call function to create/update merge requests in database
                return findUpdateMergeRequests(mergeResponse, projectName);
            });
        })
    });
}

function findUpdateMergeRequests(promiseResponse, projectName) {
    const MergeRequest = mongoose.model('MergeRequest');

    Promise.each(_.range(0, promiseResponse.body.length), k => {
    console.log('Saving merge request ' + k + 'complete');

    return MergeRequest.findOneAndUpdate(
        {
            //look into database for unique ID and if found, update, or if not found, then create entry
            id: promiseResponse.body[k].id
        }, 
        {
            //Create/update database document with instance values for each field
            id: promiseResponse.body[k].id,
            username: promiseResponse.body[k].author.username,
            authorName: promiseResponse.body[k].author.name,
            createdDate: promiseResponse.body[k].created_at,
            state: promiseResponse.body[k].state,
            title: promiseResponse.body[k].title.toLowerCase(),
            description: promiseResponse.body[k].description.toLowerCase(),
            closedDate: promiseResponse.body[k].updated_at,
            projectBranch: promiseResponse.body[k].source_branch,
            projectName: projectName.toLowerCase(),
            web_url: promiseResponse.body[k].web_url
        }, 
        {
            upsert: true
        }
    )
    .then(() => { console.log('done saving'); })
    .catch(e => { console.log('e', e)});
    });
}


function updateMergeDB() {
    console.log('updateMergeDB function has been called to run!');

    var doneWithGroups = false;
    
    Promise.each(_.range(1,100), h => {
        //get all group IDs for Solid Digital
        //For all pages with j, from page 1 to 100
        return superagent.get(`https://git.soliddigital.com/api/v3/groups?per_page=${PAGE_COUNT}&page=${h}`)
        .set('PRIVATE-TOKEN', 'MISSINGTOKEN')
        .then(groupsResponse => {
            console.log('Groups request ' + h + 'complete');
            //if groups are all done and doneWithGroups is true
            if (doneWithGroups) {
                throw {'message': 'All done!'};
            } 
            //if this is the last page with data (under 100 entries) then change doneWithGroups to true
            if (groupsResponse.body.length < PAGE_COUNT) {
                doneWithGroups = true;
            }

            //call function to get all projects for each group
            return getProjectsPerGroup(groupsResponse);
        });
    });
}