import { catchAsyncError } from "../middlewares/catchAsyncError.js"
import singleUpload from "../middlewares/multer.js";
import {Course} from "../models/Course.js"
import getDataUri from "../utils/dataUri.js";
import ErrorHandler from "../utils/errorHandler.js";
import  cloudinary from "cloudinary";
import {Stats} from "../models/Stats.js"

export const getAllCourses = catchAsyncError(async (req, res, next) => {
   const keyword = req.query.keyword || "";
   const category = req.query.category || "";
   const page = parseInt(req.query.page) || 1;
   const limit = parseInt(req.query.limit) || 6;
 
   const courses = await Course.find({
     title: {
       $regex: keyword,
       $options: "i",
     },
     category: {
       $regex: category,
       $options: "i",
     },
   })
     .sort({ createdAt: -1 })
     .skip((page - 1) * limit)
     .limit(limit)
     .select("-lectures");
 
   const totalCourses = await Course.countDocuments({
     title: {
       $regex: keyword,
       $options: "i",
     },
     category: {
       $regex: category,
       $options: "i",
     },
   });
 
   res.status(200).json({
     success: true,
     courses,
     totalPages: Math.ceil(totalCourses / limit),
     currentPage: page,
   });
 });
 


export const createCourse=catchAsyncError(async(req,res,next)=>{
   const {title,description,category,createdBy}=req.body;

   const file=req.file;


   const fileUri=getDataUri(file)
   
   const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);

   if (!title|| !description || !category || !createdBy)return next(new ErrorHandler("Please add all fields",400))
  // const file = req.file;

   await Course.create({
      title,
      description,
      category,
      createdBy,
      poster:{
         public_id:mycloud.public_id,
         url:mycloud.secure_url,
         },
   })




   res.status(201).json({
    success:true,
    message:"Course Created Successfully. You can add lectures now",
   })
})




export const getCourseLectures=catchAsyncError(async(req,res,next)=>{
   const course= await Course.findById(req.params.id)
   if(!course) return next (new ErrorHandler("Course Not Found"),404)
   
   course.views+=1;
   await course.save();
   
   
   res.status(200).json({
    success:true,
    lectures:course.lectures,
   })
})



//max vid soxe 100mb
export const addLecture=catchAsyncError(async(req,res,next)=>{
   const {id}=req.params;
   const {title,description}=req.body;
   

   const course= await Course.findById(id);
   if(!course) return next (new ErrorHandler("Course Not Found"),404)
   
   //uplad file here

/*    const file=req.file;


   const fileUri=getDataUri(file)
   
   const mycloud = await cloudinary.v2.uploader.upload(fileUri.content,{
   resource_type:'video'
   });

 */
   course.lectures.push({
      title,
      description,
      /* video:{
         public_id:mycloud.public_id,
         url:mycloud.secure_url,
      } */
   });

   course.numOfVideos=course.lectures.length;

  
   await course.save();
   
   
   res.status(200).json({
    success:true,
    message:"Lecture added in course"
   })
})





export const deleteCourse=catchAsyncError(async(req,res,next)=>{
   const {id}=req.params;
   const course = await Course.findById(id);
if(!course) return next(new ErrorHandler("Course Not Fonud"),404)
await cloudinary.v2.uploader.destroy(course.poster.public_id);
for (let i=0; i<course.lectures.length;i++){
   const singleLecture  = course.lectures[i];

   await cloudinary.v2.uploader.destroy(singleLecture.video.public_id),{
      resource_type:"video"
   };

}

await course.deleteOne();


   res.status(201).json({
    success:true,
    message:"Course Deleted Successfully." ,
   })
})






export const deleteLecture =catchAsyncError(async(req,res,next)=>{
   const {courseId,lectureId}= req.query;

   const course = await Course.findById(courseId);

   if(!course) return next (new ErrorHandler("Course Not Found"),404)

      course.lectures = course.lectures.filter((item) => item._id.toString() !== lectureId.toString());


   course.numOfVideos=course.lectures.length;

   await course.save();

   res.status(201).json({
    success:true,
    message:"Lecture Deleted Successfully." ,
   })
})




export const editLecture = catchAsyncError(async (req, res, next) => {
  const { courseId, lectureId } = req.query;
  const { title, description } = req.body; // Assuming you are sending these fields to update
  
  if (!courseId || !lectureId) {
    return next(new ErrorHandler("Course ID and Lecture ID are required", 400));
  }

  const course = await Course.findById(courseId);

  if (!course) {
    return next(new ErrorHandler("Course Not Found", 404));
  }

  const lecture = course.lectures.find((item) => item._id.toString() === lectureId.toString());

  if (!lecture) {
    return next(new ErrorHandler("Lecture Not Found", 404));
  }

  // Update the lecture fields
  lecture.title = title || lecture.title;
  lecture.description = description || lecture.description;

  await course.save();

  res.status(200).json({
    success: true,
    message: "Lecture Updated Successfully.",
    lectures: lecture // Optionally return the updated lecture
  });
});

 


Course.watch().on("change", async () => {
   const courses = await Course.find({});
   let totalViews = 0;

   for (let i = 0; i < courses.length; i++) {
       totalViews += courses[i].views;
   }

   let stats = await Stats.findOne().sort({ createdAt: "desc" });

   if (!stats) {
       // If stats is not found, create a new Stats document
       stats = new Stats({
           views: totalViews,
           createdAt: new Date()
       });
   } else {
       // Update existing stats
       stats.views = totalViews;
       stats.createdAt = new Date();
   }

   await stats.save();
});
