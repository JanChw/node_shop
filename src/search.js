import { MeiliSearch } from 'meilisearch'

process.loadEnvFile('../.env.local')

const client = new MeiliSearch({
    host: process.env.MEILI_HOST,
    apiKey: process.env.MEILI_API_KEY
})

export default client


  