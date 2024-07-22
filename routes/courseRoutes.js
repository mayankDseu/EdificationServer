import express from "express";
import {deleteLecture,deleteCourse, getAllCourses,getCourseLectures,addLecture, editLecture } from "../controllers/courseController.js";
import {createCourse} from "../controllers/courseController.js";
import singleUpload from "../middlewares/multer.js";
import { isAuthenticated,authorizeAdmin,authorizeSubscribers } from "../middlewares/auth.js";

const router = express.Router();
//get all courese without lectures
router.route("/courses").get(getAllCourses);
router.route("/course/:id").get(getCourseLectures);



//create new course - only admin
router.route("/createcourse").post(isAuthenticated,authorizeAdmin,singleUpload,createCourse);


// add lectures, delete courses, get courses details

<<<<<<< HEAD
router.route("/course/:id").post(isAuthenticated,authorizeAdmin,singleUpload,addLecture
=======
<<<<<<< HEAD
router.route("/course/:id").get(getCourseLectures).post(
=======
router.route("/course/:id").get(isAuthenticated,authorizeAdmin,getCourseLectures).post(
>>>>>>> b5676d0d3ab91507bd2e2dab6be94aadaa53b8aa
    isAuthenticated,authorizeAdmin,singleUpload,addLecture
>>>>>>> 498faeb8209dae336a3782a7e7e2d5a75741ebf0
).delete(isAuthenticated,authorizeAdmin,deleteCourse);

//delete lecture

router.route("/lecture").delete(isAuthenticated,authorizeAdmin,deleteLecture).put(editLecture);



export default router;