import { v4 as uuidv4 } from "uuid";

import upload from "../config/multerConfig.js";
import {
  Assignment,
  Attachment,
  User,
  Submission,
  ResourceFeed,
} from "../models/index.js";

class SubmissionController {
  constructor() {
    this.assignment = new Assignment();
    this.attachment = new Attachment();
    this.submission = new Submission();
    this.resourceFeed = new ResourceFeed();
    this.user = new User();
  }

  create = async (req, res) => {
    try {
      upload.single("file")(req, res, async (err) => {
        if (err) {
          console.log("Error in uploading Submission files - Controller");
          console.log(err);
          return res.status(500).json({
            success: false,
            message: "Error in uploading Attachments",
            data: {},
            error: err.message,
          });
        }

        let studentData = await this.user.findById(req.user_id);
        if (studentData.role == "1") {
          return res.status(403).json({
            success: false,
            message: "You do not have permission to submit assignment",
            data: {},
          });
        }

        if (!this.submission.checkEligibility(req.assignment_id, req.user_id)) {
          return res.status(403).json({
            success: false,
            message:
              "You are not eligible submit assignment, possible reasons are Due date or not assigned to you",
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

        let submit_id = uuidv4();
        const submissionData = {
          submit_id: submit_id,
          assignment_id: req.body.assignment_id,
          submitted_by: req.user_id,
          description: req.body.description,
          attachment_id: attachment_id,
        };

        const newSubmission = await this.submission.create(submissionData);

        return res.status(200).json({
          success: true,
          message: "Assignment Submitted Successfully",
          data: newSubmission,
        });
      });
    } catch (error) {
      console.error("Error in Submission Controller:", error.message);
      return res.status(500).json({
        success: false,
        message: error.message,
        data: {},
        err: error,
      });
    }
  };

  assignScore = async (req, res) => {
    try {
      const submit_id = req.body.submit_id,
        user_id = req.user_id,
        score = req.body.score;

      const scoreAssigned = await this.submission.assignScoreValue(
        user_id,
        submit_id,
        score
      );

      if (scoreAssigned == true) {
        return res.status(200).json({
          success: true,
          message: "Score Assigned Successfully",
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "You do not have permission to assign score",
        });
      }
    } catch (error) {
      console.error(
        "Error in Submission Controller, Score not assigned:",
        error.message
      );
      return res.status(500).json({
        success: false,
        message: error.message,
        data: {},
        err: error,
      });
    }
  };

  studentReport = async (req, res) => {
    try {
      const student_id = req.params.id,
        user_id = req.user_id;
      const is_teacher = await this.resourceFeed.checkTeacher(user_id);
      if (is_teacher == 0 && student_id != user_id) {
        return res.status(403).json({
          success: false,
          message: "You do not have permission to access this report.",
          data: {},
        });
      }
      const reportData = await this.submission.getStudentReport(student_id);
      return res.status(200).json({
        success: true,
        message: "Report fetched Successfully",
        data: reportData,
      });
    } catch (error) {
      console.error(
        "Error in Submission Controller, didn't get Student Report",
        error.message
      );
      return res.status(500).json({
        success: false,
        message: error.message,
        data: {},
        err: error,
      });
    }
  };
}
export default SubmissionController;
