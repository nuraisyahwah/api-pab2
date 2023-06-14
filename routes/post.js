const express = require('express')
const router = express.Router()
const Post = require('../models/Post')

function result(succ, msg, details) {
    if (details) {
        return {
            succes: succ,
            message: msg,
            data: details,
        };
    } else {
        return {
            succes: succ,
            message: msg,
        };
    }
}

router.get('/', async (req, res) => {
    try {
        const post = await Post.aggregate([{
                $lookup: {
                    from: 'user',
                    localField: 'user_id',
                    foreignField: '_id',
                    as: 'userData'
                }
            },
            {
                $set: {
                    id: '$_id',
                    username: {
                        $arrayElemAt: ['$UserData.username', 0]
                    },
                    created_date: {
                        $dateToString: {
                            format: '%d-%m-%Y %H:%M:%S',
                            date: '$created_date',
                            timezone: '+07:00'
                        }
                    },
                    modified_date: {
                        $dateToString: {
                            format: '%d-%m-%Y %H:%M:%S',
                            date: '$modified_date',
                            timezone: '+07:00'
                        }
                    },
                }
            },
            {
                $project: {
                    userData: 0,
                    _id: 0
                }
            }
        ]);

        if (post.length > 0) {
            res.status(200).json(result(1, 'Retrive Data Success!', post))
        } else {
            res.status(200).json(result(1, 'Zero Data!'))
        }
    } catch (error) {
        res.status(500).json(result(0, error.message))
    }
})

router.post('/', async (req, res) => {
    const inputPost = new Post({
        content: req.body.content,
        user_id: req.body.user_id,
        nama_anda: req.body.nama_anda,
        lokasi: req.body.lokasi,
        keterangan: req.body.keterangan
    })

    try {
        const post = await inputPost.save()
        res.status(200).json(result(1, 'Insert Post Success!'))
    } catch (error) {
        res.status(500).json(result(0, error.message))
    }
})

router.put('/', async (req, res) => {
    const data = {
        id: req.body.id,
        content: req.body.content,
        nama_anda: req.body.nama_anda,
        lokasi: req.body.lokasi,
        keterangan: req.body.keterangan,
        modified_date: Date.now()
    }

    try {
        const post = await Post.updateOne({
            _id: data.id
        }, data)

        if (post.matchedCount > 0) {
            res.status(200).json(result(1, 'Update Post Success!'))
        } else {
            res.status(200).json(result(0, 'Update Post Failed!'))
        }
    } catch (error) {
        res.status(500).json(result(0, error.message))
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const post = await Post.deleteOne({
            _id: req.params.id
        })

        if (post.deleteCount > 0) {
            res.status(200).json(result(1, 'Delete Post Failed!'))
        } else {
            res.status(200).json(result(0, 'Delete Post Success!'))
        }
    } catch (error) {
        res.status(500).json(result(0, error.message))
    }
})


module.exports = router