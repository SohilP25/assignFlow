import { v4 as uuidv4 } from "uuid";

import upload from "../config/multerConfig.js";
import { Assignment, Attachment, ResourceFeed, User } from "../models/index.js";

class AssignmentController {
  constructor() {
    this.assignment = new Assignment();
    this.attachment = new Attachment();
    this.user = new User();
    this.resourceFeed = new ResourceFeed();
  }

  create = async (req, res) => {
    try {
      upload.single("file")(req, res, async (err) => {
        if (err) {
          console.log("Error in uploading Assignment files - Controller");
          console.log(err);
          return res.status(500).json({
            success: false,
            message: "Error in uploading Attachments",
            data: {},
            error: err.message,
          });
        }

        let teacherData = await this.user.findById(req.user_id);
        if (teacherData[0].role == "0") {
          return res.status(403).json({
            success: false,
            message: "You do not have permission to create the assignment",
            data: {},
          });
        }

        let attachment_data,
          attachment_type = req.body.type;
        if (attachment_type == "url") {
          attachment_data = req.body.url;
        } else {
          attachment_data = req.file.filename;
        }

        let attachment_id = uuidv4();
        let response = await this.attachment.create(
          attachment_id,
          attachment_type,
          attachment_data
        );

        let assignment_id = uuidv4();
        const assignmentData = {
          assignment_id: assignment_id,
          assigned_by: req.user_id,
          grade: req.body.grade,
          subject: req.body.subject,
          due_date: req.body.due_date,
          title: req.body.title,
          description: req.body.description,
          score: req.body.score,
          attachment_id: attachment_id,
        };

        const newAssignment = await this.assignment.create(assignmentData);

        return res.status(200).json({
          success: true,
          message: "Assignment Created Successfully",
          data: newAssignment,
        });
      });
    } catch (error) {
      console.error("Error in Assignment Controller:", error.message);
      return res.status(500).json({
        success: false,
        message: error.message,
        data: {},
        err: error,
      });
    }
  };

  get = async (req, res) => {
    try {
      const teacherData = await this.user.findById(req.user_id);
      console.log("teacherData", teacherData);
      if (teacherData[0].role == "0") {
        return res.status(403).json({
          success: false,
          message: "You do not have permission to get the assignments",
          data: {},
        });
      }

      let assignmentData = {};
      if (req.body.assignment_id) {
        assignmentData.assignment_id = req.body.assignment_id;
      }
      if (req.body.assigned_by) {
        assignmentData.assigned_by = req.body.assigned_by;
      }
      if (req.body.grade) {
        assignmentData.grade = req.body.grade;
      }
      if (req.body.subject) {
        assignmentData.subject = req.body.subject;
      }
      if (req.body.title) {
        assignmentData.title = req.body.title;
      }
      if (req.body.score) {
        assignmentData.score = req.body.score;
      }

      const getAssignment = await this.assignment.get(assignmentData);

      return res.status(200).json({
        success: true,
        message: "Assignment Retrieved Successfully",
        data: getAssignment,
      });
    } catch (error) {
      console.error("Error in Assignment Controller:", error.message);
      return res.status(500).json({
        success: false,
        message: error.message,
        data: {},
        err: error,
      });
    }
  };

  update = async (req, res) => {
    try {
      upload.single("file")(req, res, async (err) => {
        if (err) {
          console.log("Error in uploading Assignment files - Controller");
          console.log(err);
          return res.status(500).json({
            success: false,
            message: "Error in uploading Attachments",
            data: {},
            error: err.message,
          });
        }
        const assignment_id = req.params.id;
        const existingAssignment = await this.assignment.findById(
          assignment_id
        );

        if (!existingAssignment || !existingAssignment.length) {
          return res.status(404).json({
            success: false,
            message: "Assignment not Found",
            data: {},
          });
        }
        console.log("existingAssignment", existingAssignment);
        if (existingAssignment[0].assigned_by !== req.user_id) {
          return res.status(403).json({
            message: "You do not have permission to update this assignment",
            data: {},
            success: false,
          });
        }

        let updatedAssignmentData = {};

        if (req.body.grade) {
          updatedAssignmentData.grade = req.body.grade;
        }
        if (req.body.subject) {
          updatedAssignmentData.subject = req.body.subject;
        }
        if (req.body.title) {
          updatedAssignmentData.title = req.body.title;
        }
        if (req.body.description) {
          updatedAssignmentData.description = req.body.description;
        }
        if (req.body.score) {
          updatedAssignmentData.score = req.body.score;
        }

        if (req.body.type) {
          let type = req.body.type;
          let attachment_data;
          if (type == "url") {
            attachment_data = req.body.url;
          } else if (type == "file") {
            attachment_data = req.file.filename;
          }
          if (attachment_data) {
            const updateAttachment = await this.attachment.update(
              existingAssignment[0].attachment_id,
              attachment_data,
              type
            );
          }
        }

        if (Object.keys(updatedAssignmentData).length != 0) {
          const updatedAssignment = await this.assignment.update(
            assignment_id,
            updatedAssignmentData
          );
        }

        return res.status(200).json({
          success: true,
          message: "Assignment updated Successfully",
        });
      });
    } catch (error) {
      console.error("Error in Assignment Controller:", error.message);
      return res.status(500).json({
        success: false,
        message: error.message,
        data: {},
        err: error,
      });
    }
  };

  delete = async (req, res) => {
    try {
      const assignment_id = req.body.id,
        assigned_by = req.user_id;
      const deleteAssignment = await this.assignment.delete(
        assignment_id,
        assigned_by
      );

      if (deleteAssignment == true) {
        return res.status(200).json({
          success: true,
          message: "Assignment Deleted Successfully",
          data: deleteAssignment,
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "Assignment not found with this User",
          data: deleteAssignment,
        });
      }
    } catch (error) {
      console.error("Error in Assignment Controller:", error.message);
      return res.status(500).json({
        success: false,
        message: error.message,
        data: {},
        err: error,
      });
    }
  };
}
export default AssignmentController;
