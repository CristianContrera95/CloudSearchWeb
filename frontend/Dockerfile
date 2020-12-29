# start from node 12 (last lts version at the moment)
FROM node:14-alpine
LABEL maintainer="cristiancontrera95@gmail.com"

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json .
RUN npm install -g npm
RUN npm cache clean --force
RUN npm i

RUN npm install -g serve

# add app
COPY build build

# expose port that npm server use
EXPOSE 8080

# start in produccion mode
CMD ["serve", "-s", "build", "-l", "8080"]
