const moment = require('moment');

const aws = require('aws-sdk');
const { Response, Database } = require('../helpers');

aws.config.apiVersions = {
  costexplorer: '2017-10-25',
  // other service API versions
};
const today = new Date();
const thisMonth = today.getMonth() + 1;
const endDate = `${moment().format('yyyy-MM-DD')}`;
const startDate = `${moment('15 July 2020').format('yyyy-MM-DD')}`;
const monthStart = moment(`${thisMonth}/1/2020`).format('yyyy-MM-DD');
console.log(monthStart, thisMonth);

const costexplorer = new aws.CostExplorer({
  apiVersion: '2017-10-25',
  region: 'us-east-1',
});

const getCosts = () =>
  new Promise((resolve, reject) => {
    const ceParams = {
      TimePeriod: {
        End: endDate,
        Start: startDate,
      },
      Granularity: 'DAILY',
      Metrics: ['BlendedCost'],
    };
    console.log('calling cost explorer', ceParams);

    costexplorer.getCostAndUsage(ceParams, function(err, data) {
      if (err) console.log(err, err.stack);
      const offset = 769.67; // costs between 0:00 and 17:00 UTC prior to launch on 07/15
      // an error occurred
      const realData = data.ResultsByTime.filter(
        item => parseFloat(item.Total.BlendedCost.Amount) > 0
      );
      realData.pop();
      let costTotal = realData.reduce(function(acc, curr) {
        return acc + parseFloat(curr.Total.BlendedCost.Amount);
      }, 0);
      costTotal -= offset;
      const periodEnd = realData.pop().TimePeriod.End;
      const result = { costTotal, periodEnd };
      // successful response
      resolve(result);
    });
  });

const getMonthlyCosts = () =>
  new Promise((resolve, reject) => {
    const ceParams = {
      TimePeriod: {
        End: endDate,
        Start: monthStart,
      },
      Granularity: 'DAILY',
      Metrics: ['BlendedCost'],
    };
    console.log('calling cost explorer', ceParams);

    costexplorer.getCostAndUsage(ceParams, function(err, data) {
      if (err) console.log(err, err.stack);
      // an error occurred
      const realData = data.ResultsByTime.filter(
        item => parseFloat(item.Total.BlendedCost.Amount) > 0
      );
      realData.pop();
      if (Array.from(realData) && realData.length > 0) {
        const costTotal = realData.reduce(function(acc, curr) {
          return acc + parseFloat(curr.Total.BlendedCost.Amount);
        }, 0);
        const periodEnd = realData.pop().TimePeriod.End;
        const result = { costTotal, periodEnd };
        // successful response
        console.log('monthly results costs', result);

        resolve(result);
      } else {
        const result = { costTotal: 0 };
        resolve(result);
      }
    });
  });

const getHours = () =>
  new Promise((resolve, reject) => {
    try {
      const ceParams = {
        TimePeriod: {
          End: endDate,
          Start: startDate,
        },
        Filter: {
          And: [
            {
              Dimensions: {
                Key: 'INSTANCE_TYPE',
                Values: ['f1.2xlarge'],
              },
            },
            {
              Dimensions: {
                Key: 'USAGE_TYPE_GROUP',
                Values: ['EC2: Running Hours'],
              },
            },
          ],
        },
        Granularity: 'DAILY',
        Metrics: ['UsageQuantity'],
      };
      console.log('calling cost explorer', ceParams);

      costexplorer.getCostAndUsage(ceParams, function(err, data) {
        if (err) console.log(err, err.stack);
        const offset = 258.41; // f1 hours between 0:00 and 17:00 UTC prior to launch on 07/15
        // an error occurred
        const realData = data.ResultsByTime.filter(
          item => parseFloat(item.Total.UsageQuantity.Amount) > 0
        );
        realData.pop();
        let hoursTotal = realData.reduce(function(acc, curr) {
          return acc + parseFloat(curr.Total.UsageQuantity.Amount);
        }, 0);
        hoursTotal -= offset;
        const periodEnd = realData.pop().TimePeriod.End;
        const result = { hoursTotal, periodEnd };
        // // successful response
        resolve(result);
      });
    } catch (error) {
      reject(error);
    }
    // const startDate = moment(new Date()).toISOString()
  });

