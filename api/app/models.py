# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models
import secrets


class Configuaration(models.Model):
    key = models.CharField(max_length=255, blank=True, null=True)
    value = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'configuaration'


class Connection(models.Model):
    ids = models.TextField(unique=True, blank=True, null=True)  # This field type is a guess.
    id = models.IntegerField(unique=True, blank=True,primary_key=True)
    timestamp = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'connection'


class LoginUser(models.Model):
    #id = models.AutoField()
    login_key = models.CharField(max_length=255)
    login_id = models.IntegerField()
    timestamp = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'login_user'
    def generate_login_key():
        return secrets.token_urlsafe(32)


class Match(models.Model):
    #id = models.AutoField()
    matchid = models.IntegerField(blank=True, null=True)
    selfid = models.IntegerField(blank=True, null=True)
    ismatch = models.BooleanField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'match'


class Message(models.Model):
    #id = models.AutoField()
    sender_id = models.IntegerField(blank=True, null=True)
    reciever_id = models.IntegerField(blank=True, null=True)
    message = models.CharField(max_length=255, blank=True, null=True)
    timestamp = models.DateField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'message'


class Users(models.Model):
    name = models.CharField(max_length=255, blank=True, null=True)
    email = models.CharField(max_length=255, blank=True, null=True)
    password = models.CharField(max_length=255, blank=True, null=True)
    dob = models.CharField(max_length=255, blank=True, null=True)
    bio = models.CharField(max_length=255, blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    interests = models.TextField(blank=True, null=True)  # This field type is a guess.
    mobile = models.CharField(max_length=255, blank=True, null=True)
    #id = models.AutoField()
    gender = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'users'
