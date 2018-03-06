import sqlite3
from flask import g                        # g is an object

DATABASE = 'database.db'


def connect_db():
    g.db = sqlite3.connect(DATABASE)

def close_db():
    db = getattr(g, 'db', None)           # if these three does not have dB, then return None
    if db is not None:
        db.close()

def query_db(query, args=(), one=False):
    cur = g.db.execute(query, args)
    g.db.commit()
    rv = cur.fetchall()
    cur.close()
    return (rv[0] if rv else None) if one else rv

def add_user(firstname, familyname, email, password, gender, city, country):
    query_db("insert into users values(?, ?, ?, ?, ?, ?, ?)", [firstname, familyname, email, password, gender, city, country])

def check_valid_user(email, password):
    if query_db("select email from users where email=? and password=?", [email, password]):
        return True
    else:
        return False

def add_token_user(email, token):
    query_db("delete from users_loggedin where email=?", [email])       # can you do like this? remove "old" token
    query_db("insert into users_loggedin values(?, ?)", [token, email])

def remove_token_user(token):
    if check_token(token):
        query_db("delete from users_loggedin where token=?", [token])
        return True
    else:
        return False

def check_token(token):
    if query_db("select token from users_loggedin where token=?", [token]):
        return True
    else:
        return False

def get_email_by_token(token):
    email = query_db("select email from users_loggedin where token=?", [token], True)

    if email:
        return email[0]
    else:
        return False


def update_password(new_password, email):
    query_db("update users set password=? where email=?", [new_password, email])

def get_user_data(email):
    result = []
    data = query_db("select firstname, familyname, email, gender, city, country from users where email=?", [email])

    if data:
        for index in data:
            result.append({'firstname': index[0], "familyname": index[1], "email": index[2], "gender": index[3], "city": index[4], "country": index[5]})
        return result
    else:
        return False

def add_message(sender, message, recipient):
    query_db("insert into messages values(?, ?, ?)", [sender, message, recipient])

def get_user_messages(email):
    result = []

    data = query_db("select * from messages where recipient=?", [email])

    if data:
        for index in data:
            result.append({"sender": index[0], "message": index[1], "recipient": index[2]})
        return result
    else:
        return False

def get_number_of_users_online():
    return query_db("select count(*) from users_loggedin", one=True)

def get_number_of_users():
    return query_db("select count(*) from users", one=True)

def get_number_of_messages_sent(email):
    return query_db("select count(*) from messages where sender=?", [email], one=True)

def get_number_of_messages_received(email):
    return query_db("select count(*) from messages where recipient=?", [email], one=True)