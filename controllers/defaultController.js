const bcrypt             = require("bcryptjs");
const User               = require("../models/UserModel").User;

const Employees          = require("../models/EmployeeModel").Employee;
let jwtToken             = require("./../services/jwtService");
const mailservice        = require("../services/mailService");
jwtToken                 = new jwtToken();
const moment             = require("moment");
const randomstring       = require("randomstring");
const passport           = require("passport");
const LocalStrategy      = require("passport-local").Strategy;

// Defining Local Strategy

/****************************************Passport authentication start*****************************************************************8 */
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passReqToCallback: true,
    },
    (req, email, password, done) => {
      User.findOne({ email: email }).then((user) => {
        if (!user) {
          return done(
            null,
            false,
            req.flash("error-message", "User not found with this email.")
          );
        }

        bcrypt.compare(password, user.password, (err, passwordMatched) => {
          if (err) {
            return err;
          }

          if (!passwordMatched) {
            return done(
              null,
              false,
              req.flash("error-message", "Invalid Username or Password")
            );
          }
          console.log("aslkdsakdn");
          return done(
            null,
            user,
            req.flash("success-message", "Login Successful")
          );
        });
      });
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

/****************************************Passport authentication end*****************************************************************8 */

module.exports = {
  /* LOGIN ROUTES */

  loginPost: (req, res) => {

    try {
        passport.authenticate("local", (err, user) => {
            if (err) {
              return res.json({
                success: 0,
                message: "Invalid Username or Password",
              });
            }
            req.logIn(user, (err) => {
              if (err) {
                return res.json({
                  success: 0,
                  message: "Invalid Username or Password",
                });
              }
      
              return res.json({ success: 1, message: "Logged in Successfully" });
            });
          })(req, res);
          
    } catch (error) {
        return res.json({ success: 0, message: "error occured" });
        
    }
   
  },

  /* REGISTER ROUTES*/

  registerPost: (req, res) => {
      try {
        let errors = [];

        if (!req.body.firstName) {
          errors.push({ message: "First name is mandatory" });
        }
        if (!req.body.lastName) {
          errors.push({ message: "Last name is mandatory" });
        }
        if (!req.body.email) {
          errors.push({ message: "Email field is mandatory" });
        }
        if (!req.body.password || !req.body.passwordConfirm) {
          errors.push({ message: "Password field is mandatory" });
        }
        if (req.body.password !== req.body.passwordConfirm) {
          errors.push({ message: "Passwords do not match" });
        }
    
        if (errors.length > 0) {
          return res
            .status(400)
            .json({ error: errors, meessage: "unexpected error occured! " });
        } else {
          User.findOne({ email: req.body.email }).then((user) => {
            if (user) {
              return res
                .status(400)
                .json({ meessage: "User already exist with same email id " });
            } else {
              console.log("no error");
              const newUser = new User(req.body);
    
              bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                  newUser.password = hash;
                  newUser.save();
                  return res
                    .status(200)
                    .json({ meessage: "User registered successfully" });
                });
              });
            }
          });
        } 
      } catch (error) {
        return res
        .status(400)
        .json({ meessage: "User not registered successfully" });
      }
 
  },

  /**********************************************Password Reset start here*************************************************************************8 */

  forgotPassword: async (req, res) => {
    let email = req.body.email;

    let key = randomstring.generate(8);
    let token = await jwtToken.generateToken({ token: key });

    User.findOne({ email }, async (err, user) => {
      if (err || !user) {
        return res.status(400).json({ meessage: "user not exist" });
      }

      user.token = key;
      user.save();
      await mailservice.sendEmail(email, token);
      return res
        .status(200)
        .json({ meessage: "Password reset link send successfully" });
    });
  },
  resetPassword: async (req, res) => {
    try {
      let token = req.params.token;
      let email = req.params.email;
      const valid_Token = await jwtToken.verifyToken(token);
      console.log("token tolken", valid_Token);
      User.findOne({ email }, async (err, user) => {
        if (err || !user) {
          return res.status(400).json({ meessage: "user not exist" });
        }

        console.log("user", user);
        if (user.token == valid_Token.token) {
          return res
            .status(200)
            .json({ meessage: "user Password reset page rendering" });
        } else {
          return res.status(400).json({ meessage: "tocken expired page " });
        }
      });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ meessage: "unexpected error occured! " });
    }
  },
  updatePassword: async (req, res) => {
    try {
      const passwordData = req.body.newPassword;
      const email = req.body.email;
      let errors=[];

      if (!req.body.newPassword || !req.body.passwordConfirm) {
        errors.push({ message: "Password field is mandatory" });
      }
      if (req.body.newPassword !== req.body.passwordConfirm) {
        errors.push({ message: "Passwords do not match" });
      }
  
      if (errors.length > 0) {
        return res
          .status(400)
          .json({ error: errors, meessage: "unexpected error occured! " });
      } else {
        let hashed_password = bcrypt.hashSync(passwordData, 10);
        User.findOne({ email }, async (err, user) => {
          if (err || !user) {
            return res.status(400).json({ meessage: "user not exist" });
          }
  
          console.log("user", user);
          user.password = hashed_password;
          user.save();
          return res.status(200).json({ meessage: "Password Reset Success" });
        });
      }
     
    } catch (err) {
      console.log(err);
      return res.status(400).json({ meessage: "unexpected error occured! " });
    }
  },

  /**********************************************Password Reset end here*************************************************************************8 */

  /*********************************************Employee controllers start here*****************************************************************8 */

  getEmployees: (req, res) => {
    try {
      let pageNumber = req.body.pageNumber;
      let nPerPage = req.body.nPerPage;

      Employees.find()
        .sort({ _id: 1 })
        .skip(pageNumber > 0 ? (pageNumber - 1) * nPerPage : 0)
        .limit(nPerPage)

        .then((employee) => {
          return res
            .status(200)
            .json({
              employees: employee,
              meessage: "fetched employee successfully",
            });
        });
    } catch (error) {
      console.log("err", error);

      return res.status(400).json({ meessage: "Error occuerd" });
    }
  },

  createEmployees: (req, res) => {


    console.log("ree",req.body);
    
      let FirstName = req.body.FirstName;
      let LastName = req.body.LastName ;
      let Age = req.body.Age ;
      let Email = req.body.Email ;
      let Phone = req.body.Phone ;
      let City = req.body.City ;
      let Country = req.body.Country;
      let Image = req.body.Image;
      let EmployeeId = req.body.EmployeeId;

      const newEmployees = new Employees({
        FirstName: FirstName,
        LastName: LastName,
        Age: Age,
        Email: Email,
        Phone: Phone,
        City: City,
        Country: Country,
        Image: Image,
        EmployeeId: EmployeeId,
      });

      newEmployees.save().then((data)=>{
        return res
        .status(200)
        .json({
          employees: data,
          meessage: "employee saved successfully",
        });

      }).catch((error)=>{

        return res
        .status(400)
        .json({ error: error, meessage: "error occured" });
      });

      
    
  },
  getEditEmployeesPage: async (req, res) => {
    try {
      const EmployeeId = req.params.id;

      Employees.findOne({ _id: EmployeeId }, (err, employee) => {
        return res
          .status(200)
          .json({
            employee: employee,
            meessage: "employee fetched successfully",
          });
      });
    } catch (error) {
      return res.status(400).json({ meessage: "error occured !" });
    }
  },

  submitEditEmployeesPage: (req, res) => {
 
      const employeeId = req.params.id;

      Employees.findById(employeeId).then((employees) => {
        employees.FirstName = req.body.FirstName;
        employees.LastName = req.body.LastName;
        employees.Age = req.body.Age;
        employees.Email = req.body.Email;
        employees.Phone = req.body.Phone;
        employees.City = req.body.City;
        employees.Country = req.body.Country;
        employees.Image = req.body.Image;
        employees.EmployeeId = req.body.EmployeeId;
        employees.save().then(()=>{

            return res
            .status(200)
            .json({
              employees: employees,
              meessage: "employee updated successfully",
            });
    }).catch((error)=>{

      return res.status(400).json({ meessage: "an error occured" });

    });
        
      });
   
  },
  submitDeleteEmployeesPage: (req, res) => {
    
      const employeeId = req.body.employeeId;
      Employees.findByIdAndRemove(employeeId)
      .then((employees) => {
        if (!employees) {
          return res.status(404).send({
            message: "employee not found ",
          });
        }
        res.send({ message: "employeedeleted successfully!" });
      })
      .catch((err) => {
        return res.status(500).send({
          message: "Could not delete employees ",
        });
      });
      
   
  },

  /*********************************************Employee controllers End here*****************************************************************8 */
};
