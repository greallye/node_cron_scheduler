var Sequelize = require('sequelize');
var dbCon = require('./db_connection');
var schedule = require("node-schedule");
var markers = [];

//Table definition for Sequelize
const scheduledDefinition = {
    cron_time: {type: Sequelize.STRING(), primaryKey: true},
    jobs: Sequelize.STRING(1000),
    scheduler_function: Sequelize.STRING(1000)
};


const ApplicationDb = {
    //Create new jobs or update existhing jobs. You can fill in the console log in the variable 'scheduler_function'
    // with your own code or call. 
    createScheduler(cronTime, jobName){
        cancelJobs();
        getSchedule().then(function(results){
            var jobs = [];
            for(result of results){
                if(cronTime === result.cron_time){
                    jobs = JSON.parse(result.jobs);
                }
            }
            jobs.push(jobName)
            var scheduler_function =    'schedule.scheduleJob("'+cronTime+'", function(){\
                                            console.log('+JSON.stringify(jobs)+');\
                                        });'
            var query = "INSERT INTO job_tracker (cron_time, jobs, scheduler_function) VALUES ('"+cronTime+"', '" + JSON.stringify(jobs) + "', '"+scheduler_function+"') ON CONFLICT(cron_time) DO UPDATE SET jobs = '" + JSON.stringify(jobs) + "', scheduler_function = '"+scheduler_function+"';"
            const appDb = dbCon.createDbConnection('','','','','sqlite');
            appDb.query(query, { type: Sequelize.QueryTypes.INSERT})
            .then(results => {
                setupJobs();
            })

        });
    }
}

module.exports = ApplicationDb;

//Gets the jobs from the db
async function getSchedule(){
    let theseResults = [];
    const appDb = dbCon.createDbConnection('','','','','sqlite');
    const Config = appDb.define('job_tracker', scheduledDefinition, {timestamps: false, freezeTableName: true});
    await Config.findAll()
    .then(results => {
        for(result of results){
           theseResults.push(result.dataValues);
        }
    });
    return theseResults;
}

// cancels jobs that are set up if update occurs
function cancelJobs(){
    for (var i = 0; i < markers.length; ++i) {
        markers[i].cancel();
    }
};

//Schedule jobs from db
function setupJobs(){
    getSchedule().then(function(results){
        for (var i = 0; i < results.length; ++i) {
            markers[i] = eval(results[i].scheduler_function);
        }
    });
};

