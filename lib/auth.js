import User from "@/models/userModel";
import { createHmac } from "crypto";
import { cookies } from "next/headers";
import { Session } from "./SessionModel";

export async function getLoggedInUser() {
  const cookieStore = await cookies();

  const errorResponse = Response.json({error : "Please login"}, {status : 401})

  const signedCookie = cookieStore.get("userId")?.value;

  if(!signedCookie){
    return errorResponse;
  }

  const sessionId = verifyCookie(signedCookie)

  if(!sessionId) {
    return errorResponse;
  }
  const session = await Session.findById(sessionId)

  if(!session){
    return errorResponse;
  }

  const user = await User.findById(session.userId)


  const {_id, name, email} = user;

  if(!user){
    return errorResponse;
  }

  return {id : _id, name, email};
}

export function signCookie(cookie) {
  const signature = createHmac("sha256", process.env.COOKIE_SECRET).update(cookie).digest("hex")

  return `${cookie}.${signature}`
}


export function verifyCookie(signedCookie) {
  const [cookie, signatureCookie] = signedCookie.split(".");
  const signature = signCookie(cookie).split(".")[1]

  if(signature === signatureCookie){
    return cookie;
  }
  return false;

}


