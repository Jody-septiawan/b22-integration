import { useContext, useState, useEffect } from 'react';
import { UserContext } from "../contexts/userContext";

import { API } from "../config/api";

import LoginComponent from '../components/LoginComp';
import TableRowAxios from '../components/TableRowAxios';

function AxiosComponent() {

    const [todos, setTodos] = useState([]);
    const [idForUpdate, setIdForUpdate] = useState(null);
    const [form, setForm] = useState({
        title: "",
        isDone: "true"
    });

    const { title, isDone } = form;

    // LOAD/READ DATA
    const loadTodos = async () => {
        try {
            const response = await API.get("/todos");
            setTodos(response.data.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        loadTodos();
    }, [todos]);

    // ADD DATA
    const onChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    };

    const handleSubmit = async () => {
        try {
            const config = {
                headers: {
                    "Content-type": "application/json"
                }
            }

            const body = JSON.stringify({
                title,
                isDone: isDone === "true" ? true : false
            });

            const response = await API.post("/todo", body, config);

            setForm({
                title: "",
                isDone: "true"
            });

        } catch (error) {
            console.log(error);
        }
    }

    // DELETE DATA
    const deleteTodoById = async (id) => {
        try {
            await API.delete(`/todo/${id}`);

            const updateTodo = todos.filter((todo) => todo.id !== id);

            setTodos(updateTodo);

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
                isDone: todo.isDone ? "true" : "false"
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
                title,
                isDone: isDone === "true" ? true : false
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
            <div className="mt-2 mb-3">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();

                        if (idForUpdate) {
                            updateTodo(); //update data
                        } else {
                            handleSubmit(); //add data
                        }

                    }}
                >
                    <h3 className="text-center">Form {idForUpdate ? 'Edit' : 'Add'} Todo (Axios)</h3>
                    <div className="form-group">
                        <label>Title</label>
                        <input
                            value={title}
                            onChange={(e) => onChange(e)}
                            name="title"
                            type="text"
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label>isDone</label>
                        <select
                            className="form-control"
                            name="isDone"
                            value={isDone}
                            onChange={(e) => onChange(e)}
                        >
                            <option value="true">True</option>
                            <option value="false">False</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <button
                            className="btn btn-sm btn-primary btn-block"
                            disabled={!title || !isDone ? true : false}
                        >
                            {idForUpdate ? 'Edit' : 'Submit'} Todo
                        </button>
                    </div>
                </form>
            </div>
            <div className="mt-3 row">
                <table className="table table-sm table-bordered table-striped table-hovered">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Title</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            todos.map((todo, index) => (
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