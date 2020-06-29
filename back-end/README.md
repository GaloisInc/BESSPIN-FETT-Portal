# Back-End


### LOCAL Database setup
```sql
CREATE USER 'fettportals'@'localhost' IDENTIFIED BY 'ive*got*money*balls';
GRANT ALL PRIVILEGES ON *.* TO 'fettportals'@'localhost';
```
##### manually create a new database `monthly_reports`
### Database migrations
`knex migrate:latest --env local`<br />
`--env dev` will be used to run migrations in the dev environment`


### Development
* `sls offline start --stage local`



### Brian Notes
- After an instance stops and you want to start it again; **MAKE SURE YOU REMOVE THE USER DATA BEFORE RESTARTING**
- Userdata logs sudo cat /var/log/user-data.log
- User data creates a file /home/centos/downloadAndStartFett.sh and runs that
