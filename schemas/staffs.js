module.exports = {
    id: {
        type: Number,
        unique: true,
        default: null
    },
    id_agency: {
        type: Number,
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
    }
}