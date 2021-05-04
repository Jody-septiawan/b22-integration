import { useContext, useState, useEffect } from 'react';
import {useHistory} from 'react-router-dom';
import {io} from 'socket.io-client';

import { UserContext } from "../contexts/userContext";

import LoginComponent from '../components/LoginComp';
import TableRowAxios from '../components/TableRowAxios';
import TodoForm from '../components/forms/TodoForm';

import { API } from "../config/api";

let socket;

function AxiosComponent() {
    const [todos, setTodos] = useState([]);
    const router = useHistory();
    const [idForUpdate, setIdForUpdate] = useState(null);
    const [form, setForm] = useState({
        title: "",
        isDone: "true",
        screenshot: null,
    });

    // LOAD/READ DATA
    const loadTodos = async (socket) => {
        await socket.emit('load todos')
        await socket.on('todos', (data) => {
            console.log(data)
            setTodos(data);
        })
    }

    useEffect(() => {
        // server domain/url
        socket = io('http://localhost:5000/todos', {
            auth: {
                token: localStorage.getItem("token")
            }
        })
        loadTodos(socket);

        return () => {
            socket.disconnect()
        }
    }, []);

    // ADD DATA
    const onChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.type === "file" ? e.target.files : e.target.value
        })
    };

    const handleSubmit = async () => {
        try {
            const config = {
                headers: {
                    "Content-type": "multipart/form-data"
                }
            }

            const formData = new FormData();
            formData.set("title", form.title);
            formData.set("isDone", form.isDone === "true" ? true : false);
            formData.append("image", form.screenshot[0], form.screenshot[0].name)
            await API.post("/todo", formData, config);
            loadTodos(socket);
            setForm({
                title: "",
                isDone: "false",
                screenshot: null
            })
        } catch (error) {
            console.log(error);
        }
    }

    // DELETE DATA
    const deleteTodoById = async (id) => {
        try {
            await socket.emit('delete todo', id);
            await loadTodos();
        } catch (error) {
            console.log(error);
        }
    }

    // UPDATE DATA
    const getTodoById = async (id) => {
        try {
            const response = await API.get(`/todo/${id}`);
            const todo = response.data.data;
            console.log(todo)
            setIdForUpdate(todo.id);

            setForm({
                title: todo.title ? todo.title : "",
                isDone: todo.isDone ? "true" : "false",
            })

        } catch (error) {
            console.log(error)
        }
    }

    const updateTodo = async () => {
        console.log(form)
        try {
            if(form.screenshot) {
                const config = {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
    
                const formData = new FormData();
                formData.set("title", form.title);
                formData.set("isDone", form.isDone === "true" ? true : false);
                formData.append("image", form.screenshot[0], form.screenshot[0].name);
                await API.patch(`/todo/${idForUpdate}`, formData, config);
                
                setIdForUpdate(null);
                setForm({
                    title: "",
                    isDone: "true",
                    screenshot: null
                })
                return loadTodos(socket);
            }

            const config = {
                headers: {
                    "Content-Type": "application/json"
                }
            }
            const body = JSON.stringify({
                title: form.title,
                isDone: form.isDone === "true" ? true : false
            });

            await API.patch(`/todo/${idForUpdate}`, body, config);
            setIdForUpdate(null);

            setForm({
                title: "",
                isDone: "true",
                screenshot: null
            })
            loadTodos(socket);
        } catch (error) {
            console.log(error);
        }
    }

    const goToTodoDetail = (id) => {
        router.push(`/todo/${id}`);
    }
    return (
        <>
            <TodoForm 
            formValue={form}
            idForUpdate={idForUpdate}
            updateTodo={updateTodo}
            handleSubmit={handleSubmit}
            handleChange={onChange}
            />
            {todos.length < 1 ? (
            <>
                <h1 style={{textAlign: "center"}}>Todos empty</h1>
            </>
            ): (

            <div className="mt-3 row">
                <table className="table table-sm table-bordered table-striped table-hovered">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Title</th>
                            <th>Status</th>
                            <th>Evidence</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            todos?.map((todo, index) => (
                                <TableRowAxios
                                    todo={todo}
                                    index={index}
                                    key={todo.id}
                                    getTodoById={getTodoById}
                                    deleteTodoById={deleteTodoById}
                                    handlePush={goToTodoDetail}
                                />
                            ))
                        }
                    </tbody>
                </table>
            </div>
            )}
        </>
    )
}

function Axios() {
    const [state] = useContext(UserContext);

    return (
        <>
            {!state.isLogin ?
                (<LoginComponent />) :
                (<AxiosComponent />)
            }
        </>
    )
}

export default Axios;