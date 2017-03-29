# TypeScript-Express
This is just an example on how to use TypeScript for an simple Express app with passport


## Instructions
1. First run install npm packages

    `npm install`
2. Create a new file named `.startWithSecrets.ts` in the project root folder

    Content have to be like this (remember to replace the mongo URL):
    
    ```javascript
    process.env.MONGO_URL = "mongodb://localhost/typescript-db";
    
    require("./src/startup");
    ```
3. Now just run the nodemon script with start command
    
    `npm start`
