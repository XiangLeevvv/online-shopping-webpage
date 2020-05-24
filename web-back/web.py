from flask import Flask
from flask import request
from flask import redirect
from flask import jsonify
from flask_cors import *
import json
import pymysql
from datetime import datetime

app = Flask(__name__)
CORS(app, resources=r'/*')

#连接数据库
db = pymysql.connect(
  host='cdb-mw8hntaa.bj.tencentcdb.com',
  port=10027,
  user='root',
  password='lx123456',
  db='web',
  charset='utf8'
)
#新建游标
cursor = db.cursor()


@app.route('/register', methods=["POST"])
def userInfo():
  response = {}
  data = request.get_data()
  dict = json.loads(data)
  print(dict['user_id'])
  # 执行sql
  cursor.execute("select * from USER where userId = " + dict['user_id'])
  result = cursor.fetchall()
  if len(result) == 0:
    now = datetime.now()
    time = now.strftime('%Y-%m-%d %H:%M:%S')
    print(time)
    sql = "insert into USER(userId, passWord, addTime) values('" + dict['user_id'] + "', '" + dict['password'] + "', '" + time + "')"
    try:
      cursor.execute(sql)
      db.commit()
      response['status'] = "success"
    except:
      db.rollback()
      response['status'] = "fail"
  else:
    response['detail'] = "userId already exists"
  return json.dumps(response)

@app.route('/login', methods=["POST"])
def login():
  response = {}
  data = request.get_data()
  dict = json.loads(data)
  print(dict['user_id'])
  # 执行sql
  cursor.execute("select * from USER where userId = " + dict['user_id'])
  result = cursor.fetchall()
  if len(result) == 0:
    response['status'] = "fail"
    response['detail'] = "The userId doesn't exist"
  elif len(result) == 1:
    for row in result:
      password = row[1]
    if password == dict['password']:
      response['status'] = "success"
  return json.dumps(response)

if __name__ == '__main__':
  while(True):
    app.run(debug=True)
