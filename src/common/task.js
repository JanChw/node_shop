import { Queue, Worker } from 'bullmq'
import { resize, sizes } from '../utils/convert.js'
import { mc } from './minio.js'
import { v4 as uuid } from 'uuid'
import { sendMail } from './mail.js'
import { redis } from '../db/index.js'

const connection = {
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
}

const QueueID = 'node-shop'

export const tasks = new Queue(QueueID, {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'fixed',
      delay: 1000 * 30,
    },
  },
})

const work = new Worker(QueueID, async job => {

   const { name } = job
   name === 'resize' && resizeTask(job)

   name === 'rm_imgs' && removeImgsTask(job)

   name === 'send_mail' && sendMailTask(job)


   }
    ,{ connection })

    work.on('failed', (job, err) => {
      global.logger.error(`Job ${job.name} - ${job.id} has failed with ${err}`)
    })

    work.on('completed', (job, result) => {
      
      global.logger.info(`Job ${job.name} - ${job.id} has completed`)
    })

    async function resizeTask(job){
      const { path } = job.data
      const [filename, extname] = path.split('.')
      const url = `${process.env.MINIO_BASE_URL}/${path}`
  
      const res = await fetch(url)

      const arrBuffer = await res.arrayBuffer()
     
      if (!res.ok) {
        throw new Error('failed to fetch from task resize')
      }
  
      const buffers = await resize(arrBuffer)
  
      buffers.forEach(async (pms) => {
        
          const { data, special } = await pms
          
          await mc.putObject('node-shop', `${filename}-${special}.${extname}`, data, data.length, {
            'Content-Type': `image/${extname}`
          })
      })
    }

    function removeImgsTask(job){
      const { path } = job.data
      const [filename, extname] = path.split('.')
      const filePaths = sizes.map(val => `${filename}-${val}.${extname}`)

      filePaths.map(async (path) => {
        mc.removeObject('node-shop', path).catch(global.logger.error)
      })

    }

    //TODO:完善邮件模板

    function sendMailTask(job){
      const { email } = job.data
      const code = uuid()
      redis.set(`email:unactivated:${code}`, email, 'EX', 60 * 60)
      const href = `http://localhost:3000/v1/api/auth/verify/email/${code}`
      sendMail(email, href).then(() => logger.info('邮件发送成功')).catch(logger.error)

    }
