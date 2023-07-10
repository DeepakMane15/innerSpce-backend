const mongoose = require('mongoose')

async function connectDB() {
    try {
        mongoose.set('strictQuery', false)
        const connection=await mongoose.connect(process.env.dbUrl ,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                retryWrites: false
            }).catch(err => { console.log(err); });
        // console.log(connection)

    } catch (error) {
        console.log(error)
        process.exit()
    }
}

module.exports = connectDB
