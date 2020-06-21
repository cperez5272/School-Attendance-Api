# School Attendance App

Live Link: 
school-attendance-app.cperez5272.now.sh

Summary
- This app is used for students who are in a after school program to sign their name in a laptop as a way to mark their attendance. This is important so staff members can know what students they have during the day. They can check based on a student grade level or just look at an entire list of students who signed up for the day. This is better than them using a sheet of paper because if they ever need confirmation that someone has come in today they can just use their phone. 

![attendance1](https://user-images.githubusercontent.com/50935039/85228429-6c8d3c00-b3b1-11ea-815a-bf4298571446.png)

- This will be the main page where students will sign in with their name depending on what grade level they are in. This tool is used so that staff can also see how many students they have and sign them in themselves if it is nessesary. 

![attendance2](https://user-images.githubusercontent.com/50935039/85228491-a3635200-b3b1-11ea-9764-2025e803e773.png)

- This is where students will sign their names in. Once they submit, their name will be listed depending on the grade level they have chosen. 

![attendance3](https://user-images.githubusercontent.com/50935039/85228510-bfff8a00-b3b1-11ea-9587-bdfa15e677e6.png)

- Home where staff members can see all students instead of checking by grade. This is the place where if they need to document the student on paper, they can get everyone in one spot. It is also the same place where they can clear the attendance for a new day if needed. 

Technology Used: React, CSS, Node, Express, and PostgreSQL.

API DOCUMENTATION: 

Get Student Data:

URL: /students
METHOD: GET
Auth required : NO

Success Response: If you have a list of students, for example; Jake Roberts and Linda Prince...
Code : 200 OK
Content :
 {
            "id": 11,
            "first_name": "Jake"
            "last_name": "Roberts"
            "Grade": 6
        },
 {
            "id": 11,
            "first_name": "Linda"
            "last_name": "Prince"
            "Grade": 7
        }

Error Response: If you do not have any students listed it will just remain blank or rather just [].

===

Post Student Data: 

URL: /students
METHOD: POST
Auth required : NO

Required Fields: Once you try to head to the form it is important that you type the first_name of the student and their last_name. 

Success Response: 
Code: 200 OK
 {
            "id": 11,
            "first_name": "Sample"
            "last_name": "Example"
            "Grade": 6
        },

Error Response (misses first name for example): 
{
    "error": {
        "message": "Missing 'first_name' in request body"
    }
}

===

URL: /remove-students

Method : DELETE

Auth required : NO

Success Response
Condition : If the list of students exists.

Code: 204 NO CONTENT

Content: {}

Error Response: You would need a list of students first to remove anything. Clicking clear attendance would do nothing if there are no students. 
