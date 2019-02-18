import os
import random
import re

from flask import Blueprint, render_template, jsonify, session, request, json

from aijia.models import User
from utils.function import login_required

user_blue = Blueprint('user', '__name__')


@user_blue.route('/register/', methods=['GET'])
def register():
    return render_template('register.html')


@user_blue.route('/register/', methods=['POST'])
def my_register():
    # 获取参数
    mobile = request.form.get('mobile')
    imagecode = request.form.get('imagecode')
    passwd = request.form.get('passwd')
    passwd2 = request.form.get('passwd2')
    # 1. 验证参数是否都填写了
    if not all([mobile, imagecode, passwd, passwd2]):
        return jsonify({'code': 1001, 'msg': '请填写完整的参数'})
    # 2.验证手机号正确
    if not re.match('^1[3456789]\d{9}', mobile):
        return jsonify({'code': 1002, 'msg': '手机号不正确'})
    # 3.验证图片验证码
    if session['img_code'] != imagecode:
        return jsonify({'code': 1003, 'msg': '验证码不正确'})
    # 4.密码和确认密码是否一致
    if passwd != passwd2:
        return jsonify({'code': 1004, 'msg': '密码不一致'})
    # 验证手机号是否被注册
    user = User.query.filter_by(phone=mobile).first()
    if user:
        return jsonify({'code': 1005, 'msg': '手机号已被注册，请重新注册'})
    #创建注册信息
    user = User()
    user.phone = mobile
    user.name = mobile
    user.password = passwd
    user.add_update()
    return jsonify({'code': 200, 'msg': '请求成功'})


@user_blue.route('/code/', methods=['GET'])
def get_code():
    # 获取验证码
    # 方式1：后端生成图片，并返回验证码图片的地址（不推荐）
    # 方式2：后端只生成随机参数，返回给页面，在页面中再生成图片（前端做）
    s = '1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPLKJHGFDSAZXCVBNM'
    code = ''
    for i in range(4):
        code += random.choice(s)
    session['img_code'] = code
    return jsonify({'code': 200, 'msg': '请求成功', 'data': code})


@user_blue.route('/login/', methods=['GET'])
def login():
    return render_template('login.html')


@user_blue.route('/my_login/', methods=['GET'])
def my_login():
    # 实现登录
    # 获取参数
    phone = request.args.get('phone')
    pwd = request.args.get('pwd')

# 1.验证参数是否全部填写完
    if not all([phone, pwd]):
        return jsonify({'code': 1006, 'msg': '请填写完整的参数'})
# 2.获取手机号对应的用户信息
    user = User.query.filter(User.phone == phone).first()
    if not user:
        return jsonify({'code': 1007, 'msg': '该账号没注册，请去注册'})

# 3.验证密码是否正确
    if not user.check_pwd(pwd):
        return jsonify({'code': 1008, 'msg': '密码不正确'})
# 4.登录标识设置
    session['user_id'] = user.id
    return jsonify({'code': 200, 'msg': '请求成功'})


@user_blue.route('/my/', methods=['GET', 'POST'])
@login_required
def my():
    return render_template('my.html')


@user_blue.route('/user_info/', methods=['GET'])
@login_required
def user_info():
    # 获取用户基本信息
    user_id = session['user_id']
    user = User.query.get(user_id)

    return jsonify({'code': 200, 'msg': '请求成功', 'data': user.to_basic_dict()})


# 修改图片，用户名
@user_blue.route('/user_profile/', methods=['GET', 'PATCH'])
@login_required
def user_profile():
    if request.method == 'GET':
        return render_template('profile.html')
    if request.method == 'PATCH':
        # 获取用户名信息
        name = request.form.get('name')
        avatar = request.files.get('avatar')
        # 修改用户的avatar字段
        user = User.query.get(session['user_id'])
        if avatar:
            # 验证图片
            if not re.match(r'image/*', avatar.mimetype):
                return jsonify({'code': 1010, 'msg': '图片验证错误'})
            BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            # 得到upload的路径
            upload_dir = os.path.join(os.path.join(BASE_DIR, 'static'), 'upload')
            # 图片保存
            avatar.save(os.path.join(upload_dir, avatar.filename))

            avatar_addr = os.path.join('upload', avatar.filename)
            user.avatar = avatar_addr
            try:
                user.add_update()
                return jsonify({'code': 200, 'msg': '请求成功', 'data': avatar_addr})
            except:
                return None

        if name:
            user.name = name
            try:
                user.add_update()
                return jsonify({'code': 200, 'msg': '请求成功'})
            except:
                return jsonify({'code': 1100, 'msg': '请求失败'})


# 实名认证
@user_blue.route('/auth/', methods=['GET', 'POST'])
@login_required
def auth():
    if request.method == 'GET':
        return render_template('auth.html')
    if request.method == 'POST':
        id_name = request.form.get('real_name')
        id_card = request.form.get('id_card')
        # 1.验证参数是否都填写完了
        if not all([id_name, id_card]):
            return jsonify({'code': 1011, 'msg': '请填写参数'})
        # 2.验证身份证是否符合
        if not re.match(r'^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))'
                        r'(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$', id_card):
            return jsonify({'code': 1012, 'msg': '省份证填写错误'})
        # 3.验证身份证是否已经实名注册
        user = User.query.filter_by(id_card=id_card).first()
        if user:
            return jsonify({'code': 1012, 'msg': '省份证已认证'})
        # 创建实名认证信息
        user = User.query.get(session['user_id'])
        user.id_name = id_name
        user.id_card = id_card
        user.add_update()
        return jsonify({'code': 200, 'msg': '请求成功'})























