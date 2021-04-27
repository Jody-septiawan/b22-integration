const TableRowAxios = ({ todo, index, key, getTodoById, deleteTodoById }) => {
    return (
        <tr key={key}>
            <td>{index + 1}</td>
            <td>{todo.title}</td>
            <td>{todo.isDone ? 'true' : 'false'}</td>
            <td>
                <button
                    className="btn btn-sm btn-info mr-2"
                    onClick={() => getTodoById(todo.id)}
                >
                    Edit
                </button>
                <button
                    className="btn btn-sm btn-danger"
                    onClick={() => deleteTodoById(todo.id)}
                >
                    delete
                </button>
            </td>
        </tr>
    );
};

export default TableRowAxios;