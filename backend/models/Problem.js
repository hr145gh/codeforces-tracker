const mongoose= require("mongoose");

const problemSchema= new mongoose.Schema({
    contestId: {
        type: Number,
        required: true
    },
    
    index: {
        type: String,
        required: true
    },

    name: {
        type: String,
        required: true
    },

    rating: {
        type: Number
    },

    tags: {
        type: [String],
        default: []
    },

    problemUrl: {
        type: String
    },

    solvedAt: {
        type: Date
    }
});

const Problem= mongoose.model("Problem", problemSchema);
module.exports= Problem;