# start from node 12 (last lts version at the moment)
FROM node:14-alpine
LABEL maintainer="cristiancontrera95@gmail.com"

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json .
RUN npm cache clean --force
RUN npm i

# add app
COPY build build

RUN npm install -g serve

# expose port that npm server use
EXPOSE 8080

# start in produccion mode
CMD ["serve", "-s", "build", "-l", "8080"]
