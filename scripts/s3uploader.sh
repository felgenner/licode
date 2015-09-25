#!/bin/bash

STREAM_DIR='/opt/licode/streams'


cd $STREAM_DIR
for filename in $(ls *.mkv); do
  if [[ $filename =~ ^(.*)\.mkv$ ]];
  then
    ffmpeg -i $filename -threads $(cat /proc/cpuinfo | grep processor | wc -l) -vcodec libvpx -acodec libvorbis ${BASH_REMATCH[1]}.webm
    rm $filename
    aws s3 cp ${BASH_REMATCH[1]}.webm s3://etutorium.com/streams/ --grants read=uri=http://acs.amazonaws.com/groups/global/AllUsers
    rm ${BASH_REMATCH[1]}.webm
  fi
done
