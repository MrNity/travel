module.exports = {
    id: {
        type: Number,
        unique: true,
        default: null
    },
    title: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: ''
    },
    owner: {
        type: Number,
        default: null
    }
}