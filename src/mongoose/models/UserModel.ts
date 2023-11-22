import { Model, Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import DbSchema from '../dbSchema';
import { User } from '../../models';

type InstanceMethods = {
  comparePassword(candidatePassword: string): Promise<boolean | Error>;
};
type StaticMethods = {};

type UserModelType = Model<User, {}, InstanceMethods> & StaticMethods;

// Every user has an email and password.  The password is not stored as
// plain text - see the authentication helpers below.
const UserSchema = new Schema<User, UserModelType>({
  email: { type: String },
  password: { type: String },
});

// The user's password is never saved in plain text.  Prior to saving the
// user model, we 'salt' and 'hash' the users password.  This is a one way
// procedure that modifies the password - the plain text password cannot be
// derived from the salted + hashed version. See 'comparePassword' to understand
// how this is used.
UserSchema.pre('save', function save(next) {
  const user = this;

  if (!user.isModified('password')) {
    return next();
  }

  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      next(err);
    }

    bcrypt.hash(user.password, salt, (err, encrypted) => {
      if (err) {
        next(err);
      }

      user.password = encrypted;
      next();
    });
  });
});

// We need to compare the plain text password (submitted whenever logging in)
// with the salted + hashed version that is sitting in the database.
// 'bcrypt.compare' takes the plain text password and hashes it, then compares
// that hashed password to the one stored in the DB.  Remember that hashing is
// a one way process - the passwords are never compared in plain text form.
UserSchema.method('comparePassword', function comparePassword(candidatePassword: string) {
  const user = this;
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, user.password, (err, same) => {
      if (err) {
        reject(err);
      }

      if (!same) {
        reject(false);
      }

      resolve(true);
    });
  });
});

const UserModel = model<User, UserModelType>(DbSchema.User, UserSchema);

export default UserModel;
