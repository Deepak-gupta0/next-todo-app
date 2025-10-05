import { signCookie } from "@/lib/auth"
import { connectDB } from "@/lib/connectDB"
import { Session } from "@/lib/SessionModel"
import User from "@/models/userModel"
import { cookies } from "next/headers"
import bcrypt from "bcrypt"

export async function POST(request) {
  await connectDB()
  const cookieStore = await cookies()

  const {email, password} = await request.json()
  
  try {
    const user = await User.findOne({email}) 
    if(!user){
      return Response.json({error : "Invalid Credentials"}, {status : 400})
    }
    const isValidPassword = await bcrypt.compare(password, user.password)

    if(!isValidPassword){
      return Response.json({error : "Invalid Credentials"}, {status : 400})
    }
    const session = await Session.create({userId : user.id})

    cookieStore.set({
      name : "userId",
      value : signCookie(session.id),
      httpOnly : true,
      maxAge: 60 * 60 * 24,
    })

    return Response.json(user, {
      status : 200,
    })

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
