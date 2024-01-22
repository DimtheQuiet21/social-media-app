const { Schema, model } = require ('mongoose');

const userSchema = new Schema (
    {
        username: {
            type: String,
            unique: true,
            trim: true,
            required: true
        },
        first: String,
        last: String,
        email: {
            type: String,
            required: true,
            unique: true,
            validate: {
                validator: function (value) {
                  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                },
                message: 'Invalid email address format',
              },
        },
        friendlist: [
            {
                type: Schema.Types.ObjectId,
                ref: 'users',
            }
        ],
        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'thoughts',
            }
        ]

    },
    {
        toJSON: {
            virtuals: true,
        },
        id: false,
    }
);

userSchema
    .virtual('fullName')
        .get(function () {
            return `${this.first} ${this.last}`;
        })
        .set(function (v) {
            const first = v.split(' ')[0];
            const last = v.split(' ')[1];
            this.set({ first, last });
        });

userSchema
    .virtual('friendcount')
        .get(function(){
            return this.friendlist.length
        })
        

const User = model('users', userSchema);

module.exports = User;
