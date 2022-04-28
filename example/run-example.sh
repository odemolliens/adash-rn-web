read -p 'Insert your GitLab Token: ' gitlabToken

git clone -b develop https://github.com/odemolliens/adash-data-collector.git adash-data-collector-example
cd adash-data-collector-example
yarn

sed -i '' "s/REDACTED/$gitlabToken/g" example/config.json

cd ..
git clone -b develop https://github.com/odemolliens/adash-rn-web.git adash-rn-web-example

sh update-data.sh
cp config.json adash-rn-web-example/
cd adash-rn-web-example
yarn && yarn dev