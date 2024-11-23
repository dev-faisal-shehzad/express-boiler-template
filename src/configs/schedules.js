const scheduleList = [
    {
        queueName: 'mailerQueue',
        jobName: 'dailyReportJob',
        jobData: { reportType: 'daily' },
        cronExpression: '0 8 * * *' // Run every day at 8 AM
    }
]

export default scheduleList