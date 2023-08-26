import express from "express";
import {deleteMyProfile,deleteUser,updateUserRole,getAllUsers,removeFromPlaylist,addtoPlaylist, register,login,logout,getMyProfile,changepassword ,updateProfile,updateProfilepicture,forgetpassword,resetPassword} from "../controllers/userController.js";
import { authorizeAdmin, isAuthenticated } from "../middlewares/auth.js";

import singleUpload from "../middlewares/multer.js";
const router = express.Router();


// to register a new user
router.route("/register").post(singleUpload,register);

router.route("/login").post(login);

// login 
//   update pass 
//update profilepic
 
router.route("/updateprofilepicture").put(singleUpload,isAuthenticated,updateProfilepicture);


//update profile 
router.route("/updateprofile").put(isAuthenticated,updateProfile);

//logout 
router.route("/logout").get(logout);

// get my profile
router.route("/me").get(isAuthenticated,getMyProfile);


// Delete my profile
router.route("/me").delete(isAuthenticated,deleteMyProfile);


//forget passowrd
router.route("/forgetpassword").post(forgetpassword)
//change password

router.route("/changepassword").put(isAuthenticated,changepassword);
// reset password

router.route("/resetpassword/:token").put(resetPassword);

//addto playlist
router.route("/addtoplaylist").post(isAuthenticated,addtoPlaylist)
//remove from playlist

router.route("/removefromplaylist").delete(isAuthenticated,removeFromPlaylist)



// Admin Routes///

router.route("/admin/users").get(isAuthenticated,authorizeAdmin,getAllUsers)


router.route("/admin/user/:id")
.put(isAuthenticated,authorizeAdmin,updateUserRole).delete(isAuthenticated,authorizeAdmin,deleteUser)


export default router;