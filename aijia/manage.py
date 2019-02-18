
from flask import Flask
from flask_script import Manager

from aijia.home_views import home_blue
from aijia.models import db
from aijia.order_views import order_blue
from aijia.user_views import user_blue

app = Flask(__name__)

app.register_blueprint(blueprint=user_blue, url_prefix='/user')

app.register_blueprint(blueprint=home_blue, url_prefix='/home')

app.register_blueprint(blueprint=order_blue, url_prefix='/order')


app.secret_key = '123dmsklmf'
# 数据库配置
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:123456@127.0.0.1:3306/flask08'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

manage = Manager(app)
if __name__ == '__main__':
    manage.run()








