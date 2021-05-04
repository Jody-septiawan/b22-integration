import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {io} from 'socket.io-client';

let socket;
function TodoDetail() {
  const [todo, setTodo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const {id} = useParams();
  const loadTodo = async (socket) => {
    await socket.emit('load todo')
    await socket.on('todo', (todo) => {
        setTodo(todo.data);
        setIsLoading(false);
    })
  }
  useEffect(() => {
    socket = io('http://localhost:5000/todos', {
      query: {
        id
      }
    })

    loadTodo(socket);
    return () => {
      socket.disconnect();
    }
  }, [])
  return (
    <div>
      {isLoading ? (
        <h1>Loading...</h1>
      ): (
        <>
        <img src={todo.screenshot_url} alt={todo.title}/>
        <h1>{todo.title}</h1>
        <p>{todo.isDone}</p>
        </>
      )}
    </div>
  )
}

export default TodoDetail;
