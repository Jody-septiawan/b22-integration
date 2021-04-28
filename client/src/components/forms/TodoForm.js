function TodoForm(props) {
  const {
    formValue,
    idForUpdate,
    updateTodo,
    handleSubmit,
    handleChange,
  } = props;

  return (
    <div>
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
                            value={formValue.title}
                            onChange={(e) => handleChange(e)}
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
                            value={formValue.isDone}
                            onChange={(e) => handleChange(e)}
                        >
                            <option value="true">True</option>
                            <option value="false">False</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Screenshot</label>
                        <input
                            className="form-control"
                            name="screenshot"
                            onChange={(e) => handleChange(e)}
                            type="file"
                            placeholder="choose an evidence"
                        >
                        </input>
                    </div>
                    <div className="form-group">
                        <button
                            className="btn btn-sm btn-primary btn-block"
                            disabled={!formValue.title || !formValue.isDone ? true : false}
                        >
                            {idForUpdate ? 'Edit' : 'Submit'} Todo
                        </button>
                    </div>
                </form>
            </div>
    </div>
  )
}

export default TodoForm
