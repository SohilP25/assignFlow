import express from "express";
import {
  AuthController,
  AssignmentController,
  ResourceFeedController,
  SubmissionController,
} from "../controllers/index.js";
import authMiddleware from "../middleware/authMiddleware.js";
const router = express.Router();

const authController = new AuthController();
const assignmentController = new AssignmentController();
const resourceFeedController = new ResourceFeedController();
const submissionController = new SubmissionController();

// Auth - SignUp and LogIn
router.post("/auth", authController.authorize);

// Assignment CRUD operation
router.post("/assignment/create", authMiddleware, assignmentController.create);
router.get("/assignment/get", authMiddleware, assignmentController.get);
router.put(
  "/assignment/update/:id",
  authMiddleware,
  assignmentController.update
);
router.delete(
  "/assignment/delete",
  authMiddleware,
  assignmentController.delete
);

// Get feeds of student and teacher
router.get(
  "/assignment/feed/student/:id",
  authMiddleware,
  resourceFeedController.assignmentOfStudentFeed
);
router.get(
  "/assignment/feed/teacher/:id",
  authMiddleware,
  resourceFeedController.assignmentOfTeacherFeed
);
router.get(
  "/submission/feed/student/:id",
  authMiddleware,
  resourceFeedController.submissionOfStudentFeed
);

//Routes Related to submission
router.post("/submission/create", authMiddleware, submissionController.create);
router.put(
  "/submission/score",
  authMiddleware,
  submissionController.assignScore
);

// Get Student Report
router.get("/report/:id", authMiddleware, submissionController.studentReport);

export default router;
