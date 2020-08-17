# Front-End
Front-end is built with React using Tailwind for handling css.  Before running npm start to initiate a localhost version of the site follow the Initial Setup for Auth below:

## Initial Setup of Portal with Auth
Code for the portal is deployed to an S3 Hosting Bucket outlined in the root level README File.  In order to begin using the portal use the following instructions.
1. Log in to AWS Console with the SSO credentials associated with the branch you are setting up. 
2. Navigate to Cognito Console --> Manage User Pools
3. Create new user pool called fettportal-<STAGE>
4. In configuration steps set 'Only administrators can create users', users signup with 'username', and email delivery through SES to 'no'.  Otherwise, use default configuration.
5. In the User Pool Console select App Clients from the side bar and add new App Client called 'fettportal<STAGE>'. In configuration steps set token expiration for 1 day(minimum value), set no App Client Secret as this is handled by the front-end Amplify package. 
6. From General Settings copy the User Pool Id and from App Client Settings copy the new App Client Id
7. Navigate to Cognito Identity Pool in the Console where User Pools was selected previously.
8. Create a new identity pool.  In configuration step under Authentication Providers add the User Pool Id and App Client Id copied in step 6. Let it create new policies for Auth and UnAuth Roles. Copy the new Identity Pool Id.
9. Add the ID Pool Id and Client Pool Id and App Client IDs to your .env.local and buildspec.develop.yml located in root directory and /buildspec folder, respectively for local/development work or buildspec.<STAGE>.yml for any other branch.   

### Notes
Includes
1. Five-talent linter
2. react-hot-loader
3. react-rewired for doing things without ejecting
4. node-sass
5. react-router-dom
6. prop-types
