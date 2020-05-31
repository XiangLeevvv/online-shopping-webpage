from flask import Flask, jsonify
from flask import request
from flask import redirect
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
    sql = "insert into USER(userId, passWord, addTime) " \
          "values('" + dict['user_id'] + "', '" + dict['password'] + "', '" + time + "')"
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

@app.route('/cartInfo', methods=["POST"])
def cartInfo():
  resList = []
  data = request.get_data()
  dict = json.loads(data)
  print(dict['user_id'])
  # 执行sql
  cursor.execute("select * from CARTINFO where userId = " + dict['user_id'])
  result = cursor.fetchall()

  for row in result:
    product = {}
    product['itemId'] = str(row[1])
    product['quantity'] = str(row[2])
    product['itemName'] = str(row[4])
    product['itemPrice'] = str(row[5])
    product['itemPicture'] = str(row[6])
    resList.append(product)
  return jsonify(resList)

@app.route('/putInCart', methods=["POST"])
def putinCart():
  response = {}
  data = request.get_data()
  dict = json.loads(data)
  print(dict['user_id'])
  print(dict['itemName'])

  #获取用户购物车信息
  cursor.execute("select * from CARTINFO where userId = " + dict['user_id'])
  result = cursor.fetchall()
  #获取商品信息
  cursor.execute("select * from ITEM where itemName = '" + dict['itemName'] + "'")
  item = cursor.fetchall()

  #商品编号唯一只可能是一个
  if len(item) != 1:
    print("产品获取出错！")
    return

  now = datetime.now()
  time = now.strftime('%Y-%m-%d %H:%M:%S')

  #遍历用户购物车寻找是否有同种商品
  for row in result:
    print(type(row[1]), type(item[0][0]))
    #购物车中有同样的产品update数量
    if row[1] == item[0][0]:
      sql = "update CART set quantity = quantity + 1, addTime = '" + time + "' where " \
            "userId = '" + dict['user_id'] + "' and itemId = '" + str(item[0][0]) + "'"
      try:
        cursor.execute(sql)
        db.commit()
        response['status'] = 'success'
      except:
        db.rollback()
        response['status'] = 'fail'
      return jsonify(response)

  #没有同种商品insert该商品
  sql = "insert into CART(userId, itemId, quantity, addTime) " \
        "values('" + dict['user_id'] + "', '" + str(item[0][0]) + "', '1', '" + time + "')"
  try:
    cursor.execute(sql)
    db.commit()
    response['status'] = 'success'
  except:
    db.rollback()
    response['status'] = 'fail'
  return jsonify(response)

@app.route('/addCart', methods=["POST"])
def addCart():
  response = {}
  data = request.get_data()
  dict = json.loads(data)
  print(dict['user_id'])
  print(dict['itemId'])

  #获取用户购物车信息
  cursor.execute("select * from CARTINFO where userId = " + dict['user_id'])
  result = cursor.fetchall()
  #获取商品信息
  cursor.execute("select * from ITEM where itemId = '" + dict['itemId'] + "'")
  item = cursor.fetchall()

  #商品编号唯一只可能是一个
  if len(item) != 1:
    print("产品获取出错！")
    return

  now = datetime.now()
  time = now.strftime('%Y-%m-%d %H:%M:%S')

  #遍历用户购物车寻找是否有同种商品
  for row in result:
    print(type(row[1]), type(item[0][0]))
    #购物车中有同样的产品update数量
    if row[1] == item[0][0]:
      sql = "update CART set quantity = quantity + 1, addTime = '" + time + "' where " \
            "userId = '" + dict['user_id'] + "' and itemId = '" + str(item[0][0]) + "'"
      try:
        cursor.execute(sql)
        db.commit()
        response['status'] = 'success'
      except:
        db.rollback()
        response['status'] = 'fail'
      return jsonify(response)

  #没有同种商品insert该商品
  sql = "insert into CART(userId, itemId, quantity, addTime) " \
        "values('" + dict['user_id'] + "', '" + str(item[0][0]) + "', '1', '" + time + "')"
  try:
    cursor.execute(sql)
    db.commit()
    response['status'] = 'success'
  except:
    db.rollback()
    response['status'] = 'fail'
  return jsonify(response)

@app.route('/clearCart', methods=["POST"])
def clearCart():
  response = {}
  data = request.get_data()
  dict = json.loads(data)
  print(dict['user_id'])

  Dsql = "delete from CART where userId = " + dict['user_id']
  try:
    cursor.execute(Dsql)
    db.commit()
    response['status'] = 'success'
  except:
    db.rollback()
    response['status'] = 'fail'
  return jsonify(response)

@app.route('/generateOrder', methods=["POST"])
def generateOrder():
  response = {}
  data = request.get_data()
  dict = json.loads(data)

  #获取用户购物车信息
  cursor.execute("select * from CART where userId = " + dict['user_id'])
  result = cursor.fetchall()

  # 获取最新时间
  now = datetime.now()
  time = now.strftime('%Y-%m-%d %H:%M:%S')

  #生成订单
  for row in result:
    print(row[0], row[1], row[2], time)
    sql = "insert into ORDERS(userId, itemId, quantity, purchaseTime) " \
          "values('" + str(row[0]) + "', '" + str(row[1]) + "', '" + str(row[2]) + "', '" + time + "')"
    try:
      cursor.execute(sql)
      db.commit()
      response['status'] = 'success'
    except:
      db.rollback()
      response['status'] = 'fail'

  Dsql = "delete from CART where userId = " + dict['user_id']
  try:
      cursor.execute(Dsql)
      db.commit()
  except:
      db.rollback()
  return jsonify(response)

@app.route('/orderInfo', methods=["POST"])
def orderInfo():
  resList = []
  data = request.get_data()
  dict = json.loads(data)
  print(dict['user_id'])
  # 执行sql
  cursor.execute("select * from ORDERSINFO where userId = " + dict['user_id'])
  result = cursor.fetchall()
  for row in result:
    product = {}
    product['itemId'] = str(row[1])
    product['itemName'] = str(row[2])
    product['itemPrice'] = str(row[3])
    product['itemPicture'] = str(row[4])
    product['quantity'] = str(row[5])
    product['purchaseTime'] = str(row[6])
    resList.append(product)
  print(resList)
  return jsonify(resList)

if __name__ == '__main__':
  app.run(debug=True)
