const { Schema, Types, model} = require ('mongoose');
const Reactions = require('./Reaction');

const thoughtSchema = new Schema (
    {
        description: {
            type: String,
            required: true,
            minlength:1,
            maxlength: 280,
        },
        username: {
            type: String,
            ref: 'users',
            required:true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        reactions: [Reactions],
        emojis: Array
    },
    {
        toJSON: {
            virtuals: true,
        },
        id: false,
    }
);

thoughtSchema
    .virtual('new_emoji')
        .set(function(request) {
            const user = request.id;
            const emoji = request.emoji;
            const state = request.state;
            if (state === "destroy"){
                // This is how you call the index of an array based on two conditions that need to be met.
                const index = this.emojis.indexOf((entry => entry.user === user && entry.emoji === emoji)); 
                this.emojis.splice(index,1)
            } else if (state === "create") {
                this.emojis.push({user:user,emoji:emoji});
            }
        });

thoughtSchema
    .virtual("reaction_count")
        .get(function () {
            return this.reactions.length
        })

const Thought = model('thoughts', thoughtSchema);

module.exports = Thought;
