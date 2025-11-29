FROM node:22

WORKDIR /my-app

COPY package*.json ./

RUN npm install

COPY . .

# # Set environment variables
# ENV PORT=9000 
# # Expose port for access
# EXPOSE 9000

CMD ["npm", "start"]