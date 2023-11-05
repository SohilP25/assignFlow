import Query from "../helper/queryHelper.js";

class ResourceFeed{

    getAssignmentOfStudent = async (studentId) => {
        try {
          let query = `
          SELECT asgn.*, atch.attachment_type, atch.attachment_data
          FROM Assignments AS asgn
          LEFT JOIN Attachments AS atch
          ON asgn.attachment_id = atch.attachment_id
          WHERE 
          asgn.grade = (
            SELECT grade FROM Users WHERE user_id = "${studentId}"
          );
          `;
          const data = await Query(query);
          console.log("getAssignmentOfStudent",data);
          return data;
        } catch (error) {
            console.log("Error in getAssignmentOfStudent query : ",error.message);
            throw error;
        }
      };

      getAssignmentOfTeacher = async (teacherId) => {
        try {
          let query = `
          SELECT asgn.*, atch.attachment_type, atch.attachment_data
          FROM Assignments AS asgn
          LEFT JOIN Attachments AS atch
          ON asgn.attachment_id = atch.attachment_id
          WHERE asgn.assigned_by = '${teacherId}';
          `;
          const data = await Query(query);
          console.log("getAssignmentOfTeacher",data);
          return data;
        } catch (error) {
            console.log("Error in getAssignmentOfTeacher query : ",error.message);
            throw error;
        }
      };

      checkTeacher= async (id) => {
        try {
            let query = `
            SELECT role 
            FROM Users 
            WHERE user_id = "${id}"; 
            `;
            const data = await Query(query);
            if(data.length > 0)
            return data[0].role;
            else
            return 0;
          } catch (error) {
              console.log("Error in getAssignmentOfTeacher query : ",error.message);
              throw error;
          }
        };

        getSubmissionOfStudent = async (studentId) => {
            try {
              let query = `
              SELECT 
                s.submit_id,
                s.assignment_id,
                s.submitted_on,
                s.achieved_score,
                s.description AS submission_description,
                att.attachment_id,
                att.attachment_type,
                att.attachment_data,
                a.title AS assignment_title,
                a.description AS assignment_description,
                a.due_date AS assignment_due_date
              FROM 
                Submissions s
              LEFT JOIN 
                Attachments att ON s.attachment_id = att.attachment_id
              JOIN 
                Assignments a ON s.assignment_id = a.assignment_id
              WHERE 
                s.submitted_by = '${studentId}';
                `
              const data = await Query(query);
              console.log("getSubmissionOfStudent",data);
              return data;
            } catch (error) {
                console.log("Error in getSubmissionOfStudent query : ",error.message);
                throw error;
            }
          };    

        

}
export default ResourceFeed;