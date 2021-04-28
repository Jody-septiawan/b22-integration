import { useContext, useState } from 'react';
import { UserContext } from "../contexts/userContext";

import { useQuery, useMutation } from 'react-query';

import LoginComponent from '../components/LoginComp';
import TableRowUser from '../components/TableRowUser';
import { API } from '../config/api';

// useQuery => LOAD/READ DATA
// useMutation => ADD,DELETE,UPDATE DATA

function ReactQueryComponent() {
    const [idForUpdate, setIdForUpdate] = useState(null);
    const [form, setForm] = useState({
        email: "",
        password: "",
        nama: ""
    });

    const { email, password, nama } = form;

    // LOAD DATA
    const { data: users, refetch } = useQuery("usersCache",
        async () => {
            const response = await API.get('/users');
            return response.data.data.users
        }
    );

    // ADD DATA
    const onChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    };

    const handleSubmit = () => {
        addUser.mutate();
    };

    const addUser = useMutation(async () => {
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        }
        const body = JSON.stringify({
            email,
            password,
            nama
        });
        await API.post('/register', body, config);

        refetch();
        setForm({
            email: "",
            password: "",
            nama: ""
        })

    });

    // DELETE
    const deleteUserById = async (id) => {
        deleteUser.mutate(id);
    }

    const deleteUser = useMutation(async (id) => {
        await API.delete(`/user/${id}`);
        refetch();
    });

    // UPDATE DATA
    const getUserById = async (id) => {
        const response = await API.get(`/user/${id}`);
        const user = response.data.data.user;

        setIdForUpdate(user.id);
        setForm({
            email: user.email,
            nama: user.nama
        });
    }

    const HandleUpdate = useMutation(async () => {
        try {

            const body = JSON.stringify({
                email,
                nama
            });

            const config = {
                headers: {
                    "Content-Type": "application/json"
                }
            }

            const response = await API.patch(`/user/${idForUpdate}`, body, config);
            console.log(response);
            refetch();
            setIdForUpdate(null);
            setForm({
                email: "",
                nama: ""
            });
        } catch (error) {
            console.log(error);
        }
    });

    return (
        <>
            <div className="mt-2 mb-3">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (idForUpdate) {
                            HandleUpdate.mutate();
                        } else {
                            handleSubmit();
                        }
                    }}
                >
                    <h3 className="text-center">Form {idForUpdate ? 'Update' : 'Add'} User (React-Query)</h3>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            value={email}
                            onChange={(e) => onChange(e)}
                            name="email"
                            type="text"
                            className="form-control"
                        />
                    </div>
                    {!idForUpdate && (
                        <div className="form-group">
                            <label>Password</label>
                            <input
                                value={password}
                                onChange={(e) => onChange(e)}
                                name="password"
                                type="text"
                                className="form-control"
                            />
                        </div>
                    )}
                    <div className="form-group">
                        <label>Name</label>
                        <input
                            value={nama}
                            onChange={(e) => onChange(e)}
                            name="nama"
                            type="text"
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        {idForUpdate ? (
                            <button
                                className="btn btn-primary btn-sm btn-block"
                                disabled={!email || !nama ? true : false}
                            >
                                Edit User
                            </button>
                        ) : (
                            <button
                                className="btn btn-primary btn-sm btn-block"
                                disabled={!email || !password || !nama ? true : false}
                            >
                                Submit User
                            </button>
                        )}
                    </div>
                </form>
            </div>
            <div className="mt-3 row">
                <table className="table table-sm table-striped table-hovered">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Email</th>
                            <th>Name</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users?.map((user, index) => (
                            <TableRowUser
                                user={user}
                                index={index}
                                key={user.id}
                                getUserById={getUserById}
                                deleteUserById={deleteUserById}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

function ReactQuery() {
    const [state] = useContext(UserContext);

    return (
        <>
            {!state.isLogin ?
                (<LoginComponent />) :
                (<ReactQueryComponent />)
            }
        </>
    )
}
export default ReactQuery;