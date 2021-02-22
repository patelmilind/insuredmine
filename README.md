<b>- To upload the attached XLSX/CSV data into MongoDB</b>
  - POST /api/upload 
    - form-data key='uploadfile' value=csv file
   
<b>- Search API to find policy info with the help of username</b>
  - POST /api/mypolicy 
    - raw JSON data {"username":"name of the use"}
    
<b>- post-service that takes the message, day, and time in body parameters and it inserts that message into DB at that particular day and time.</b>
  - POST /api/schedule
    - raw JSON data {"message":"your msg","day":"monday","time":"23:00:00"}
