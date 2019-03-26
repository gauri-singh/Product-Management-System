const express= require('express')
const joi=require("joi")
var app=express();
var port=3000;
const cors = require('cors');
// used for uploading the file to a folder
const multer = require('multer');
const upload = multer({
  dest: './uploads' // this saves your file into a directory called "uploads"
});
// for swagger interfacing
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

var product={
    '1':{
        'name':'Milk',
        'price':20,
        'category':'1',
        'state':'live',
        'mode':'offline',
        'size':'small',
        'colour':'white',
        'brand':'Amul',
        'metadata':"A milk product"
    },
    '2':{
        'name':'Phone',
        'price':10000,
        'category':'2',
        'state':'live',
        'mode':'online',
        'size':'',
        'colour':'grey',
        'brand':'OnePlus',
        'metadata':"A smart phone"
    },
    '3':{
        'name':'jeans',
        'price':1000,
        'category':'3',
        'state':'live',
        'mode':'both',
        'size':'medium',
        'colour':'black',
        'brand':'levis',
        'metadata':"A clothing item"
    },
    '4':{
        'name':'Jam',
        'price':100,
        'category':'1',
        'state':'live',
        'mode':'offline',
        'size':'small',
        'colour':'',
        'brand':'Kisaan',
        'metadata':"Fruit Jam"
    }
}
var categories={
    '1':{
        'name':'Grocery',
        'tax':0.10
    },
    '2':{
        'name':'Electronics',
        'tax':0.20
    },
    '3':{
        'name':'Clothing',
        'tax':0.15
    }
}
 var files={
    "d9ba47bc1fe6fadd9997e0a43a5beed0":"1",
    "9601528729c9723a61c2865e1d8ab640":"2"
 }

// for adding a single product
app.post('/product',(req,res)=>{
    const schema = {
        id: joi.number().required(),
        name: joi.string().min(4).required(),
        price: joi.number().required(),
        category: joi.number().required(),
        state: joi.string().required(),
        mode: joi.string().required(),
        size: joi.string(),
        colour: joi.string(),
        brand: joi.string(),
        metadata: joi.string()
    }
    const result = joi.validate(req.body, schema)
    if(result.error) {
        res.status(400).send(result.error.details[0].message);
    } else {
        if (result.value.id in product) {
            res.status(403).send({"message": "Product Id already in use"});
        }
        else if(!(result.value.category in categories)){
            res.status(403).send({"message": " This Category Does not exist"});
        }
        else{
            var dict={}
            dict.name=result.value.name;
            dict.price=result.value.price;
            dict.category=result.value.category;
            dict.state=result.value.state;
            dict.mode=result.value.mode;
            dict.size=result.value.size;
            dict.colour=result.value.colour;
            dict.brand=result.value.brand;
            dict.photoUrls=result.value.metadata;
            // adding tax in the price
            var tax=categories[result.value.category].tax;
            var total =result.value.price+(result.value.price)*tax;
            dict.total=total;
            product[result.value.id]=dict;
            res.status(200).send({
                "message": "The product was successfully added", dict
                })
        }        
    }
});

// for updating a product via json
app.put('/product',(req,res)=>{
    const schema = {
        id: joi.number().required(),
        name: joi.string().min(4),
        price: joi.number(),
        category: joi.number(),
        state: joi.string(),
        mode: joi.string(),
        size: joi.string(),
        colour: joi.string(),
        brand: joi.string(),
        metadata: joi.string()
    }
    const result = joi.validate(req.body, schema)
    if(result.error) {
        res.status(400).send(result.error.details[0].message);
    } else {
        if (!(result.value.id in product)) {
            res.status(400).send({"message": "Product Id Does not exist"});
        }
        else if(result.value.category && !(result.value.category in categories)){
            res.status(400).send({"message": "The category is does not exist"})
        }
        else{
            if(result.value.name)
            product[result.value.id].name=result.value.name;
            if(result.value.price)
            product[result.value.id].price=result.value.price;
            if(result.value.category)
            product[result.value.id].category=result.value.category;
            if(result.value.state)
            product[result.value.id].state=result.value.state;
            if(result.value.mode)
            product[result.value.id].mode=result.value.mode;
            if(result.value.size)
            product[result.value.id].size=result.value.size;
            if(result.value.colour)
            product[result.value.id].colour=result.value.colour;
            if(result.value.brand)
            product[result.value.id].brand=result.value.brand;
            if(result.value.metadata){
                dict.metadata=result.value.metadata;
            }
            var dict=product[result.value.id]
            res.status(200).send({
                "message": "The product is successfully updated", dict
                })
        }        
    }
});

