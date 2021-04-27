const { user } = require('../../models');

const joi = require('joi');

exports.getUsers = async (req, res) => {
    try {
        const path = process.env.PATH_KEY;

        let data = await user.findAll({
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'password']
            }
        });

        const parseJSON = JSON.parse(JSON.stringify(data));

        data = parseJSON.map(item => {
            return {
                ...item,
                image: path + item.image
            }
        });

        res.send({
            status: "success",
            data: {
                users: data
            }
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "failed",
            message: "server error"
        })
    }
}

exports.getUser = async (req, res) => {
    try {
        const id = req.params.id;
        console.log(id);
        let data = await user.findOne({
            where: {
                id
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'password']
            }
        });

        res.send({
            status: "success",
            data: {
                user: data
            }
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "failed",
            message: "server error"
        })
    }
}

exports.updateUser = async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;

        console.log(data);

        const userSelected = await user.findOne({
            where: {
                id
            },
            attributes: {
                exclude: ['updatedAt', 'createdAt', 'password']
            }
        });

        if (!userSelected) {
            return res.send({
                status: "Error",
                message: "User doesn't exist"
            })
        }

        const schema = joi.object({
            email: joi.string().email().min(3),
            nama: joi.string().min(3)
        });

        const { error } = schema.validate(data);

        if (error) {
            return res.send({
                status: "Error",
                message: error.details[0].message
            })
        };

        const path = process.env.PATH;
        // const image = req.files.imageFile[0].filename;

        await user.update(data, {
            where: { id }
        })

        const dataUpdate = await user.findOne({
            where: {
                id
            }
        })

        res.send({
            status: "Success",
            message: "Update user data success",
            data: {
                user: {
                    dataUpdate
                }
            }
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "failed",
            message: "server error"
        });
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const id = req.params.id;

        await user.destroy({
            where: {
                id
            }
        });

        res.send({
            status: "success",
            message: "delete user success",
            data: {
                id
            }
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "failed",
            message: "server error"
        });
    }
}