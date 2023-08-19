import {MongoClient} from "mongodb"
import { NextResponse } from "next/server"


export async function GET(request){
    
const uri = "mongodb+srv://mongodb:ttOwnAZ9HqKWLxpb@cluster0.2osscc1.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

try{ 
    const database = client.db('stock');
    const inventory = database.collection('inventory');
    const query  = {};
    const allProducts = await inventory.find(query).toArray();
    return NextResponse.json({success:true,allProducts})

} finally{
    await client.close();
}
}


export async function POST(request){
    let body = await request.json();
    console.log(body);

const uri = "mongodb+srv://mongodb:ttOwnAZ9HqKWLxpb@cluster0.2osscc1.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

try{

    const database = client.db('stock');
    const inventory = database.collection('inventory');
    const product = await inventory.insertOne(body);
    return NextResponse.json({product, ok:true})

} finally{
    await client.close();
}
}