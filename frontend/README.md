# Cloud Search WebApp

- Author: **Cristian Contrera** ***<cristiancontrera95@gmail.com>***

## Get started

### Set Azure search 

Edit *src/config.js* to complete your **url-service**, **api-key**, and **api-version**.

----
In the project directory, run:

#### `npm i`
*Install all needed node modules from package.json dependencies* 

#### `npm start`

*Runs the app in the development mode.*<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

To serve this app on production mode use:
``` bash
yarn build
npm install -g serve
serve -s build -l 3000
```

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.


### Deploy to Azure
You'll need an acr, app service in azure cloud and az-cli installed

Complete variables in **deploy.sh** script and run

#### `./deploy.sh`
*This script build a docker image with build folder, push the image to azure container registry and set docker port in an app service*

 

