!#/bin/bash

echo `whoami`
timestamp() {
  echo `date`
}
echo $(timestamp)
sleep 1
echo $(timestamp)
sudo -i -u brian.mccall bash << EOF
echo `whoami`
timestamp() {
  echo `date`
}
echo $(timestamp)
sleep 2
echo `date`
EOF