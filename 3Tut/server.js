const express = require('express')
const cors = require('cors')
const app = express()
const path = require('path')
const { logger } = require('./middleware/logEvents')
const errorHandler = require('./middleware/errorHandler')
const port = process.env.PORT || 3500

// built-in middleware for urlencoded data -- form data
app.use(express.urlencoded({extended:false}))
// built-in middleware for json data
app.use(express.json())
// built-in middleware to serve static files
app.use(express.static(path.join(__dirname,'./public')))


// Cross Origin Resource Sharing
const whitelist = ['http://localhost:3500','http://localhost:127.0.0.1:5500','https://www.yoursite.com']
const corsOptions = {
    origin:(origin,callback)=>{
        if(whitelist.indexOf(origin)!==-1||!origin ){
            callback(null,true)
        } else {
            callback(new Error('Not allowed by cors'))
        }
    },
    optionsSuccessStatus : 200
}
app.use(cors(corsOptions))
// custom middleware logger
app.use(logger)

app.get('^/$|index(.html)?',(req,res)=>{
    res.sendFile(path.join(__dirname,'views','index.html'))
})
app.get('/new-page(.html)?',(req,res)=>{
    res.sendFile(path.join(__dirname,'views','new-page.html'))
})
app.get('/old-page(.html)?',(req,res)=>{
    res.redirect(301,'new-page.html')
})
// Route Handler
app.get('/hello(.html)?',(req,res,next)=>{
    console.log('Attempted to load hello.html');
    next()
},(req,res)=>{
    res.send('Hello World!!!')
})
const one = (req,res,next)=>{
    console.log('One');
    next()
}
const two = (req,res,next)=>{
    console.log('Two');
    next()
}
const three = (req,res,next)=>{
    console.log('Three');
    res.send('Finished!!!')
}
app.get('/chain(.html)?',[one,two,three])
app.all('*',(req,res)=>{
    res.status(404)
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname,'views','404.html'))
    } else if(req.accepts('json')){
        res.json({error:'404 Not Found'})
    } else {
        res.type('text').send('404 Not Found')
    }
    
})
app.use(errorHandler)
app.listen(port,()=>{
    console.log(`Port is running on ${port}`);
})