// for finding the products by different filters:

app.get('/product/findByName',(req,res)=>{
    var name=req.query.name;
    var dict={}
    for(prod in product){
        if(product[prod]['name']==name){
            dict[prod]=product[prod];
        }
    }
    if(Object.keys(dict).length>0){
        res.status(200).send(dict);
        }
    else
    res.status(404).send({"message":"No product with this name"});

})
app.get('/product/findByCategory',(req,res)=>{
    var category=req.query.category;
    var cnt=0;
    //find the category id of the given category
    for (cid in categories){
        if(categories[cid]['name']==category)
        {
            cnt=1;
            var catid=cid;
            break;
        }
    }
    if(cnt==0)
    {
        res.status(404).send({"message":"Category does not exist"});
    }
    //find all the products having that category id
    var dict={}
    for(prod in product){
        if(product[prod]['category']==catid){
            
            dict[prod]=product[prod];
        }
    }
    if(Object.keys(dict).length>0){
    res.status(200).send(dict);
    }
    else
    res.status(404).send({"message":"No product with this category"});

})
app.get('/product/findByState',(req,res)=>{
    var state=req.query.state;
    var dict={}
    for(prod in product){
        
        if(product[prod]['state']==state){
            
            dict[prod]=product[prod];
        }
    }
    if(Object.keys(dict).length>0){
    res.status(200).send(dict);
    }
    else
    res.status(404).send({"message":"No product with this state"});

})
app.get('/product/findByBrand',(req,res)=>{
    var brand=req.query.brand;
    var dict={}
    for(prod in product){
    
        if(product[prod]['brand']==brand){
            
            dict[prod]=product[prod];
        }
    }
    if(Object.keys(dict).length>0){
    res.status(200).send(dict);
    }
    else
    res.status(404).send({"message":"No product with this brand"});

})
app.get('/product/findBySize',(req,res)=>{
    var size=req.query.size;
    var dict={}
    for(prod in product){
        if(product[prod]['size']==size){
            
            dict[prod]=product[prod];
        }
    }
    if(Object.keys(dict).length>0){
    res.status(200).send(dict);
    }
    else
    res.status(404).send({"message":"No product with this size"});

})
app.get('/product/findByColour',(req,res)=>{
    var colour=req.query.colour;
    var dict={}
    for(prod in product){
        if(product[prod]['colour']==colour){
            
            dict[prod]=product[prod];
        }
    }
    if(Object.keys(dict).length>0){
    res.status(200).send(dict);
    }
    else
    res.status(404).send({"message":"No product with this colour"});

})


// getting a single product based on the id
app.get('/product/:id',(req,res)=>{
    var id=req.params.id;
    if(id in product){
        res.status(200).send(product[id]);
    }
    else{
        res.status(404).send({"message": "Product Doesn't Exist"});
    }
});
// updating a single product via a form 
app.put('/product/:id',(req,res)=>{
    var id=req.params.id;
    const schema = {
        name: joi.string().min(4),
        price: joi.number(),
        category: joi.number(),
        state: joi.string(),
        mode: joi.string(),
        size: joi.string(),
        colour: joi.string(),
        brand: joi.string(),
        metadata: joi.string()
    }
    const result = joi.validate(req.body, schema)
    if(result.error) {
        res.status(400).send(result.error.details[0].message);
    } else {
        if (!(id in product)) {
            res.status(400).send({"message": "Product Id Does not exist"});
        }
        else if(result.value.category && !(result.value.category in categories)){
            res.status(400).send({"message": "This Category Does not exist"});
        }
        else{
            if(result.value.name)
            product[id].name=result.value.name;
            if(result.value.price)
            product[id].price=result.value.price;
            if(result.value.category)
            product[id].category=result.value.category;
            if(result.value.state)
            product[id].state=result.value.state;
            if(result.value.mode)
            product[id].mode=result.value.mode;
            if(result.value.size)
            product[id].size=result.value.size;
            if(result.value.colour)
            product[id].colour=result.value.colour;
            if(result.value.brand)
            product[id].brand=result.value.brand;
            if(result.value.metadata){
                dict.metadata=result.value.metadata;
            }
            var dict=product[id]
            res.status(200).send({
                "message": "The product is successfully updated", dict
                })
        }        
    }
});
// deleting a single product
app.delete('/product/:id',(req,res)=>{
    var id=req.params.id;
    if(id in product){
        delete product[id];
        res.status(200).send({"message": "Deleted Successfully"});
    }
    else{
        res.status(404).send({"message": "Product Doesn't Exist"});
    }
});

