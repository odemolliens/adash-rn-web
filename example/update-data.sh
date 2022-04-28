cd adash-data-collector-example

DEBUG=1 npx ts-node adash-data-collector collect --config example/config.json
DEBUG=1 npx ts-node adash-data-collector notificator --config example/config.json

cd ..

mkdir adash-rn-web-example/data
cp -Rf adash-data-collector-example/data/* adash-rn-web-example/data