# Product-Management-System
 The project contains various Apis which will help in creating and managing product items,put them in categories and display them according to various filters.

 - The APIs under the tag **Product**, has basic operations like creating,updating,deleting and getting the data based on the id, upload image data for the product, etc.

 Since there are two ways in which we can take input- form data and json, I have made two endpoints for updating data, one does it via json and the other via Form data.

- The APIs under the tag **Find By** can be thought of as the 'filters', these options provide different conditions that has to be taken care of while sending back the response.

- The APIs under the tag **Category** are similar to the Product management Apis and help to do basic operations regarding Categories.

External Libraries used are:
- _Cors_: To interface the swagger editor and the node app
- _Joi_ : To validate the data
- _Mutlr_ : To upload the files 
All of these libraries can be installed by running the command 
```npm install```



