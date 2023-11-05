import Query from "../helper/queryHelper.js";

class Submission {
  create = async (submissionData) => {
    try {
      const query = `
            INSERT INTO Submissions (submit_id, assignment_id, submitted_by, description, attachment_id) VALUES ("${submissionData.submit_id}", '${submissionData.assignment_id}', "${submissionData.submitted_by}", "${submissionData.description}", "${submissionData.attachment_id}");
          `;
      console.log(query);
      const data = await Query(query);
      console.log(data);
      return await this.findById(submissionData.submit_id);
    } catch (error) {
      console.log("Error in creating assignment query : ", error.message);
      throw error;
    }
  };
  
  findById = async (submit_id) => {
    try {
      const query = `
            SELECT * FROM Submissions WHERE submit_id = "${submit_id}";
          `;

      const data = await Query(query);

      return data;
    } catch (error) {
      console.log("Error in findById submission query : ", error.message);
      throw error;
    }
  };

  checkEligibility = async (assignment_id, studentId) => {
    try {
      const query = `
        SELECT 
             CASE 
                 WHEN CURDATE() <= asgn.due_date AND u.grade = asgn.grade THEN 1
                 ELSE 0
            END as IsEligible
        FROM 
            Assignments asgn
        INNER JOIN 
            Users u ON u.user_id = 'student_id'
        WHERE 
            asgn.assignment_id = 'assignment_id';
          `;

      const data = await Query(query);

      return data;
    } catch (error) {
      console.log("Error in checkEligibility submission query : ", error.message);
      throw error;
    }
  };

  assignScoreValue = async (teacher_id,submit_id,score) => {
    try {
        const query = `
            UPDATE Submissions AS sub
            INNER JOIN Assignments AS asgn
            ON sub.assignment_id = asgn.assignment_id
            SET sub.achieved_score = ${score}
            WHERE sub.submit_id = "${submit_id}" 
            AND asgn.assigned_by = "${teacher_id}";
            `;
        const data = await Query(query);
        console.log(data);
        return data.affectedRows > 0;
      } catch (error) {
        console.log("Error in checkEligibility submission query : ", error.message);
        throw error;
      }
  }

  getStudentReport = async (student_id) =>{
    try {
        const query = `
            SELECT 
                u.user_id,
                u.email,
                u.grade,
                COUNT(DISTINCT sub.assignment_id) AS submitted_assignments,
                (SELECT COUNT(*) FROM Assignments WHERE grade = u.grade) - COUNT(DISTINCT sub.assignment_id) AS pending_assignments,
                COALESCE(SUM(sub.achieved_score), 0) AS total_score
            FROM Users u
            LEFT JOIN Submissions sub 
            ON u.user_id = sub.submitted_by
            WHERE u.user_id = "${student_id}"
            GROUP BY u.user_id;
            `;
        const data = await Query(query);
        console.log(data);
        return data;
      } catch (error) {
        console.log("Error in getStudentReport query : ", error.message);
        throw error;
      }
  }
}
export default Submission;
