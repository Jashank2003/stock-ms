import {MongoClient} from "mongodb"
import { NextResponse } from "next/server"

export async function POST(request){
   let{action ,slug , initialQuantity} = await request.json()

const uri = "mongodb+srv://mongodb:ttOwnAZ9HqKWLxpb@cluster0.2osscc1.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

try{

    const database = client.db('stock');
    const inventory = database.collection('inventory');
    const filter = {slug:slug}

    let newQuantity = action=="plus" ?  (parseInt(initialQuantity)+1) : (parseInt(initialQuantity)-1) ;
    const updatedoc = {
        $set:{
            quantity : newQuantity
        },
    }
    const result = await inventory.updateOne(filter , updatedoc ,{})
    return NextResponse.json({success:true , message:`${result.matchedCount} document(s) matched the filter , updated ${result.modifiedCount} document(s)`})

} finally{
    await client.close();
}
} 