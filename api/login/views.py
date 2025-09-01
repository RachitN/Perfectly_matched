from django.shortcuts import render
from app.models import Users,LoginUser, Configuaration, Connection
from django.contrib.auth import authenticate
from django.http import JsonResponse
from django.utils import timezone
import logging
import json
from rest_framework.decorators import api_view
from datetime import datetime
from django.db.models.functions import Random

logger = logging.getLogger(__name__)

def login_view(request):
    if(request.method == 'POST'):
        try:
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')
            user = Users.objects.filter(email=email).first()
            if(user):
                if user.password == password:
                    login_key = LoginUser.generate_login_key()
                    LoginUser.objects.create(login_key =  login_key, login_id = user.id, timestamp = timezone.now())
                    # logger.error(f'refresh', login_key)
                    checkRefresh(login_key)
                    return JsonResponse({"message": "Login Successful","token": login_key}, status = 200)
                else:
                    return JsonResponse({ "message": "Wrong User Name or Password", "token": False }, status = 401)
            else:
                return JsonResponse({ "message": "Wrong User Name or Password", "token": False }, status = 401)
        except Exception as e:
            return JsonResponse({"message": str(e), "status": "error"}, status=500)
        
def checkRefresh(token):
    try:
        # data = json.loads(request.body)
        # token = data.get('token')
        token = token
        login_id = LoginUser.objects.filter(login_key= token).first().login_id
        refreshTime = Configuaration.objects.filter(key = 'default refresh time').first().value
        refreshTime = int(refreshTime) * 86400000 
        isRefresh = True
        timeStamp = Connection.objects.filter(id = login_id).first()
        if(timeStamp):
            timeStamp = timeStamp.timestamp
            isRefresh = (int(datetime.utcnow().timestamp() * 1000) - int(timeStamp.timestamp() * 1000)) > refreshTime
        collect_users(isRefresh, login_id)
    except Exception as e:
        return JsonResponse({"message": str(e), "status": "error"}, status=500)
    
def collect_users(isRefresh, login_id):
    if(isRefresh):
        connection = Connection.objects.filter(id=login_id)
        if(connection):
            connection.delete()
        user_list = getRecords(login_id)
        Connection.objects.create(id=login_id, ids=user_list, timestamp=timezone.now())

def getRecords(login_id):
    gender = Users.objects.filter(id = login_id).first().gender
    users = Users.objects.exclude(id=login_id, gender=gender).order_by(Random())[:5]
    user_list = []
    for user in users:
        user_list.append(user.id)
    return user_list
            


# Create your views here.
