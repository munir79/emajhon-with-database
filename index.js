const express =require('express');
const cors =require('cors');
const app=express();
const port =process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors());
app.use(express.json());

//amazon3
//pass:GrTuQXfvP1y5VTpA


const uri = "mongodb+srv://amazon3:GrTuQXfvP1y5VTpA@cluster0.9b6ho97.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    const userCollection=client.db('amazonPract').collection('products');
    const orderCollection=client.db('amazonPract').collection('orders');
     
    app.get('/products',async(req,res)=>{
        const query={}
        const cursor=userCollection.find(query);

        const services=await cursor.toArray();
        res.send(services);
    });

    app.get('/products/:id',async(req,res)=>{
        const id=req.params.id;
        const query={_id: new ObjectId(id)}
        const service=await userCollection.findOne(query);
        res.send(service);
    })
// per user ar order

app.get('/orders',async(req,res)=>{
  let query={};
  if(req.query.email){
    query={
      email:req.query.email
    }
  }
  const cursor=orderCollection.find(query);
  const orders=await cursor.toArray();
  res.send(orders);
})

app.delete('/orders/:id',async(req,res)=>{
  const id=req.params.id;
  console.log('trying to delete:',id);
  const query={_id:new ObjectId(id)}
  const result=await orderCollection.deleteOne(query);
  console.log(result);
  res.send(result);

})


    //orders api
    app.post('/orders',async(req,res)=>{
      const order=req.body;
      const result=await orderCollection.insertOne(order);
      res.send(result);
    })





  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);












app.get('/',(req,res)=>{
    res.send('hello from node mongo server');
});

app.listen(port,()=>{
    console.log(`listening to port ${port}`);
})