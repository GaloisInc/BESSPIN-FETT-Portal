const aws = require('aws-sdk');
const { Response, Database } = require('../helpers');

aws.config.apiVersions = {
  costexplorer: '2017-10-25',
  // other service API versions
};

const getCosts = () =>
  new Promise((resolve, reject) => {
    const startDate = new Date('15 July 2020 17:00 UTC').toISOString();
    const endDate = new Date().toISOString();
    const ceParams = {
      TimePeriod: {
        End: endDate,
        Start: startDate,
      },
      Granularity: 'HOURLY',
      Metrics: ['BlendedCost'],
    };
    console.log('calling cost explorer', ceParams);

    const costexplorer = new aws.CostExplorer({
      apiVersion: '2017-10-25',
      region: 'us-east-1',
    });

    costexplorer.getCostAndUsage(ceParams, function(err, data) {
      if (err) console.log(err, err.stack);
      // an error occurred
      else console.log(data); // successful response
      resolve(data);
    });
  });

const db = new Database();
exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false; /* eslint no-param-reassign: 0 */
  try {
    await db.makeConnection();
    const results = {};
    // const spinups = await db.query(
    //   `SELECT COUNT(DISTINCT(Id)) AS DailySpinup FROM Environment WHERE Created > NOW() - INTERVAL 24 HOUR AND CreatedBy_FK <> 2`
    // );
    // console.log(
    //   `Total number of instances launched in the last 24 hours: ${JSON.stringify(
    //     spinups[0]
    //   )}`
    // );
    // results.spinups = spinups[0];
    const spinupsTotal = await db.query(
      `SELECT COUNT(DISTINCT(Id)) AS Spinups FROM Environment WHERE Created > '2020-07-15 10:00 am' AND CreatedBy_FK <> 2`
    );
    console.log(
      `Total number of instances launched since go-live: ${JSON.stringify(
        spinupsTotal[0]
      )}`
    );
    results.spinups = spinupsTotal[0].Spinups;

    // const spinupsByType = await db.query(
    //   `SELECT e.Configuration_FK, count(Configuration_FK) AS Count, ic.Type, ic.Processor, ic.OS
    //     FROM Environment as e
    //       JOIN InstanceConfiguration as ic
    //         ON ic.Id = e.Configuration_Fk
    //     WHERE Created > NOW() - INTERVAL 24 HOUR
    //       AND CreatedBy_FK <> 2 group by Configuration_FK;`
    // );
    // console.log(
    //   `Total number of instances by type spinning up in the last 24 hours: ${JSON.stringify(
    //     spinupsByType
    //   )}`
    // );
    // results.spinupsByType = spinupsByType;

    const spinupsTotalByType = await db.query(
      `SELECT e.Configuration_FK, count(Configuration_FK) AS Count, ic.Type, ic.Processor, ic.OS 
        FROM Environment as e
          JOIN InstanceConfiguration as ic 
            ON ic.Id = e.Configuration_Fk 
        WHERE Created > '2020-07-15 10:00 am'
          AND CreatedBy_FK <> 2 group by Configuration_FK;`
    );
    console.log(
      `Total number of instances by type spinning up since go-live: ${JSON.stringify(
        spinupsTotalByType
      )}`
    );
    results.spinupsTotalByType = spinupsTotalByType;
    // const spinupErrors = await db.query(
    //   `SELECT COUNT(DISTINCT(Id)) AS DailySpinupErrors FROM Environment WHERE Created > NOW() - INTERVAL 24 HOUR AND Status = 'error' AND CreatedBy_FK <> 2;`
    // );
    // console.log(
    //   `Total number of instances erred out spinning up in the last 24 hours: ${JSON.stringify(
    //     spinupErrors[0]
    //   )}`
    // );
    // results.spinupErrors = spinupErrors[0];
    const spinupErrorsTotal = await db.query(
      `SELECT COUNT(DISTINCT(Id)) AS SpinupErrors FROM Environment WHERE Created > '2020-07-15 10:00 am' AND Status = 'error' AND CreatedBy_FK <> 2;`
    );
    console.log(
      `Total number of instances erred out spinning up since go-live: ${JSON.stringify(
        spinupErrorsTotal[0]
      )}`
    );
    results.spinupErrorsTotal = spinupErrorsTotal[0].SpinupErrors;
    // const terminations = await db.query(
    //   `SELECT COUNT(DISTINCT(Id)) AS DailyTerminations FROM Environment WHERE Created > NOW() - INTERVAL 24 HOUR AND (Status = 'terminated' OR Status = 'terminating') AND CreatedBy_FK <> 2;`
    // );
    // console.log(
    //   `Total number of instances terminated in the last 24 hours: ${JSON.stringify(
    //     terminations[0]
    //   )}`
    // );
    // results.terminations = terminations[0];
    const terminationsTotal = await db.query(
      `SELECT COUNT(DISTINCT(Id)) AS Terminations FROM Environment WHERE Created > '2020-07-15 10:00 am' AND (Status = 'terminated' OR Status = 'terminating') AND CreatedBy_FK <> 2;`
    );
    console.log(
      `Total number of instances terminated since go-live: ${JSON.stringify(
        terminationsTotal[0]
      )}`
    );
    results.terminationsTotal = terminationsTotal[0].Terminations;
    // const ceData = await getCosts();
    // console.log(ceData);

    // ce.getCostAndUsage(ceParams, function(err, results) {
    //   if (err) console.log(err, err.stack);
    //   // an error occurred
    //   else console.log(results); // successful response
    // });
    // const data = ce.getCostAndUsage(ceParams).promise();
    // console.log('Cost Explorer -->', JSON.stringify(data));
    return new Response(results).success();
  } catch (err) {
    console.log(err);
    // return new Response({ error: 'Could not retreive data' }).fail();
  }
};
