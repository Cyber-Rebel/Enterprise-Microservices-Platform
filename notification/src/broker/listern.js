const { subscribeToQueue } = require("./broker")
const {sendEmail} = require("../email.js")

module.exports = function() {
    // Listen for events and handle them
    subscribeToQueue('Auth_Notification.USER_CREATED', async (data) => {
        console.log("Received data from queue in notification service", data)
        sendEmail(
            data.email,
            'Welcome to Our Service',
            `Hello ${data.email}, welcome to our service! We're glad to have you on board.`,
            `<h1>Hello ${data.email},</h1><p>Welcome to our service! We're glad to have you on board.</p>`
        )   
        // send email to user
    })
    subscribeToQueue('Product_Notification.PRODUCT_CREATED', async (data) => {
        console.log("Received data from queue in notification service", data)
        sendEmail(
            data?.sellerEmail,
            'Your Product is Live!',
            `Hello ${data?.email}, your product "${data?.title}" is now live on our platform.`,
            `<h1>Hello ${data?.email},</h1><p>Your product "<strong>${data?.title}</strong>" is now live on our platform.</p>`
        )   
        // send email to seller
    })
}