import passport from 'passport';
import { Strategy } from 'passport-local';
import UserModel from '../mongoose/models/UserModel';
import { User } from '../models';

// SerializeUser is used to provide some identifying token that can be saved
// in the user's session.  We traditionally use the 'ID' for this.
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// The counterpart of 'serializeUser'.  Given only a user's ID, we must return
// the user object.  This object is placed on 'req.user'.
passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserModel.findById(id);
    done(null, user);
  } catch (e) {
    done(e);
  }
});

// Instructs Passport how to authenticate a user using a locally saved email
// and password combination.  This strategy is called whenever a user attempts to
// log in.  We first find the user model in MongoDB that matches the submitted email,
// then check to see if the provided password matches the saved password. There
// are two obvious failure points here: the email might not exist in our DB or
// the password might not match the saved one.  In either case, we call the 'done'
// callback, including a string that messages why the authentication process failed.
// This string is provided back to the GraphQL client.
passport.use(new Strategy({ usernameField: 'email', passwordField: 'password' }, async (email, password, done) => {
  try {
    const user = await UserModel.findOne({ email: email.toLowerCase() });

    if (!user) {
      return done('Invalid Credentials.');
    }

    await user.comparePassword(password);
    return done(null, user);
  } catch (err) {
    return done('Invalid Credentials.');
  }
}));


type SignUpType = {
  email: string;
  password: string;
  req: any;
};

// Creates a new user account.  We first check to see if a user already exists
// with this email address to avoid making multiple accounts with identical addresses
// If it does not, we save the existing user.  After the user is created, it is
// provided to the 'req.logIn' function. This is apart of Passport JS.
// Notice the Promise created in the second 'then' statement.  This is done
// because Passport only supports callbacks, while GraphQL only supports promises
// for async code!  Awkward!
export async function signup(params: SignUpType) {
  const { email, password, req } = params;
  const user = new UserModel({ email, password });

  if (!email || !password) {
    throw new Error('You must provide an email and password.');
  }

  const existingUser = await UserModel.findOne({ email });

  if (existingUser) {
    throw new Error('Email in use');
  }

  const newUser = await user.save();

  return new Promise((resolve, reject) => {
    req.logIn(newUser, (err) => {
      if (err) {
        reject(err);
      }

      resolve(newUser);
    });
  });
}

// Logs in a user.  This will invoke the 'local-strategy' defined above in this
// file. Notice the strange method signature here: the 'passport.authenticate'
// function returns a function, as it's intended to be used as a middleware with
// Express.  We have another compatibility layer here to make it work nicely with
// GraphQL, as GraphQL always expects to see a promise for handling async code.
export function login(params: SignUpType) {
  const { email, password, req } = params;
  return new Promise((resolve, reject) => {
    const passportLocalAuthenticate = passport.authenticate('local', (err, user) => {
      if (!user) {
        reject(err);
        return;
      }

      req.login(user, () => resolve(user));
    });

    passportLocalAuthenticate({ body: { email, password } });
  });
}

export async function logout(req): Promise<User> {
  const { user } = req;

  return new Promise((resolve, reject) => {
    try {
      req.logout(() => {
        resolve(user);
      });
    } catch (e) {
      reject(e);
    }
  });
}
