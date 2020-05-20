create database FettPortal;
use FettPortal;
source /db/database.sql;
create user LocalMaster identified by "HA*S#NFAjsjs*";
grant all privileges on FettPortal.* to LocalMaster@'%';
-- FLUSH PRIVILEGES;