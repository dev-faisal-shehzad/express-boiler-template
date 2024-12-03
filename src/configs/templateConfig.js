import ejs from 'ejs'
import fs from 'fs'
import path from 'path'
import { mailer } from './mailerConfig.js'

const __dirname = new URL('.', import.meta.url).pathname

const getImageAsBase64 = (imageName) => {
    const imagePath = path.join(__dirname, '../assets/images', imageName);
    const image = fs.readFileSync(imagePath)
    return `data:image/png;base64,${image.toString('base64')}`
}

const renderHtmlTemplate = (templateName, data) => {
    const templatePath = path.join(__dirname, '../templates/', `${templateName}`)
    const templateContent = fs.readFileSync(templatePath, 'utf-8')

    return ejs.render(templateContent, data)
}

const sendEmail = async (to, subject, data, templateName, attachments) => {
    const html = renderHtmlTemplate(templateName, data)
    const text = 'This email client does not support HTML.'

    const mailOptions = { from: process.env.MAILER_USERNAME, to, subject, text, html, attachments }

    try {
        await mailer.sendMail(mailOptions)
    } catch (error) {
        console.error('Error sending email:', error)
    }
}

export default sendEmail