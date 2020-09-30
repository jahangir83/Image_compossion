
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const app = express()
const path = require('path')
const multer = require('multer')
const sharp = require('sharp')
const fs = require('fs')
const compression = require('compression')
const formatebe = require('formidable')

const storege = multer.diskStorage({
  destination: function (req, file, cd) {
    var dir = './upload'
    // if (fs.existsSync(dir)) {
    //   fs.mkdirSync(dir)
    // }
    cd(null, dir)
  },
  filename: function (req, file ,cd) {
    cd(null, file.originalname)
  }
  
}) 

const upload = multer({
  storage: storege
})
app.use(compression())
app.get('/',(req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'))
})

app.post('/' ,(req, res, next) =>{
  let compressedImageFile = path.join(__dirname, './public', 'image', new Date().getTime() +req.file.jahangir + '.jpeg')

  sharp(req.file.path).resize(640, 640).jpeg({
    quality: 80,
  }).toFile(compressedImageFile, (err, info) => {
    if (err) {
      res.send(err)
    } else {
      res.send(info)
    }
  })
})

// app.use('/public', express.static('/public'));
app.use("/public", express.static(__dirname + "/public"))

app.set('view engine', 'ejs');
app.set('views', 'views')
  
app.get('/file', (req, res) => {
  res.render('index')
})

app.post('/upload', (req, res, next) => {

  var formData = new formatebe.IncomingForm()
  formData.maxFieldsSize = 1024 * 1024 * 2
  formData.parse(req, function (error, filds, files) {
    
    var newPath = 'public/image/' + new Date().getTime() + "_" + files.jahangir.name + '.jpeg'

    // fs.rename(req.jahangir.path, newPath, (er) => {

    // })
     sharp(files.jahangir.path).resize(640, 640).jpeg({
    quality: 80,
  }).toFile(newPath, (err, info) => {
    if (err) {
      res.send(err)
    } else {
      res.render('index', {image: newPath})
    }
  })


  

  })
 


})

app.get('/jahangir', (req, res, next) => {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write('<form action="/upload" method="post" enctype="multipart/form-data">');
  res.write('<input type="file" name="jahangir"><br>');
  res.write('<input type="submit">');
  res.write('</form>');
  return res.end()
})

const PORT = process.env.PORT || 4000

        app.listen(PORT, () => {
            console.log(`Server is runnit ${PORT}`);
        })
