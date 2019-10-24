let ffmpeg = require('fluent-ffmpeg');
let fs = require('fs');
let http = require('http');

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

// create application/x-www-form-urlencoded parser
//var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.set('view engine', 'ejs');
app.use('/assets', express.static('assets'));
app.use('/dist', express.static('dist'));
app.use('/lib', express.static('lib'));
app.use('/src', express.static('scr'));
app.get('/', function (req, res) {
  // res.sendFile(__dirname + '/tmpl/index.html');
  res.render('video');
});

app.listen(3000);

//let inStream = fs.createReadStream('http://10.0.0.7:9271/stream/direct?client=1&channel=1:10743000:1:1051:28724&transcoder=mp4&client_id=1&bitrate=2048&scale=2&lng=eng');

let inStream = 'http://10.0.0.7:9271/stream/direct?client=1&channel=1:10743000:1:1051:28724';
let inFileName = 'in.ts';
let inWriteStream = fs.createWriteStream(inFileName);

let isRun = false;
/* let request = http.get(inStream, (d) => {
  d.on('data', (d) => {
    inWriteStream.write(d);
    console.log(getSize());
    if (getSize() > 5 && !isRun) {
      startDecode();
      isRun = true;
    }
  });
})
  .on('error', (e) => {
    console.error(e);
  }); */
function startDecode() {
  var infs = fs.createReadStream(inFileName);
  //ffmpeg -i input.ts -acodec copy -vcodec copy out.mp4
  ffmpeg('http://10.0.0.7:9271/stream/direct?client=1&channel=1:10743000:1:1051:28724')
/*     
    .outputFormat('mp4') */
    .outputOptions('-c:v libx264')
    .outputOptions('-g 52')
    .outputOptions('-movflags frag_keyframe+empty_moov')
    .outputOptions('-f mp4')
    .save('./assets/out.mp4');
  console.log('Decoding....');
}

startDecode();

function getSize() {
  let stats = fs.statSync(inFileName);
  let fileSizeInBytes = stats.size;
  let fileSizeInMegabytes = fileSizeInBytes / 1000000.0;
  //size in Mb
  return fileSizeInMegabytes;
}