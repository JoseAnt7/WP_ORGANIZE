from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin

db = SQLAlchemy()

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)

    def __repr__(self):
        return f'<User {self.username}>'
    
class Wordpress_sites(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    wp_url = db.Column(db.String, unique=True, nullable=False)
    username = db.Column(db.String, unique=True, nullable=False)
    app_password = db.Column(db.String, unique=True, nullable=False)
    api_endpoint = db.Column(db.String, unique=True, nullable=False)
    