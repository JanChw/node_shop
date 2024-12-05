import { Queue, Worker } from 'bullmq'
import { resize, sizes } from '../utils/convert.js'
import { Readable } from 'node:stream'
import { mc } from './minio.js'

const connection = {
  host: 'localhost',
  port: 6379,
  password: '123456',
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
   name === 'resize' && await resizeTask(job)

   name === 'rm_imgs' && await removeImgsTask(job)


   }
    ,{ connection })

    work.on('failed', (job, err) => {
      global.logger.error(`Job ${job.id} has failed with ${err}`)
    })

    work.on('completed', (job, result) => {
      
      global.logger.info(`Job ${job.name}-${job.id} has completed`)
    })

    async function resizeTask(job){
      const { path } = job.data
      const [filename, extname] = path.split('.')
      const url = `http://localhost:9000/node-shop/${path}`
  
   
  
      const res = await fetch(url)
     
      const readStream = Readable.fromWeb(res.body)
      if (!res.ok) {
        throw new Error('failed to fetch from task resize')
      }
  
      const buffers = await resize(readStream)
  
      buffers.forEach(async (pms) => {
        
          const { data, special } = await pms
          
          await mc.putObject('node-shop', `${filename}-${special}.${extname}`, data, data.length, {
            'Content-Type': `image/${extname}`
          })
      })
    }

    export function removeImgsTask(job){
      const { path } = job.data
      const [filename, extname] = path.split('.')
      const filePaths = sizes.map(val => `${filename}-${val}.${extname}`)

      filePaths.map(async (path) => {
        mc.removeObject('node-shop', path).catch(gloal.logger.error)
      })

    }
