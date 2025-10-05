import Todo from "@/models/todoModel";
import { connectDB } from "@/lib/connectDB";
import { getLoggedInUser } from "@/lib/auth";

export async function GET(_, { params }) {
  await connectDB()
  const user = await getLoggedInUser()

  if(user instanceof Response){
    return user
  }

  const { id } = await params;
  const gettodo = await Todo.findOne({_id : id, userId : user.id}) 

  if(!gettodo) {
    return Response.json({error : "Todo not found"}, {status : 404})
  } 
    
    
  return Response.json(gettodo);
}

export async function PUT(request, { params }) {
  await connectDB();
  const user = await getLoggedInUser()

  if(user instanceof Response){
    return user
  }
  const editTodoData = await request.json();
  const { id } = await params;

  const updatedTodo = await Todo.updateMany({ _id : id, userId : user.id}, editTodoData,{
    new: true,
  });
  return Response.json(updatedTodo);
}

export async function DELETE(_, { params }) {
  await connectDB();
  const user = await getLoggedInUser()

  if(user instanceof Response){
    return user
  }

  const { id } = await params;
  const deletedTodo = await Todo.deleteOne({_id : id, userId : user.id});

  return new Response(null, {
    status: 204,
  });
}
