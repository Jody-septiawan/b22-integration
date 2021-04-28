const TableRowUser = ({ user, index, getUserById, deleteUserById }) => {
    return (
        <tr>
            <td>{index + 1}</td>
            <td>{user.email}</td>
            <td>{user.nama}</td>
            <td>
                <button
                    className="btn btn-sm btn-info mr-2"
                    onClick={() => getUserById(user.id)}
                >
                    Edit
                </button>
                <button
                    className="btn btn-sm btn-danger"
                    onClick={() => deleteUserById(user.id)}
                >
                    delete
                </button>
            </td>
        </tr>
    );
};

export default TableRowUser;