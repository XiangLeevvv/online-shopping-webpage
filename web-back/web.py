# coding＝utf-8
from flask import Flask, jsonify
from flask import request
from flask_cors import *
import json
import pymysql
from datetime import datetime

app = Flask(__name__)
CORS(app, resources=r'/*')


class myflask:
    def __init__(self):
        self.connection = pymysql.connect(
            host='cdb-mw8hntaa.bj.tencentcdb.com',
            port=10027,
            user='root',
            password='lx123456',
            db='web',
            charset='utf8'
        )
        self.cursor = self.connection.cursor()

    def test_conn(self):
        try:
            self.connection.ping()
        except:
            self.connection = pymysql.connect(
                host='cdb-mw8hntaa.bj.tencentcdb.com',
                port=10027,
                user='root',
                password='lx123456',
                db='web',
                charset='utf8'
            )
            self.cursor = self.connection.cursor()

    def user_info(self):
        response = {}
        data = request.get_data()
        dicts = json.loads(data)

        self.test_conn()
        self.cursor.execute("select * from USER where userId = '" + dicts['user_id'] + "'")
        result = self.cursor.fetchall()

        if len(result) == 0:
            now = datetime.now()
            time = now.strftime('%Y-%m-%d %H:%M:%S')
            sql = "insert into USER(userId, passWord, addTime) " \
                  "values('" + dicts['user_id'] + "', '" + dicts['password'] + "', '" + time + "')"
            self.test_conn()
            try:
                self.cursor.execute(sql)
                self.connection.commit()
                response['status'] = "success"
            except:
                self.connection.rollback()
                response['status'] = "fail"
        else:
            response['detail'] = "userId already exists"
        return json.dumps(response)

    def login(self):
        response = {}
        data = request.get_data()
        dicts = json.loads(data)

        self.test_conn()
        self.cursor.execute("select * from USER where userId = '" + dicts['user_id'] + "'")
        result = self.cursor.fetchall()

        if len(result) == 0:
            response['status'] = "fail"
            response['detail'] = "The userId doesn't exist"
        elif len(result) == 1:
            for row in result:
                password = row[1]
                if password == dicts['password']:
                    response['status'] = "success"
                else:
                    response['status'] = "fail"
                    response['detail'] = "The password is incorrect"
        else:
            response['status'] = "fail"
            response['detail'] = "error"
        return json.dumps(response)

    def cart_info(self):
        response = []
        data = request.get_data()
        dicts = json.loads(data)

        self.test_conn()
        self.cursor.execute("select * from CARTINFO where userId = '" + dicts['user_id'] + "'")
        result = self.cursor.fetchall()

        for row in result:
            product = {'itemId': str(row[1]), 'quantity': str(row[2]), 'itemName': str(row[4]),
                       'itemPrice': str(row[5]), 'itemPicture': str(row[6])}
            response.append(product)
        return jsonify(response)

    def putin_cart(self):
        response = {}
        data = request.get_data()
        dicts = json.loads(data)

        self.test_conn()
        self.cursor.execute("select * from CARTINFO where userId = '" + dicts['user_id'] + "'")
        result = self.cursor.fetchall()
        self.cursor.execute("select * from ITEM where itemName = '" + dicts['itemName'] + "'")
        item = self.cursor.fetchall()

        if len(item) != 1:
            return

        now = datetime.now()
        time = now.strftime('%Y-%m-%d %H:%M:%S')
        # 遍历用户购物车寻找是否有同种商品
        for row in result:
            # 购物车中有同样的产品update数量
            if row[1] == item[0][0]:
                sql = "update CART set quantity = quantity + 1, addTime = '" + time + "' " \
                                                                                      "where userId = '" + dicts[
                          'user_id'] + "' and itemId = '" + str(item[0][0]) + "'"
                self.test_conn()
                try:
                    self.cursor.execute(sql)
                    self.connection.commit()
                    response['status'] = 'success'
                except:
                    self.connection.rollback()
                    response['status'] = 'fail'
                return jsonify(response)

        # 没有同种商品insert该商品
        sql = "insert into CART(userId, itemId, quantity, addTime) " \
              "values('" + dicts['user_id'] + "', '" + str(item[0][0]) + "', '1', '" + time + "')"
        self.test_conn()
        try:
            self.cursor.execute(sql)
            self.connection.commit()
            response['status'] = 'success'
        except:
            self.connection.rollback()
            response['status'] = 'fail'
        return jsonify(response)

    def add_cart(self):
        response = {}
        data = request.get_data()
        dicts = json.loads(data)

        self.test_conn()
        # 获取用户购物车信息
        self.cursor.execute("select * from CARTINFO where userId = '" + dicts['user_id'] + "'")
        result = self.cursor.fetchall()
        # 获取商品信息
        self.cursor.execute("select * from ITEM where itemId = '" + dicts['itemId'] + "'")
        item = self.cursor.fetchall()

        # 商品编号唯一
        if len(item) != 1:
            return

        now = datetime.now()
        time = now.strftime('%Y-%m-%d %H:%M:%S')

        # 遍历用户购物车寻找是否有同种商品
        for row in result:
            # 购物车中有同样的产品update数量
            if row[1] == item[0][0]:
                sql = "update CART set quantity = quantity + 1, addTime = '" + time + "' " \
                                                                                      "where userId = '" + dicts[
                          'user_id'] + "' and itemId = '" + str(item[0][0]) + "'"
                self.test_conn()
                try:
                    self.cursor.execute(sql)
                    self.connection.commit()
                    response['status'] = 'success'
                except:
                    self.connection.rollback()
                    response['status'] = 'fail'
                return jsonify(response)

        # 没有同种商品insert该商品
        sql = "insert into CART(userId, itemId, quantity, addTime) " \
              "values('" + dicts['user_id'] + "', '" + str(item[0][0]) + "', '1', '" + time + "')"
        self.test_conn()
        try:
            self.cursor.execute(sql)
            self.connection.commit()
            response['status'] = 'success'
        except:
            self.connection.rollback()
            response['status'] = 'fail'
        return jsonify(response)

    def clear_cart(self):
        response = {}
        data = request.get_data()
        dicts = json.loads(data)

        sql = "delete from CART where userId = '" + dicts['user_id'] + "'"
        self.test_conn()
        try:
            self.cursor.execute(sql)
            self.connection.commit()
            response['status'] = 'success'
        except:
            self.connection.rollback()
            response['status'] = 'fail'
        return jsonify(response)

    def generate_order(self):
        response = {}
        data = request.get_data()
        dicts = json.loads(data)

        self.test_conn()
        # 获取用户购物车信息
        self.cursor.execute("select * from CART where userId = '" + dicts['user_id'] + "'")
        result = self.cursor.fetchall()

        # 获取最新时间
        now = datetime.now()
        time = now.strftime('%Y-%m-%d %H:%M:%S')

        # 生成订单
        for row in result:
            sql = "insert into ORDERS(userId, itemId, quantity, purchaseTime) " \
                  "values('" + str(row[0]) + "', '" + str(row[1]) + "', '" + str(row[2]) + "', '" + time + "')"
            self.test_conn()
            try:
                self.cursor.execute(sql)
                self.connection.commit()
                response['status'] = 'success'
            except:
                self.connection.rollback()
                response['status'] = 'fail'

        delete_sql = "delete from CART where userId = '" + dicts['user_id'] + "'"
        self.test_conn()
        try:
            self.cursor.execute(delete_sql)
            self.connection.commit()
            response['isDelete'] = 'True'
        except:
            self.connection.rollback()
            response['isDelete'] = 'False'
        return jsonify(response)

    def order_info(self):
        response = []
        data = request.get_data()
        dicts = json.loads(data)

        self.test_conn()
        self.cursor.execute("select * from ORDERSINFO where userId = '" + dicts['user_id'] + "'")
        result = self.cursor.fetchall()
        for row in result:
            product = {'itemId': str(row[1]), 'itemName': str(row[2]), 'itemPrice': str(row[3]),
                       'itemPicture': str(row[4]), 'quantity': str(row[5]), 'purchaseTime': str(row[6])}
            response.append(product)
        return jsonify(response)


@app.route('/register', methods=["POST"])
def register():
    obj = myflask()
    return obj.user_info()


@app.route('/login', methods=["POST"])
def login():
    obj = myflask()
    return obj.login()


@app.route('/cartInfo', methods=["POST"])
def cart_info():
    obj = myflask()
    return obj.cart_info()


@app.route('/putInCart', methods=["POST"])
def putin_cart():
    obj = myflask()
    return obj.putin_cart()


@app.route('/addCart', methods=["POST"])
def add_cart():
    obj = myflask()
    return obj.add_cart()


@app.route('/clearCart', methods=["POST"])
def clear_cart():
    obj = myflask()
    return obj.clear_cart()


@app.route('/generateOrder', methods=["POST"])
def generate_order():
    obj = myflask()
    return obj.generate_order()


@app.route('/orderInfo', methods=["POST"])
def order_info():
    obj = myflask()
    return obj.order_info()


if __name__ == '__main__':
    app.run()
