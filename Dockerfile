FROM node:12.3
EXPOSE 3001 9230

WORKDIR /home/app

COPY package.json /home/app/
COPY package-lock.json /home/app/

RUN npm install

COPY . /home/app

CMD npm start