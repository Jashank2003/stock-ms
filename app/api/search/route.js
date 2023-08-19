import {MongoClient} from "mongodb"
import { NextResponse } from "next/server"


export async function GET(request){
    
const query = request.nextUrl.searchParams.get("query")
const uri = "mongodb+srv://mongodb:ttOwnAZ9HqKWLxpb@cluster0.2osscc1.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);
try{ 
    const database = client.db('stock');
    const inventory = database.collection('inventory');
    const allProducts = await inventory.aggregate([
        {
            $match:{
                $or:[
                    {slug:{ $regex:query,$options:"i"}},

                ]
            }
        }
    ]).toArray();
    return NextResponse.json({success:true,allProducts})

} finally{
    await client.close();
}
}
