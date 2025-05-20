import { connect } from 'mongoose';
import dotenv from 'dotenv'
dotenv.config()

const connectDB = async () => {
    try{
        await connect(process.env.ATLAS_PW)
        console.log('connected to mongoDB')
    } catch (error) {
        console.log(error)
    }
}
    

export default connectDB;