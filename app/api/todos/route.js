import { getLoggedInUser } from "@/lib/auth";
import { connectDB } from "@/lib/connectDB";
import Todo from "@/models/todoModel";

export async function GET() {
  await connectDB();
  const user = await getLoggedInUser()
  const userId = user.id;

  if(user instanceof Response) {
    return user;
  }

  const allTodos = await Todo.find({userId});
  return Response.json(
    allTodos.map(({ id, completed, text, userId}) => ({ id, completed, text, userId }))
  );
}

export async function POST(request) {
  await connectDB();
  const user = await getLoggedInUser()

  if(user instanceof Response ){
    return user;
  }

  const todo = await request.json();
  const { id, completed, text } = await Todo.create({
    text: todo.text,
    userId : user.id,
  });
  return Response.json(
    { id, text, completed },
    {
      status: 201,
    }
  );
}
