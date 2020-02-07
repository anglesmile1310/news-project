FROM node:12.13
ENV DB_USER=''
ENV DB='categories'
ENV DB_PASS=''
ENV DB_REPLS=''
ENV DB_SERVERS='192.168.1.13'
# Create app directory
WORKDIR .
# Bundle app src
COPY . .
# Install app dependencies
RUN npm install
EXPOSE 3002
CMD [ "npm", "start" ]