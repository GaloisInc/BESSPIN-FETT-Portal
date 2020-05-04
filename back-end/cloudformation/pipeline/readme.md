### Before running
1. Create an s3 bucket for build artifacts to live in
2. Create a secret in secrets manager with name = githubPersonalAccess and two key/values `gitHubOAuthToken` and `gitHubOwner`
3. If desired change the buildspecs path
4. Fill out the parameters in parameters.dev.json

### Example cli command
* Run from this path
```
aws cloudformation create-stack --stack-name <STACK_NAME-cicd> --template-body file://./template.yml --parameters file://./parameters.dev.json --profile <AWS_PROFILE> --region <REGION> --capabilities CAPABILITY_NAMED_IAM CAPABILITY_AUTO_EXPAND
```