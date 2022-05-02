cd adash-data-collector-example

DEBUG=1 npx ts-node adash-data-collector collect
DEBUG=1 npx ts-node adash-data-collector notificator

cd ..

cp -Rf adash-data-collector-example/data/* adash-rn-web-example/data