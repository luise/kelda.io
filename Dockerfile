FROM node:9

ENV HUGO_VERSION=0.37

WORKDIR /usr/src/app

RUN wget https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_${HUGO_VERSION}_Linux-64bit.tar.gz
RUN tar -xf hugo_${HUGO_VERSION}_Linux-64bit.tar.gz -C /tmp \
    && mkdir -p /usr/local/sbin \
    && mv /tmp/hugo /usr/local/sbin/hugo

COPY . .

# Only necessary for local testing.
EXPOSE 80

RUN npm install
CMD npm start
