# Web Communications Project

### Set up
- clone repo
-     git clone https://github.com/cmcrae1989/WebCommunicationsProject.git
- install front end packages
    - navigate to client folder and run
-     npm install react-router-dom bootstrap axios react-bootstrap react-icons
- install back end packages
    - navigate to server folder and run
-     npm install express mysql2 cors dotenv jsonwebtoken bcryptjs

#### * MySQL has to be downloaded locally! Homebrew for mac and mysql installer for windows *

### Run Project
- open terminal/bash and run the following commands
-     mysql.server start
-     mysql -u cmcrae -p
- enter password
-     P@ww0rd
- run command to select DB
-     USE ecommerce
- from here you can run mysql queries and type "EXIT" to stop
  
#### *DONT FORGET SEMICOLONS!!*

#### Running the backend

- starting in the root directory
-     cd server
- run command
-     npm start

#### Running the frontend

- starting in the root directory
-     cd client
- run command
-     npm start
