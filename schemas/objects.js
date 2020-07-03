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
    coords: {
        lat: {
            type: Number,
            default: 0
        },
        lng: {
            type: Number,
            default: 0
        }
    },
    files: {
        type: [String],
        default: []
    },
    icon: {
        type: String,
        default: ''
    },
    iconColor: {
        type: String,
        default: ''
    }
}