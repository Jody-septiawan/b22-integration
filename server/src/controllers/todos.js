const { todos } = require('../../models');

// let todos = [
//     {
//         id: 1,
//         title: "Cuci Tangan",
//         isDone: true
//     },
//     {
//         id: 2,
//         title: "Gunakan Masker",
//         isDone: false
//     }
// ]

// app.post('/todo', (req, res) => {
//     const data = req.body;

//     todos = [...todos, data];

//     res.send({
//         todos
//     });
// });

// app.get('/todos', (req, res) => {
//     res.send({
//         status: "success",
//         data: todos
//     });
// });

// app.patch('/todo/:id', (req, res) => {
//     const id = req.params.id;
//     const data = req.body;

//     const checkTodo = todos.find(data => data.id == id);

//     if (!checkTodo) {
//         return res.send({
//             status: "failed",
//             message: "Data not found"
//         })
//     }

//     todos = todos.map(todo => {
//         if (todo.id == id) {
//             return { id, ...data }
//         } else {
//             return todo
//         }
//     })

//     res.send({ todos });
// });

// app.delete('/todo/:id', (req, res) => {
//     const id = req.params.id;

//     const checkTodo = todos.find(data => data.id == id);

//     if (!checkTodo) {
//         return res.send({
//             status: "failed",
//             message: "Data not found"
//         })
//     }

//     todos = todos.filter(todo => todo.id != id);

//     res.send({ todos });
// });

exports.getTodos = async (req, res) => {
    try {
        const dataTodos = await todos.findAll({
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        });
        res.send({
            status: "success",
            data: dataTodos
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "failed",
            message: "server error"
        })
    }
};

exports.getTodo = async (req, res) => {
    try {
        const id = req.params.id;
        const dataTodos = await todos.findOne({
            where: {
                id
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        });
        res.send({
            status: "success",
            data: dataTodos
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "failed",
            message: "server error"
        })
    }
};

exports.addTodo = async (req, res) => {
    try {
        const data = req.body;

        await todos.create(data);

        const dataTodos = await todos.findAll({
            attributes: {
                exclude: ["createdAt", "updatedAt"],
            }
        });

        res.send({
            status: "success",
            data: dataTodos
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "failed",
            message: "server error"
        })
    }
};

exports.updateTodo = async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;

        const checkTodo = todos.findOne({ where: { id } });

        if (!checkTodo) {
            return res.send({
                status: "failed",
                message: "Data not found"
            })
        };

        await todos.update(data, {
            where: {
                id
            }
        })

        res.send({
            status: "update success",
            data: id
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "failed",
            message: "server error"
        })
    }
};

exports.deleteTodo = async (req, res) => {
    try {
        const id = req.params.id;

        const checkTodo = todos.findOne({ where: { id } });

        if (!checkTodo) {
            return res.send({
                status: "failed",
                message: "Data not found"
            })
        };

        await todos.destroy({ where: { id } });

        res.send({
            status: "delete success",
            data: { id }
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "failed",
            message: "server error"
        })
    }
};