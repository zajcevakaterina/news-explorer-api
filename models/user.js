// const bcrypt = require('bcryptjs');
const { isEmail } = require('validator');
const mongoose = require('mongoose');

// const AuthErr = require('../errors/auth-error');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v) {
        return isEmail(v);
      },
      message: 'Неверно задана почта',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

// userSchema.statics.findUserByCredentials = function (email, password) {
//   return this.findOne({ email })
//     .select('+password')
//     .then((user) => {
//       if (!user) {
//         return Promise.reject(new AuthErr({ message: 'Неправильная почта или пароль' }));
//       }

//       return bcrypt.compare(password, user.password).then((matched) => {
//         if (!matched) {
//           return Promise.reject(new AuthErr({ message: 'Неправильная почта или пароль' }));
//         }

//         return user;
//       });
//     });
// };

module.exports = mongoose.model('user', userSchema);
