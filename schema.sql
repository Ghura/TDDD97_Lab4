drop table if exists users;
create table users(firstname text, familyname text, email text PRIMARY KEY, password text, gender text, city text, country text);

drop table if exists users_loggedin;
create table users_loggedin(token text, email text);

drop table if exists messages;
create table messages(sender text, message text, recipient text);









