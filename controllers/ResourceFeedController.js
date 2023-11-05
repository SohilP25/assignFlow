import { Assignment,ResourceFeed, Attachment, User } from "../models/index.js";
class ResourceFeedController{
    constructor() {
        this.assignment = new Assignment();
        this.resourceFeed = new ResourceFeed();
      }

    assignmentOfStudentFeed = async (req, res) => {
        try {
          const studentId = req.params.id;
          const user_id = req.user_id;
          console.log(studentId, req.user_id);
          //check if it is student and it's user id same as it retrieving 
           const is_teacher = await this.resourceFeed.checkTeacher(user_id);
        if (is_teacher == 0 && studentId != user_id) {
            return res.status(403).json({
              success: false,
              message: "You do not have permission to access this assignments.",
              data: {},
            }); 
          } 
          const data = await this.resourceFeed.getAssignmentOfStudent (studentId);
          res.status(200).json({
            success: true,
            message: "Student's Feed of assignment Fetched Succesfully",
            data: data,
          });
        } catch (error) {
          console.error("Error in assignmentOfStudentFeed:", error.message);
          return res.status(500).json({
            success: false,
            message: error.message,
            data: {},
            err: error,
          });
        }
      };


      assignmentOfTeacherFeed = async (req, res) => {
        try {
          const teacherId = req.params.id;
          console.log(teacherId, req.user_id);
          if (teacherId != req.user_id) {
            return res.status(403).json({
              success: false,
              message: "You do not have permission to access this assignments.",
              data: {},
            });
          }
          const data = await this.resourceFeed.getAssignmentOfTeacher(teacherId);
          res.status(200).json({
            success: true,
            message: "Teacher's Feed of assignment Fetched Succesfully",
            data: data,
          });
        } catch (error) {
          console.error("Error in assignmentOfTeacherFeed:", error.message);
          return res.status(500).json({
            success: false,
            message: error.message,
            data: {},
            err: error,
          });
        }
      };

      submissionOfStudentFeed = async (req, res) => {
        try {
          const studentId = req.params.id;
          const user_id = req.user_id;
          console.log(studentId, req.user_id);
          //check if it is student and it's user id same as it retrieving 
          const is_teacher = await this.resourceFeed.checkTeacher(user_id);
          if (is_teacher == 0 && studentId != user_id) {
            return res.status(403).json({
              success: false,
              message: "You do not have permission to access this submissions.",
              data: {},
            });
          } 
          const data = await this.resourceFeed.getSubmissionOfStudent (studentId);
          res.status(200).json({
            success: true,
            message: "Student's Feed of assignment Fetched Succesfully",
            data: data,
          });
        } catch (error) {
          console.error("Error in assignmentOfStudentFeed:", error.message);
          return res.status(500).json({
            success: false,
            message: error.message,
            data: {},
            err: error,
          });
        }
      };

      
    
}
export default ResourceFeedController;