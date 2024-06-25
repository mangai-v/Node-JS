const {format} = require('date-fns')
const{v4:uuid} = require('uuid')
const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')

const logEvents = async(message,logName)=>{
    const dateTime = `${format(new Date(),'yyyyMMdd\tHH:mm:ss')}`
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`
    console.log(logItem);
    
    try {
        if(!fs.existsSync(path.join(__dirname,'..','logsFolder'))){
            await fsPromises.mkdir(path.join(__dirname),'..','logsFolder')
        }
        await fsPromises.appendFile(path.join(__dirname,'..','logsFolder',logName),logItem)
    } catch(err){
        console.log(err);
    }
}

const logger = (req,res,next)=>{
    logEvents(`${req.url}\t${req.method}\t${req.headers.origin}`,'reqLog.txt')
    console.log(`${req.url} ${req.path}`);
    next()
}
module.exports = {logEvents,logger}