const getMonthlyHours = () =>
  new Promise((resolve, reject) => {
    try {
      const ceParams = {
        TimePeriod: {
          End: endDate,
          Start: monthStart,
        },
        Filter: {
          And: [
            {
              Dimensions: {
                Key: 'INSTANCE_TYPE',
                Values: ['f1.2xlarge'],
              },
            },
            {
              Dimensions: {
                Key: 'USAGE_TYPE_GROUP',
                Values: ['EC2: Running Hours'],
              },
            },
          ],
        },
        Granularity: 'DAILY',
        Metrics: ['UsageQuantity'],
      };
      console.log('calling cost explorer monthly hours', ceParams);

      costexplorer.getCostAndUsage(ceParams, function(err, data) {
        if (err) console.log(err, err.stack);
        // an error occurred
        const realData = data.ResultsByTime.filter(
          item => parseFloat(item.Total.UsageQuantity.Amount) > 0
        );
        realData.pop();
        console.log(realData);
        if (Array.from(realData) && realData.length > 0) {
          const hoursTotal = realData.reduce(function(acc, curr) {
            return acc + parseFloat(curr.Total.UsageQuantity.Amount);
          }, 0);
          const periodEnd = realData.pop().TimePeriod.End;
          const result = { hoursTotal, periodEnd };
          // // successful response
          console.log('monthly results hours', result);
          resolve(result);
        } else {
          const result = { hoursTotal: 0 };
          resolve(result);
        }
      });
    } catch (error) {
      reject(error);
    }
    // const startDate = moment(new Date()).toISOString()
  });

const db = new Database();

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false; /* eslint no-param-reassign: 0 */
  try {
    await db.makeConnection();
    const results = {};

    const spinupsTotal = await db.query(
      `SELECT COUNT(DISTINCT(Id)) AS Spinups FROM Environment WHERE Created > '2020-07-15 10:00 am' AND CreatedBy_FK <> 2`
    );
    console.log(
      `Total number of instances launched since go-live: ${JSON.stringify(
        spinupsTotal[0]
      )}`
    );
    results.spinups = spinupsTotal[0].Spinups;

    const spinupsTotalByType = await db.query(
      `SELECT e.Configuration_FK, count(Configuration_FK) AS Count, ic.Type, ic.Processor, ic.OS, ic.Variant 
        FROM Environment as e
          JOIN InstanceConfiguration as ic 
            ON ic.Id = e.Configuration_Fk
          JOIN User as u
            ON u.Id = e.CreatedBy_FK
        WHERE e.Created > '2020-07-15 10:00 am'
          AND u.IsRedTeam = true 
        GROUP BY e.Configuration_FK
        ORDER BY ic.SortKey ASC;`
    );
    console.log(
      `Total number of instances by type spinning up since go-live: ${JSON.stringify(
        spinupsTotalByType
      )}`
    );
    results.spinupsTotalByType = spinupsTotalByType;

    const spinupErrorsTotal = await db.query(
      `SELECT COUNT(DISTINCT(e.Id)) AS SpinupErrors FROM Environment as e JOIN User as u ON u.Id = e.CreatedBy_FK WHERE e.Created > '2020-07-15 10:00 am' AND e.Status = 'error' AND u.IsRedTeam = true;`
    );
    console.log(
      `Total number of instances erred out spinning up since go-live: ${JSON.stringify(
        spinupErrorsTotal[0]
      )}`
    );
    results.spinupErrorsTotal = spinupErrorsTotal[0].SpinupErrors;

    const terminationsTotal = await db.query(
      `SELECT COUNT(DISTINCT(e.Id)) AS Terminations FROM Environment as e JOIN User as u ON u.Id = e.CreatedBy_FK WHERE e.Created > '2020-07-15 10:00 am' AND (e.Status = 'terminated' OR e.Status = 'terminating') AND u.IsRedTeam = true;`
    );
    console.log(
      `Total number of instances terminated since go-live: ${JSON.stringify(
        terminationsTotal[0]
      )}`
    );
    results.terminationsTotal = terminationsTotal[0].Terminations;

    // NOTE: costs and hours are daily and remove the offset from 0:00 to 17:00 UTC on 07/15 when portal went live.
    const costData = await getCosts();
    console.log('COSTS', costData);
    results.costData = costData;

    const f1Hours = await getHours();
    console.log('F1HOURS', f1Hours);
    results.f1Hours = f1Hours;

    const monthlyCosts = await getMonthlyCosts();
    console.log('monthly', monthlyCosts);
    results.monthlyCosts = monthlyCosts;

    const monthlyHours = await getMonthlyHours();
    console.log('monthly', monthlyHours);
    results.monthlyHours = monthlyHours;

    return new Response(results).success();
  } catch (err) {
    console.log(err);
    // return new Response({ error: 'Could not retreive data' }).fail();
  }
};
