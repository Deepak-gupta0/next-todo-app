import { connectDB } from "@/lib/connectDB";
import User from "@/models/userModel";
import bcrypt from 'bcrypt'

export async function POST(request) {
  await connectDB();
  const user = await request.json();
  try {
    const {email,password, name} = user;
    const hashedPassword = await bcrypt.hash(password, 10)
    

    const newUser = await User.create({password: hashedPassword, email, name});
    return Response.json({name, email}, {
      status: 201,
    });
  } catch (error) {
    if(error.code === 11000){
      return Response.json({error : "Email already exists"}, {
        status : 409,
      })
    }else{
      return Response.json({error : "Something went wrong"}, {
        status : 500,
      })
    }
  }
}
