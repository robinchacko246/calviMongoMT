const express = require('express');
const router = express.Router();
const defaultController = require('../controllers/defaultController');
 

/****************************************LOGIN ROUTES START HERE********************************************************************* */
router.route('/login').post(defaultController.loginPost);
router.route('/register').post(defaultController.registerPost);
router.get('/logout', (req, res) => {
    req.logOut();
    return res
                .status(200)
                .json({ meessage: "User logout successfully" });
});  
router.route('/forgotPassword').post(defaultController.forgotPassword)
router.route('/passwordReset/:token/:email').get(defaultController.resetPassword);
router.route('/updatePassword').post(defaultController.updatePassword);      
/****************************************LOGIN ROUTES END HERE********************************************************************* */










/****************************************EMPLOYEES ROUTES HERE********************************************************************* */
router.route('/employees').get(defaultController.getEmployees)
router.route("/employees/create").post(defaultController.createEmployees);
router.route("/employees/edit/:id").get(defaultController.getEditEmployeesPage).post(defaultController.submitEditEmployeesPage);
router.route("/employees/delete").post(defaultController.submitDeleteEmployeesPage);

/****************************************EMPLOYEES ROUTES END HERE********************************************************************* */


module.exports = router;
