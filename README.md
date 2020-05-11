## CICD

Before the CICD template will work you must

1. Hooks are setup for dev branch

## Root

1. `npm install`

## Back-end

1. `cd ./back-end && npm install`

## Front-end

1. `cd ./front-end && npm install`
2. `npm run start` from the front-end directory
3. 'cd ./front-end && npm install --save react-swipe-to-delete-ios' for the swipe component
   Reference for react-swipe-to-delete: https://www.npmjs.com/package/react-swipe-to-delete and https://arnaudambro.github.io/react-swipe-to-delete-ios/

## Notes

In the back-end serverless is pinned to 1.44.1 this should be updated periodically

## Linting

On both the front-end and the back-end there are pre-commit hooks installed which will only allow a commit to happen if all of the files pass the linter.
