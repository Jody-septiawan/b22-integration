const { user } = require('../../models');
const joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.registrasi = async (req, res) => {
    try {
        const { email, password } = req.body;
        const data = req.body;

        const schema = joi.object({
            email: joi.string().email().min(6).required(),
            nama: joi.string().min(3).required(),
            password: joi.string().required()
        });

        const { error } = schema.validate(req.body);

        if (error) {
            return res.send({
                status: "Validation Failed",
                message: error.details[0].message
            })
        };

        const checkEmail = await user.findOne({
            where: {
                email
            }
        });

        if (checkEmail) {
            return res.send({
                status: "Failed",
                message: "Email Already Registered",
            });
        }

        const hashStrenght = 10;
        const hashedPassword = await bcrypt.hash(password, hashStrenght);

        const dataUser = await user.create({
            ...data,
            password: hashedPassword
        });

        res.send({
            status: "Success",
            data: {
                user: {
                    name: dataUser.nama,
                    email: dataUser.email
                }
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "failed",
            message: "server error"
        })
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const schema = joi.object({
            email: joi.string().email().required(),
            password: joi.string().required(),
        });

        const { error } = schema.validate(req.body);

        if (error) {
            return res.send({
                status: "Validation Failed",
                message: error.details[0].message
            })
        };

        const checkEmail = await user.findOne({
            where: {
                email
            }
        });

        if (!checkEmail) {
            return res.send({
                status: "Login Failed",
                message: "Email and Password don't match",
            });
        };

        const isValidPassword = await bcrypt.compare(password, checkEmail.password);

        if (!isValidPassword) {
            return res.send({
                status: "Login Failed",
                message: "Email and Password don't match",
            });
        };

        const secretKey = process.env.SECRET_KEY;

        const token = jwt.sign({
            id: checkEmail.id
        }, secretKey);

        res.send({
            status: "success",
            data: {
                user: {
                    id: checkEmail.id,
                    name: checkEmail.nama,
                    email: checkEmail.email,
                    token
                }
            },
        })


    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "failed",
            message: "server error"
        })
    }
}

exports.checkAuth = async (req, res) => {
    try {
        const id = req.userId;

        const dataUser = await user.findOne({
            where: {
                id
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'password']
            }
        });

        if (!dataUser) {
            return res.status(404).send({
                status: "Failed"
            })
        }

        res.send({
            status: "success",
            message: "user valid",
            data: {
                user: {
                    id: dataUser.id,
                    name: dataUser.nama,
                    email: dataUser.email,
                }
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