// creating a new category
app.post('/category',(req,res)=>{
    const schema = {
        id: joi.number().required(),
        name: joi.string().min(4).required(),
        tax: joi.number().min(0).max(1).required()
    }
    const result = joi.validate(req.body, schema)
    if(result.error) {
        res.status(400).send(result.error.details[0].message);
    } else {
        if (result.value.id in categories) {
            res.status(403).send({"message": "Category Id already in use"});
        }
        else{
            var dict={}
            dict.name=result.value.name;
            dict.tax=result.value.tax;
            categories[result.value.id]=dict;
            res.status(200).send({
                "message": "The category was successfully added", dict
                })
        }        
    }
});
//updating the new category and corresponding products
app.put('/category',(req,res)=>{
    const schema = {
        id: joi.number().required(),
        name: joi.string().min(4).required(),
        tax: joi.number().min(0).max(1).required()
    }
    const result = joi.validate(req.body, schema)
    if(result.error) {
        res.status(400).send(result.error.details[0].message);
    } else {
        if (!(result.value.id in categories)) {
            res.status(400).send({"message": "Category Id Does not exist"});
        }
        else{
            if(result.value.name)
            categories[result.value.id].name=result.value.name;
            if(result.value.tax){
                //if tax is updated then update the total price of all the products belonging to this category
            categories[result.value.id].tax=result.value.tax;
            for(prod in product){
                if(product[prod]['category']==result.value.id){
                    var total =product[prod]['price']+product[prod]['price']*result.value.tax;
                    product[prod]['total']=total;
                }
            }
            }
            var dict=categories[result.value.id]
            res.status(200).send({
                "message": "The category is successfully updated", dict
                })
        }        
    }
});
//displaying the category according to the given 
//if you want to view products according to a given id 
app.get('/category/:id',(req,res)=>{
    var id=req.params.id;
    if(id in categories){
        res.status(200).send(categories[id]);
    }
    else{
        res.status(404).send({"message": "Category Doesn't Exist"});
    }
});
// deleting the category and corresponding products
app.delete('/category/:id',(req,res)=>{
    var id=req.params.id;
    if(id in categories){
        delete categories[id];
        //deleting the product in the given category
        for(prod in product){
            if(product[prod]['category']==id){
                
                delete product[prod];
            }
        }
        res.status(200).send({"message": "Deleted Successfully"});
    }
    else{
        res.status(404).send({"message": "Category Doesn't Exist"});
    }
});


// uploading the file to a local folder, saving the encrypted filename and the product id in 'files' dictionary
app.post('/product/uploadImage/:id', upload.single('file-to-upload'), (req, res) => {

    var id=req.params.id;
    if(id in product){
        if (req.file) {
            console.log('Uploading file...');
            //since every filename is encrypted therefore it is unique
            //one product can have multiple images
            //therefore, file name is the key and the id is the value
            var filename = req.file.filename;
            files[filename]=id
            res.status(200).send({"message": "Uploaded Successfully",files});
        } else {
            res.status(400).send({"message": "Upload failed"});
        }
    }
    else{
        res.status(404).send({"message": "Product Doesn't Exist"});
    }
});



app.get('*',(req,res)=>{
    res.send("This is not a valid URL");
    });
app.post('*',(req,res)=>{
    res.send("This is not a valid URL");
    });

app.listen(port)

console.log("Server is up and running on Port :",port);