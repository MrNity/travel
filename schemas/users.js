module.exports = {
    id: {
        type: Number,
        unique: true,
        default: null
    },
    firsname: {
        type: String,
        default: ''
    },
    lastname: {
        type: String,
        default: ''
    },
    middlename: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        default: ''
    },
    username: {
        type: String,
        default: ''
    },
    password: {
        type: String,
        default: ''
    },
    avatar: {
        type: String,
        default: ''
    }
}