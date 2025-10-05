import { getLoggedInUser } from "@/lib/auth";

export async function GET() {
  const user = await getLoggedInUser()

  if(user instanceof Response){
    return user
  }
  return Response.json(user, {
    status : 200,
  })
}
