
from flask import Flask, render_template, json, jsonify, Blueprint, session, request

from aijia.models import Order
from utils.function import login_required

order_blue = Blueprint('order', '__name__')


@order_blue.route('/orders/', methods=['GET'])
@login_required
def orders():
        return render_template('orders.html')


@order_blue.route('/my_orders/', methods=['GET'])
@login_required
def my_orders():
    orders = Order.query.filter(Order.user_id == session['user_id'])
    order_list = [order.to_dict() for order in orders]
    return jsonify({'code': 200, 'data': order_list})


@order_blue.route('/order/',methods=['PATCH'])
def order_status():
    order_id = request.form.get('order_id')
    status = request.form.get('status')
    comment = request.form.get('comment')

    order = Order.query.get(order_id)
    order.status = status
    if comment:
        order.comment = comment
    order.add_update()

    return jsonify({'code': 200,'msg': '请求成功'})







