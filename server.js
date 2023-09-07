const fs = require('fs');
const express = require('express')
const multipart = require('connect-multiparty');

const app = express()
const multipartMiddleware = multipart();

app.use(express.static(__dirname + '/'));
const recordTextPath = './record_text.txt'


app.use((req, res, next) => {
    //设置请求头
    res.set({
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Max-Age': 1728000,
        'Access-Control-Allow-Origin': req.headers.origin || '*',
        'Access-Control-Allow-Headers': 'X-Requested-With,Content-Type',
        'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS',
        'Content-Type': 'application/json; charset=utf-8'
    })
    req.method === 'OPTIONS' ? res.status(204).end() : next()
})

app.get('/api/getReadText', (req, res) => {
    fs.readFile(recordTextPath, 'utf-8', (err, data) => {
        res.end(data)
    })
})

app.post('/api/saveFile', multipartMiddleware, (req, res) => {
    let name = req.body.name;    
    fs.readFile(req.files.data.path, (err, data) => {
        let user = name.split('_')[0]
        const dir = './audio/'+user;
        const filePath = dir+'/'+name
        if(!fs.existsSync(filePath)) {
            fs.readFile(recordTextPath, 'utf-8', (err, data) => {
                let newTextArr = data.split('\n')
                newTextArr.shift()
                let newText = newTextArr.join('\n')   
                fs.writeFile(recordTextPath, newText, err=>{
                    if (err) {
                        console.log(err);
                        return false;
                    }
                })
            })
        }
        if (fs.existsSync(dir)) {
            fs.writeFile(filePath, data, err => {
                if (err) {
                    console.log(err);
                    return false;
                }
                res.sendStatus(200);
            })
        } else {
            fs.mkdir(dir,()=>{
                fs.writeFile(filePath, data, err => {
                    if (err) {
                        console.log(err);
                        return false;
                    }
                    res.sendStatus(200);
                })
            })
        }      
    })
    
})

app.post('/api/upload', (req, res) => {
    // fs.readFile(recordTextPath, 'utf-8', (err, data) => {
        // res.header( 'Access-Control-Allow-Origin' , '*')
        res.end("okkk")
    // })
})

const os = require('os');
const ifaces = os.networkInterfaces(); //网络信息
let locatIp = '';
for (let dev in ifaces) {
    for (let j = 0; j < ifaces[dev].length; j++) {
        if (ifaces[dev][j].family === 'IPv4') {
            locatIp = ifaces[dev][j].address;
            break;
        }
    }
}

app.listen(8989)
console.log("App running at:")
console.log(" - Local:   http://localhost:8989")
console.log(` - Network: http://${locatIp}:8989`)


