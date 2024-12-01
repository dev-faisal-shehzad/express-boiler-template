import ejs from 'ejs'
import fs from 'fs'
import path from 'path'
import { mailer } from './mailerConfig.js'


const renderHtmlTemplate = (templateName, data, layoutName = 'layout') => {
    const templatePath = path.join(__dirname, '../templates/mailers', `${templateName}.html`)
    const layoutPath = path.join(__dirname, '../templates/layouts', `${layoutName}.html`)

    const templateContent = fs.readFileSync(templatePath, 'utf-8')
    const layoutContent = fs.readFileSync(layoutPath, 'utf-8')

    const body = ejs.render(templateContent, data)
    return ejs.render(layoutContent, { body, ...data })
}


const renderTextTemplate = (templateName, data) => {
    const templatePath = path.join(__dirname, '../templates/mailers', `${templateName}.text`)
    const templateContent = fs.readFileSync(templatePath, 'utf-8')

    return ejs.render(templateContent, data)
}

const sendEmail = async (to, subject, data, templateName, layoutName = 'layout') => {
    const html = renderTemplate('email', { templateName, subject })
    const text = renderTextTemplate(templateName, { name })

    const mailOptions = { from: '', to, subject, text, html }

    try {
        const mail = await mailer(mailOptions)
        console.log('Email sent: ' + mail.response)
    } catch (error) {
        console.error('Error sending email:', error)
    }
}

export default sendEmail
