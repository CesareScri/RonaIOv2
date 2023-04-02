
import express from 'express';
import Datastore from'nedb';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const database = new Datastore('linksDatabase.db');
database.loadDatabase();

const databaseServer = new Datastore('DiskStore.db');
databaseServer.loadDatabase();



  
const app = express();
app.use(express.static("storage"));
app.use(express.static("public"));
app.use(express.json({ limit: "1mb" }));


const porta = process.env.PORT || 8080 

app.listen(porta, () =>{
    console.log('Server runing on port: '+porta)
})

app.post("/create-link", (request, response) => {
    const url = request.body.url

    function makeid(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
          counter += 1;
        }
        return result;
    }

    const randomId = makeid(7)

    database.insert({origin: url, short: `https://rona.li/${randomId}`, itemId: randomId})

    response.json({success: true, msg: 'Successfully created!', link: `https://rona.li/${randomId}`})
});

app.get("/:idLink", (request, response) => {
    const idLink = request.params.idLink


    database.find({itemId: idLink}, (err, data) => {
        if (data.length == 1) {
            response.redirect(data[0].origin)
        } else {
            fs.readFile('./public/404.html', function (err, html) {
                if (err) {
                    throw err; 
                } 
                    response.writeHeader(404, {"Content-Type": "text/html"});  
                    response.write(html);  
                    response.end();  
                
            });   
        
        };
    
    })
});

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + '/storage');
    },
    // Sets file(s) to be saved in uploads folder in same directory
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
    // Sets saved filename(s) to be original filename(s)
  });

  const upload = multer({ storage: storage })


app.post('/upload', upload.single('file'), (req, res) => {
    
    console.log(req.body); // display information about the uploaded file
    console.log(req.file)

    function makeid(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
          counter += 1;
        }
        return result;
    }

    const randomIds = makeid(10)
    databaseServer.insert({fileName: req.file.originalname, path: req.file.path, size: req.file.size, idDow: randomIds , type: req.file.mimetype})
    res.json({status: 'File uploaded successfully!',fileName: req.file.originalname, size: req.file.size, donwloadPage: `https://rona.li/d/${randomIds}`});
  });

  app.get('/d/:idDownload', (req, res) => {

    var idD = req.params.idDownload


    databaseServer.find({idDow: idD}, (err, data) => {
        if (data.length == 1) {
            
            let info = data[0]
            const filePath = data[0].path;
             const fileName = data[0].fileName;
              res.setHeader('Content-Disposition', 'attachment; filename=' + fileName);
              res.setHeader('Content-Type', data[0].type);
            const fileStream = fs.createReadStream(filePath);
              fileStream.pipe(res);
        } else {
            res.json({
                status: 'File not found!'
            })
        }
    })

    
  });

  const noteDataBase = new Datastore('notes.db');
  noteDataBase.loadDatabase();



  app.post("/create-note", (request, response) => {

    const title = request.body.title
    const body = request.body.body

    function makeid(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
          counter += 1;
        }
        return result;
    }

    const randomId = makeid(8)

    noteDataBase.insert({title: title, body: body, link: `https://rona.li/n/${randomId}`, itemId: randomId})

    response.json({success: true, msg: 'Successfully created!', link: `https://rona.li/n/${randomId}`})
});


app.get("/n/:idN", (request, response) => {
    const idN = request.params.idN
    noteDataBase.find({itemId: idN}, (err, data) => {
        if (data.length == 1) {
            const bodyDB =  data[0]  
            response.write(`<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Rona.li | ${bodyDB.title}</title>
                <link rel="stylesheet" href="https://rona.li/style.css">
            </head>
            <body>
                <nav>
                    <lord-icon
                    src="https://cdn.lordicon.com/xtpmscgz.json"
                    trigger="hover"
                    delay="5000"
                    style="width:90px;height:90px">
                     </lord-icon>
                    <h1>Rona.<span>io</span></h1>
                </nav>
                <main>
                    <div class="container result" style="display: flex;">
                        <div class="note-rslt">
                            <div class="note-rslt-title">
                                <h4 id="tb">${bodyDB.title}</h4>
                            </div>
                            <div class="note-rslt-body">
                                <p id="bb">${bodyDB.body}</p>
                            </div>
                        </div>
                    </div>
                </main>
            </body>
            <script src="https://cdn.lordicon.com/ritcuqlt.js"></script>
            </html>`);
            response.end()
        } else {
            fs.readFile('./public/404.html', function (err, html) {
                if (err) {
                    throw err; 
                } 
                    response.writeHeader(404, {"Content-Type": "text/html"});  
                    response.write(html);  
                    response.end();  
                
            });
        };
    
    })
});
