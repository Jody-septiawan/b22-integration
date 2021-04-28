import { useContext, useState, useEffect } from 'react';
import { UserContext } from "../contexts/userContext";

import { API } from "../config/api";

import LoginComponent from '../components/LoginComp';
import TableRowAxios from '../components/TableRowAxios';
import TodoForm from '../components/forms/TodoForm';


function AxiosComponent() {
    const [todos, setTodos] = useState([]);
    const [idForUpdate, setIdForUpdate] = useState(null);
    const [form, setForm] = useState({
        title: "",
        isDone: "true",
        screenshot: null,
    });

    // LOAD/READ DATA
    const loadTodos = async () => {
        try {
            const response = await API.get("/todos");
            setTodos(response.data.data.todos);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        loadTodos();
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

            loadTodos()

        } catch (error) {
            console.log(error);
        }
    }

    // DELETE DATA
    const deleteTodoById = async (id) => {
        try {
            await API.delete(`/todo/${id}`);

            loadTodos()
        } catch (error) {
            console.log(error)
        }
    }

    // UPDATE DATA
    const getTodoById = async (id) => {
        try {
            const response = await API.get(`/todo/${id}`);
            const todo = response.data.data;
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
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json"
                }
            }

            const body = JSON.stringify({
                title: form.title,
                isDone: form.isDone === "true" ? true : false,
                image: form.image
            });

            const response = await API.patch(`/todo/${idForUpdate}`, body, config);

            setIdForUpdate(null);

            setForm({
                title: "",
                isDone: "true"
            })

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <TodoForm 
            formValue={form}
            idForUpdate={idForUpdate}
            updateTodo={updateTodo}
            handleSubmit={handleSubmit}
            handleChange={onChange}/>
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