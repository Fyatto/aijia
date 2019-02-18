import os

from flask import Blueprint, render_template, jsonify, session, request, json

from aijia.models import User, House, HouseImage, Area, Facility, Order
from utils.function import login_required

home_blue = Blueprint('home', '__name__')


# 我的房源
@home_blue.route('/myhouse/', methods=['GET'])
@login_required
def myhouse():
        return render_template('myhouse.html')


@home_blue.route('/myhouse_info/', methods=['GET'])
def myhouse_info():
        # 验证是否进行了实名认证
        user = User.query.get(session['user_id'])
        id_card = user.id_card
        if id_card:
            return jsonify({'code': 200, 'msg': '请求成功'})
        else:
            return jsonify({'code': 1111, 'msg': '未实名认证'})


# select add update
# get post patch  delete
@home_blue.route('/newhouse/', methods=['GET', 'PATCH'])
@login_required
def newhouse():
    if request.method == 'GET':
        return render_template('newhouse.html')
    if request.method == 'PATCH':
        house = House()

        # 1.获取参数
        house.user_id = session['user_id']
        house.title = request.form.get('title')
        house.area_id = request.form.get('area_id')
        house.price = request.form.get('price')
        house.address = request.form.get('address')
        house.room_count = request.form.get('room_count')
        house.acreage = request.form.get('acreage')
        house.unit = request.form.get('unit')
        house.capacity = request.form.get('capacity')
        house.beds = request.form.get('beds')
        house.deposit = request.form.get('deposit')
        house.min_days = request.form.get('min_days')
        house.max_days = request.form.get('max_days')
        facilitys = request.form.getlist('facility')
        for facility_id in facilitys:
            facility = Facility.query.get(facility_id)
            # 多对多关联
            house.facilities.append(facility)
        house.add_update()
        return jsonify({'code': 200, 'msg': '请求成功', 'house_id': house.id})


@home_blue.route('/area_facility/', methods=['GET'])
def area_facility():
    areas = Area.query.all()
    facilitys = Facility.query.all()

    area_json = [area.to_dict() for area in areas]
    facilitys_json = [facility.to_dict() for facility in facilitys]
    return jsonify({'code': 200, 'msg': '请求成功', 'areas': area_json, 'facilitys': facilitys_json})


@home_blue.route('/newhouse_img/', methods=['PATCH'])
@login_required
def newhouse_img():

        # 获取图像信息
        # house_id = request.form.get('house_id')
        images = request.files.get('house_image')
        house = House.query.get(session['user_id'])
        if images:
            BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            # 得到upload的路径
            upload_dir = os.path.join(os.path.join(BASE_DIR, 'static'), 'upload')
            # 图片保存
            images.save(os.path.join(upload_dir, images.filename))
            images_addr = os.path.join('upload', images.filename)
            houseimage = HouseImage()
            houseimage.house_id = house.id
            houseimage.url = images_addr
            houseimage.add_update()
            # 创建房屋首图
            # house = House.query.get(house_id)
            if not house.index_image_url:
                house.index_image_url = images_addr
                house.add_update()
            house.add_update()

            return jsonify({'code': 200, 'msg': '请求成功', 'data': images_addr})


@home_blue.route('/newhouse_info/', methods=['GET'])
@login_required
def newhouse_info():
    # 获取在myhouse渲染的数据
    houses = House.query.all()
    # houses = House.query.filter_by(user_id=session['user_id'])
    house1=[house.to_dict()for house in houses]
    return jsonify({'code': 200, 'msg': '请求成功', 'data': house1})


@home_blue.route('/detail/', methods=['GET'])
@login_required
def detail():
    # 1.获取房屋的id
    # 2,房屋id和获取的id相同时，渲染图片
    # id = request.args.get('id')
    # id = request.args.get('id')
    # house = House.query.filter_by(id=id)
    # houseimage= HouseImage.query.filter_by(house_id=id)
    # houseimage_to_dict =[houseimg.to_dict() for houseimg in houseimage ]
    # return jsonify({'code': 200, 'msg': '请求成功', 'data': house})
    return render_template('detail.html')


@home_blue.route('/detail/<int:id>/', methods=['GET'])
@login_required
def detail1(id):
    # location.search ?id=4 decodeQuery === args {id；'id'}

    house = House.query.filter_by(id=id) # [<house>,<house>]
    return jsonify({'code': 200, 'msg': '请求成功', 'data': house.first().to_dict()})

# /myhouse_image/ ?id=1
# /home/detail/           ?id=1
# @home_blue.route('/myhouse_image/<int:id>/', methods=['GET'])
# @login_required
# def myhouse_image(id):
#     # houses = House.query.filter_by(user_id=session['user_id'])
#     id = request.args.get('id')
#     house = House.query.filter_by(id=id)
#     # house2 = [house.to_full_dict()for house in houses]
#     return jsonify({'code': 200, 'msg': '请求成功', 'data': house})


# 即刻预订
@home_blue.route('/booking/',methods=['GET'])
@login_required
def booking():
    return render_template('booking.html')


@home_blue.route('/booking/<int:id>/', methods=['GET'])
@login_required
def booking1(id):
    house = House.query.filter_by(id=id)
    return jsonify({'code': 200, 'msg': '请求成功', 'data': house.first().to_dict()})


@home_blue.route('/booking_info/', methods=['POST'])
@login_required
def booking_info():

    begin_date = request.form.get['start-date']
    end_date = request.form.get['end_date']
    # 获取参数
    order = Order()
    # order.user_id = session['user_id']
    # order.begin_date = request.form.get['begin_date']
    # order.end_date = request.form.get['end_date']
    # order.days = request.form.get['days']
    # order.house_price = request.form.get['house_price']
    # order.amount = request.form.get['amount']
    # order.status = request.form.get['status']
    order.add_update()
    return jsonify({'code': 200, 'msg': '请求成功', 'house_id': order.id})







