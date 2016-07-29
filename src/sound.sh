#!/bin/bash
FILES_WF=$(cd $1;ls)
SOURCE_DIR=$2
for FILE in $FILES_WF
do
    sox $1/$FILE $2/$FILE silence 1 0.1 0.1% reverse silence 1 0.1 0.1% reverse
done
