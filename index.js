const {query, response} = require("express");
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();

//use middleware
app.use(express.json());
app.use(cors());

const port = 5000;
mongoose.set("strictQuery", true);



//file upload



//set mongoose connection
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/services");
    console.log("DB Connected");
  } catch (error) {
    console.log("DB is not connected");
    console.log(error.message);
    process.exit(1);
  }
};

//creating Schema of MongoDB

const servicesSchema = new mongoose.Schema({
  title: String,
  price: {
    type: Number,
    require: true,
  },
  description: String,
 
});


// create services model 
const Service = mongoose.model("Services", servicesSchema);


//route
app.get("/", (req, res) => {
  res.send("Hello World!");
});


// getting data 
app.get('/services', async (req,res)=>{
   try {
    const services= await Service.find();
    if(services){
        res.status(201).send(services);
    
    }else{
        res.status(400).send("There was no products");
    }
   } catch (error) {
    res.status(500).send({message: error.message});
   }
});

// getting single data  by Id
app.get('/services/:id', async (req,res)=>{
   try {



    const id = req.params.id;
    const singleService = {_id: Object(id)};
    const service= await Service.findOne(singleService);
    if(service){
        res.status(201).send(service);
    
    }else{
        res.status(400).send("There was no products");
    }
   } catch (error) {
    res.status(500).send({message: error.message});
   }
});

//post service 
app.post("/services", async (req,res) =>{
    try {
        console.log(req.file)
        const newService = new Service({
            title: req.body.title,
            price: req.body.price,
            description:req.body.description,
          
            
        });
        const serviceData = await newService.save();
        res.status(201).send(serviceData);
    } catch (error) {
      res.status(500).send({message: error.message});
    }
});

//listening port

app.listen(port, async () => {
  console.log(`Example app listening on port ${port}`);
  await connectDB();
});
