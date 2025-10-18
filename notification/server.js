const app = require('./src/app')
require('dotenv').config();


app.listen(3006,()=>{
    console.log(`Notification service is running on port 3006`)
})