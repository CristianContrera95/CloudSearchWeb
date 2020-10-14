# VARIABLES
AZ_EMAIL='ccontrera@piconsulting.com.ar'
AZ_PASSWORD='Chiqui1995'
AZ_SUBSCRIPTION='2e1749dd-db7f-4794-a027-8edfffc9f94f'
AZ_RG='az-search-rg'
AZ_APP_SERVICE_NAME='azsearrch-pidata'
AZ_APP_SERVICE_PORT='8080'

DOCKER_IMAGE_NAME='azsearchjuba'
DOCKER_IMAGE_TAG='v1'

ACR_URL='azsearchpidata.azurecr.io'
ACR_USERNAME='azsearchpidata'
ACR_PASSWORD='z9Sod2DIgEs8/ouxy6hY+1uSt6lQp7Dm'


echo "Build docker image..."
yarn build
docker build -t $DOCKER_IMAGE_NAME:$DOCKER_IMAGE_TAG .
docker tag $DOCKER_IMAGE_NAME:$DOCKER_IMAGE_TAG $ACR_URL/$DOCKER_IMAGE_NAME:$DOCKER_IMAGE_TAG

printf "\n\nLogin ACR and push..\n\n"
docker login -u $ACR_USERNAME $ACR_URL -p $ACR_PASSWORD
docker push $ACR_URL/$DOCKER_IMAGE_NAME:$DOCKER_IMAGE_TAG

printf "\n\nLogin Azure account\n\n"
az login -u AZ_EMAIL -p $AZ_PASSWORD
az account  set --subscription $AZ_SUBSCRIPTION
az webapp config appsettings set --resource-group $AZ_RG --name $AZ_APP_SERVICE_NAME --settings WEBSITES_PORT=$AZ_APP_SERVICE_PORT

printf "\n\nReady.\n\n"
