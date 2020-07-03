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
    points: {
        type: [{
            lng: Number,
            lat: Number
        }],
        default: []
    },
    color: {
        type: String,
        default: ''
    }
}