#!/bin/bash
FILES_WF=$(cd $1;ls)
SOURCE_DIR=$2
for FILE in $FILES_WF
do
    cp "$2/$FILE" "$1/$FILE"
done
