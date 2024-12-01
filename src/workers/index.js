export default async (job) => {
  const workerName = job.name.split('-')[1]

  // console.log(s)
  // console.log(`\t${job.id}`)
  // console.log(`\t${job.name}`)
  // console.log(`\n\n\n\t\t------- ${JSON.stringify(job.data, null, 1)} -------\n`);
  // if (workerName === 'mailer') {
  //   // mailerWorker(job)
  //   console.log('yo')
  // }
  return false
}
