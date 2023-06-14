const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
    nama_anda: {
        type: String,
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    lokasi: {
        type: String,
        required: true
    },
    keterangan: {
        type: String,
        required: true
    },
    created_date: {
        type: Date,
        default: Date.now
    },
    modified_date: {
        type: Date,
        default: null
    }
}, {
    versionKey: false
})
module.exports = mongoose.model('Post', postSchema, 'post')