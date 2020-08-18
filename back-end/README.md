# Back-End

This section includes automated setup and deployment for cloud resources, portal api, database migrations.

## Setup & Deployment

Automated setup and deployment is handled with Serverless Framework and AWS CloudFormation templates.

### Initial Steps

1. For the deployment to work, the initial step is to navigate to the /back-end/cloudformation/pipeline folder `cd cloudformation/pipeline`.  Follow instructions in the README there to setup the CICD Pipeline.  This will allow for automation and deployment of other resources via the CICD Pipeline.
2. Navigate to `/config` folder `cd ../../config` and create a json file with the appropriate pointers to resources created by AWS Control Tower and named after the current stage/branch (e.g., config.develop.json).  Follow the same naming conventions in other config files.
3. The Serverless Framework and AWS CloudFormation templates will deploy and configure: An Aurora DB Cluster, Front-end website hosting S3 bucket, learning document S3 bucket, CICD artifacts S3 bucket, Cloudfront designation for hosting via CDN, and Queues for communication of EC2s and the Portal API.  Triggering the build process is outlined in the main README document at the root level.

### Researcher Setup
For setting up the infrastructure for the researchers using the portal please navigate to the researcher folder `cd cloudformation/researcher` and follow the README instructions.

## Portal Api

AWS Lambda functions and API Gateway create the serverless API used by the portal and are configured by the Serverless Framework with the CICD process.  Adding new api's can be done in the serverless.yml file to create new endpoints or scheduled tasks.  For development purposes use the following steps:
1. Create a new function in the functions section of serverless.
2. Add Node-based file to the back-end/functions folder.
3. Install Serverless framework CLI
4. Setup your AWS profile in ~/.aws to match the SSO credentials supplied bu the Portal SSO.
5. Run the command `sls deploy --stage <STAGE> --aws-profile <NAME OF AWS PROFILE>` from the `back-end/` folder.  This will deploy all your local codebase changes related to Serverless resources/functions. NOTE: these changes will only persist until the next CICD process is triggered which will run the sls command from the chosen branch.  Alternatively, changes to an existing function can be made by running the command `sls deploy --stage <STAGE> --aws-profile <NAME OF AWS PROFILE> -f <NAME OF FUNCTION>`.

## Database Migrations

Database migrations will take place during the CICD process using knex and migrations are housed in the `back-end/migrations` folder.  To create new migrations you will need to setup knex locally.  
1. Install the knex cli via npm.
2. Install Docker.
3. Run the command `docker compose up` from the /back-end folder.  This will create a local version of the database for creating/testing migrations using username/password 'root', and keep it running via docker. 
4. To create a new migration run the command `knex migrate:make <NAMEOFMIGRATION> --stage local` from the same folder
5. Using a code editor create new up/down rules for the knex migration.
6. Finally use the command `knex migrate:latest --stage local` to test the migration on your local copy before adding to the CICD to run.

