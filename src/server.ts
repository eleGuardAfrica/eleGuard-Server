import app from './app'
import config from './config/config'
import { ConnectToDatabase } from './config/databaseconnection'

ConnectToDatabase();

app.listen(config.port, () => {
    console.log(`Server listening on Port ${config.port}`)
})