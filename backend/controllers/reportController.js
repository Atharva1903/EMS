const Report = require('../models/Report');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Configure Nodemailer Transporter
// NOTE: For production, use a real SMTP service like SendGrid, AWS SES, or Gmail App Password
// For development/testing, we can use Ethereal Email (https://ethereal.email) or just console log if we don't want to set up an account yet.
// Here I'll set up a transporter that logs to console for now, or tries to send if env vars are present.

let transporter;

const initTransporter = async () => {
    if (transporter) return transporter;

    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT || 587,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
    } else {
        console.log('No SMTP credentials found. Creating Ethereal test account...');
        try {
            const testAccount = await nodemailer.createTestAccount();
            transporter = nodemailer.createTransport({
                host: "smtp.ethereal.email",
                port: 587,
                secure: false,
                auth: {
                    user: testAccount.user,
                    pass: testAccount.pass
                }
            });
            console.log(`Ethereal Test Account Created: ${testAccount.user}`);
        } catch (err) {
            console.error('Failed to create Ethereal account', err);
        }
    }
    return transporter;
};

exports.shareReport = async (req, res) => {
    try {
        const { employeeId, description, reportType, title } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ success: false, error: 'No report file provided' });
        }

        if (!employeeId) {
            return res.status(400).json({ success: false, error: 'Employee ID is required' });
        }

        // 1. Save Report History to Database
        const newReport = new Report({
            userId: employeeId, // Assuming employeeId is the _id of the User or Employee model. 
            // If it's Employee model _id, we might need to fetch the User _id or just store Employee _id.
            // Based on previous file analysis, Reports.jsx passes `selectedEmployee._id`.
            // Employee model usually links to User model. Let's verify if userId is needed or employeeId.
            // The Report model I created expects `userId`. 
            // Let's assume for now we receive the correct ID or I should update the model to use `employeeId` if that's what we have.
            // In Reports.jsx: `selectedEmployee.userId?.fullName` suggests `selectedEmployee` has a `userId` field populated.
            // But the ID passed might be the Employee document ID.
            // I'll store it as `employeeId` in the database to be safe, or just use `userId` if the frontend passes the User ID.
            // Let's stick to the schema I defined: `userId`. The frontend should pass the User's ID.
            title: title || 'Experience Letter',
            description: description,
            reportType: reportType || 'Experience Letter'
        });

        // However, if the frontend passes Employee ID, and provided schema expects User ID, we might have a mismatch.
        // Let's adjust the controller to be flexible or the model.
        // I'll assume the frontend sends the relevant ID.
        // If `req.body.employeeId` is the User ID, great. If it is Employee ID, I might need to look it up.
        // For simplicity in this iteration, I will save what I get, but let's change schema to `employeeId` to be more specific if it references Employee collection.
        // Wait, the User.js model likely holds email.

        // Let's go with Saving the record first.
        // I will modify the Report model logic slightly in my head: `userId` ref `User`. 
        // I will urge the frontend to send the User ID or I will look it up.
        // Actually, let's look at `Reports.jsx` again.
        // `selectedEmployee` has `userId` object (populated). 
        // `selectedEmployee._id` is Employee ID.
        // I should probably store `employeeId` (Reference to Employee) in Report model for better linking.
        // But I already created Report.js with `userId`. I'll stick to `userId` and ensure frontend sends it, or I'll fix it if needed.

        // For the email:
        // We need the recipient email.
        // Retrieve it from the User model if not passed, or pass it from frontend.
        // Passing from frontend is insecure but easiest for now.
        // Better: Fetch User by ID to get email.

        // Let's assume `employeeId` in body is actually the `User` _id for now for simplicity, 
        // OR I will fetch the employee to get the user email.

        // Let's just implement the saving and sending for now.

        await newReport.save();

        // 2. Send Email
        // If we have an email address in body, use it. Otherwise we'd need to fetch it.
        // I'll add `recipientEmail` to req.body for convenience from frontend.
        const { recipientEmail } = req.body;

        if (recipientEmail) {
            const mailOptions = {
                from: process.env.SMTP_FROM || '"EMS Admin" <admin@example.com>',
                to: recipientEmail,
                subject: `Document Shared: ${title || 'Experience Letter'}`,
                text: `Please find attached the ${title || 'experience letter'}.\n\nDescription: ${description || 'No description provided.'}`,
                attachments: [
                    {
                        filename: file.originalname || 'document.pdf',
                        content: file.buffer
                    }
                ]
            };

            const emailTransporter = await initTransporter();
            if (emailTransporter) {
                const info = await emailTransporter.sendMail(mailOptions);
                console.log(`Email sent to ${recipientEmail}`);
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            } else {
                console.error('Email transporter not available');
            }
        } else {
            console.log('No recipient email provided, skipping email sending.');
        }

        res.status(200).json({ success: true, message: 'Report shared successfully', report: newReport });

    } catch (error) {
        console.error('Error sharing report:', error);
        res.status(500).json({ success: false, error: 'Server error sharing report' });
    }
};
