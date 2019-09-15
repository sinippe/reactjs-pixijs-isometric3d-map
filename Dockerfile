FROM node:12-alpine

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY . .

ENV PATH /usr/src/app/node_modules/.bin:$PATH
ENV REACT_APP_API_HOST=$API_HOST
ENV REACT_APP_API_PORT=$API_PORT

# install and cache app dependencies
COPY package.json /usr/src/app/package.json
RUN npm install --verbose --ignore-scripts
RUN npm install --verbose --ignore-scripts react-scripts@3.0.1 -g

EXPOSE 8080

# start app
CMD ["npm", "start"]