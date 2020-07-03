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
    title: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: ''
    },
    points: {
        type: [Number],
        default: []
    }
}