import mailerWorker from "./mailerWorker"
export default async (job) => {
    const workerName = job.type.split('-')[0]

    if (workerName === 'mailer') {
        mailerWorker(job)
    }
    return true
}