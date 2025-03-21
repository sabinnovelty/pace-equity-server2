#!/bin/bash

while getopts u:p: flag
do
    case "${flag}" in
        u) username=${OPTARG};;
        p) password=${OPTARG};;
    esac
done

func1(){
  /usr/bin/mongod --bind_ip_all --replSet dbrs
}

func2(){
  echo 'Running replicaset init22'
  sleep 5
  mongosh --eval "rs.initiate({_id:'dbrs', members: [{_id:0, host: 'mongodb-primary'}]})"
  sleep 5
  mongosh --host mongodb --eval "db.createUser({ user: \"$username\", pwd: \"$password\", roles: [ { role: \"root\", db: \"admin\" } ] });" admin
  sleep 10
}

func2 & func1