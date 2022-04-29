read -p 'Insert your GitLab Token: ' gitlabToken

git clone -b develop https://github.com/odemolliens/adash-data-collector.git adash-data-collector-example
cp config-collector.json adash-data-collector-example/config.json
cd adash-data-collector-example
git pull
yarn

sed -i '' "s/REDACTED/$gitlabToken/g" config.json
cd ..
git clone -b develop https://github.com/odemolliens/adash-rn-web.git adash-rn-web-example

mkdir adash-rn-web-example/data
sh update.sh
cp config-dashboard.json adash-rn-web-example/config.json
cd adash-rn-web-example
git pull
yarn && yarn dev