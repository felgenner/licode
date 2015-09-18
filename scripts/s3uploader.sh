#!/bin/bash

STREAM_DIR='/opt/licode/streams'


cd $STREAM_DIR
for filename in $(ls *.mkv); do
  if [[ $filename =~ ^(.*)\.mkv$ ]];
  then
    ffmpeg -vcodec libvpx -i $filename ${BASH_REMATCH[1]}.webm
    rm $filename
    aws s3 cp ${BASH_REMATCH[1]}.webm s3://etutorium.com/ --grants read=uri=http://acs.amazonaws.com/groups/global/AllUsers
  fi
done
