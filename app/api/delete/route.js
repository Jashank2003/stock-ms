import {MongoClient} from "mongodb"
import { NextResponse } from "next/server"

export async function DELETE(request) {

    const { slug } =  await request.json();

    if (!slug) {
        return new Response(JSON.stringify({ error: 'Missing slug' }), { status: 400 });
    }

    const uri = "mongodb+srv://mongodb:ttOwnAZ9HqKWLxpb@cluster0.2osscc1.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

    try {
        const database = client.db('stock');
        const inventory = database.collection('inventory');
        
        const result = await inventory.deleteOne({ slug });

        if (result.deletedCount === 1) {
            return NextResponse.json({success:true , message:`deleted` , status:true })
        } else {
            return NextResponse.json({success:true , message:`error in if else` , status:false })
        }
    } catch (error) {
        console.error('Error deleting document:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    } finally {
        await client.close();
    }
}