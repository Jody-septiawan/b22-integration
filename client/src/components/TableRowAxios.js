const TableRowAxios = ({ todo, index, getTodoById, deleteTodoById }) => {
    return (
        <tr key={index}>
            <td>{index + 1}</td>
            <td>{todo.title}</td>
            <td>{todo.isDone ? 'true' : 'false'}</td>
            <td>
                <img 
                src={todo.screenshot_url} 
                alt={todo.screenshot}
                style={
                    {
                    width: '100%', 
                    maxWidth: '100px',
                    objectFit: 'cover'
                    }
                }
                />
            </td>
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