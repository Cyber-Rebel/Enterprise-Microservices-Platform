const { subscribeToQueue } = require("./broker")
const {sendEmail} = require("../email.js")

module.exports = function() {
    // Listen for events and handle them
    subscribeToQueue('Auth_Notification.USER_CREATED', async (data) => {
        console.log("Received data from queue in notification service", data)
        sendEmail(
            data.email,
            'Welcome to Our Service',
            `Hello ${data.name}, welcome to our service! We're glad to have you on board.`,
            `<h1>Hello ${data.name},</h1><p>Welcome to our service! We're glad to have you on board.</p>`
        )   
        // send email to user
    })
}