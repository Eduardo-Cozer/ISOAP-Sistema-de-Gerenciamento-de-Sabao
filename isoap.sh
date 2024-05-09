cd /home/duka/Área de Trabalho/PES I/isoap

npm start &

sleep 1

xdg-open http://localhost:8080 &

while :
do
    sleep 5
    if pgrep -x "brave-browser" > /dev/null
    then
        continue
    else
        pkill -f "node"
        exit
    fi
done
