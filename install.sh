#!/usr/bin/env bash

cd /opt/licode
git checkout async_events
scripts/installUbuntuDepsUnattended.sh --cleanup
scripts/installErizo.sh
scripts/installNuve.sh
scripts/installBasicExample.sh
npm install -g forever
