import dotenv from 'dotenv'
dotenv.config();

interface Config{
    port: number
}

const config: Config= {
    port : Number(process.env.PORT) || 6122
}

export default config
