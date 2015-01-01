#!/bin/sh
forever stop notifire
GIT_WORK_TREE=/home/ec2-user/notifire
export GIT_WORK_TREE
git checkout -f
cd /home/ec2-user/notifire/server
npm install
gulp build
forever start -a -o /home/ec2-user/logs/notifireout.log -e /home/ec2-user/logs/notifireerr.log -l /home/ec2-user/logs/notifire.log --uid "notifire" --sourceDir "/home/ec2-user/notifire/server" app.js