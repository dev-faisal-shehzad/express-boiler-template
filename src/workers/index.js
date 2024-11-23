import mailerWorker from "./mailerWorker"
export default async (job) => {
    const workerName = job.type.split('-')[0]

    console.log(`\n\t------- ${job.data} -------\n`)
    if (workerName === 'mailer') {
        // mailerWorker(job)
    }
    return true
}