import dotenv from 'dotenv'
dotenv.config();

interface Config{
    port: number
}

const config: Config= {
    port : Number(process.env.PORT) || 2313
}

export default config