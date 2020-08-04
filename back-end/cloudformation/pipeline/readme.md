### Before running
1. Create an s3 bucket for build artifacts to live in
2. Create a secret in AWS Secrets Manager with name = githubPersonalAccess and two key/values `gitHubOAuthToken` and `gitHubOwner` obtained from your FETT-Portal github repo settings.
3. Create webhooks on github for the branch you are creating CICD with.
3. If desired change the buildspecs path
4. Fill out the parameters in parameters.dev.json.  Note these initial resources will have been setup by AWS Control Tower for the account housing the build.

### Example cli command
* Run from this path
```
aws cloudformation create-stack --stack-name <STACK_NAME-cicd> --template-body file://./template.yml --parameters file://./parameters.<BRANCH or STAGE>.json --profile <AWS_PROFILE> --region <REGION> --capabilities CAPABILITY_NAMED_IAM CAPABILITY_AUTO_EXPAND
```