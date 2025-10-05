import { getLoggedInUser } from "@/lib/auth";
import { Session } from "@/lib/SessionModel";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies()
  const user = await getLoggedInUser();

  if(user instanceof Response){
    return user
  }

  const {id} = user;

  await Session.findByIdAndDelete(id)
  cookieStore.delete("userId")

  return new Response(null, {status : 204})
}
