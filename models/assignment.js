import Query from "../helper/queryHelper.js";
import sendMail from "../helper/mailHelper.js";
class Assignment {
  create = async (assignmentData) => {
    try {
      const query = `
            INSERT INTO Assignments (assignment_id, assigned_by, grade, subject, due_date, title, description, score, attachment_id) VALUES ( "${assignmentData.assignment_id}" ,"${assignmentData.assigned_by}", "${assignmentData.grade}", '${assignmentData.subject}', "${assignmentData.due_date}", "${assignmentData.title}", "${assignmentData.description}", "${assignmentData.score}", "${assignmentData.attachment_id}")
          `;
      console.log(query);
      const data = await Query(query);
      console.log(data);
      const mail = `SELECT email
                    FROM Users
                    WHERE grade = "${assignmentData.grade}" AND role = '0';
                    `;
        const mailArray = await Query(mail);
        console.log("mailArray",mailArray);  
        sendMail(mailArray);
      return await this.findById(assignmentData.assignment_id);
      
    } catch (error) {
      console.log("Error in creating assignment query : ", error.message);
      throw error;
    }
  };


  get = async (assignmentData) => {
    try {
      let query = `SELECT
                    asgn.*,
                    atch.attachment_type,
                    atch.attachment_data
                    FROM Assignments AS asgn
                   LEFT JOIN Attachments AS atch
                   ON asgn.attachment_id = atch.attachment_id
                    `;
      const getValues = [];
      if (Object.keys(assignmentData).length != 0) {
            query += " WHERE "
        }
      for (const key in assignmentData) {
        if (assignmentData.hasOwnProperty(key)) {
            if(key == "title")
            getValues.push(`asgn.${key} LIKE "%${assignmentData[key]}%"`);
            else
            getValues.push(`asgn.${key} = "${assignmentData[key]}"`);
        }
      }

      query += getValues.join(" AND ");

      console.log(query);

      const data = await Query(query);
      return data;
    } catch (error) {
      console.log("Error in Get assignment query : ", error.message);
      throw error;
    }
  };



  update = async (id, assignmentData) => {
    try {
      let query = `UPDATE Assignments SET `;
      const updateValues = [];

      for (const key in assignmentData) {
        if (assignmentData.hasOwnProperty(key)) {
          updateValues.push(`${key} = "${assignmentData[key]}"`);
        }
      }

      query += updateValues.join(", ");
      query += ` WHERE assignment_id = '${id}'`;

      console.log(query);

      const data = await Query(query);
      return data.affectedRows > 0;
    } catch (error) {
      console.log("Error in Updating assignment query : ", error.message);
      throw error;
    }
  };

  delete = async (assignment_id, assigned_by_id) => {
    try {
      const deleteAttachmentQuery = `
             DELETE FROM Attachments WHERE attachment_id IN (
                SELECT attachment_id FROM Assignments WHERE assignment_id = "${assignment_id}"
        );
          `;
      await Query(deleteAttachmentQuery); // Delete associated attachments first

      const deleteAssignmentQuery = `
            DELETE FROM Assignments WHERE assignment_id = "${assignment_id}" AND assigned_by = "${assigned_by_id}"; 
          `;
      const data = await Query(deleteAssignmentQuery);
      return data.affectedRows > 0;
    } catch (error) {
      console.log("Error in Deleting assignment query : ", error.message);
      throw error;
    }
  };

  findById = async (assignment_id) => {
    try {
      const query = `
            SELECT * FROM Assignments WHERE assignment_id = "${assignment_id}";
          `;

      const data = await Query(query);

      return data;
    } catch (error) {
      console.log("Error in findById assignment query : ", error.message);
      throw error;
    }
  };
}
export default Assignment;
