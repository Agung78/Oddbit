import express from "express";
import path from "path";
import fs from "fs";

const app = express();
const port = 3001;

// app.get('/video', (req, res) => {
//   const videoPath = path.join(__dirname, '../OddbitConnect.mp4');
//   const stat = fs.statSync(videoPath);
//   const fileSize = stat.size;
//   const range = req.headers.range;

//   if (range) {
//     const [start, end] = range
//       .replace(/bytes=/, '')
//       .split('-')
//       .map((str) => parseInt(str, 10));
//     const chunkSize = (end || fileSize - 1) - start + 1;
//     const file = fs.createReadStream(videoPath, { start, end });

//     res.writeHead(206, {
//       'Content-Range': `bytes ${start}-${end || fileSize - 1}/${fileSize}`,
//       'Accept-Ranges': 'bytes',
//       'Content-Length': chunkSize,
//       'Content-Type': 'video/mp4',
//     });

//     file.pipe(res);
//   } else {
//     res.writeHead(200, {
//       'Content-Length': fileSize,
//       'Content-Type': 'video/mp4',
//     });
//     fs.createReadStream(videoPath).pipe(res);
//   }
// });

app.get("/video", (req, res) => {
  const videoPath = path.join(__dirname, "../public/OddbitConnect.mp4");
  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const [start, end] = range
      .replace(/bytes=/, "")
      .split("-")
      .map((str) => parseInt(str, 10));
    const chunkSize = (end || fileSize - 1) - start + 1;
    const file = fs.createReadStream(videoPath, { start, end });

    res.writeHead(206, {
      "Content-Range": `bytes ${start}-${end || fileSize - 1}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize,
      "Content-Type": "video/mp4",
    });

    file.pipe(res);
  } else {
    res.writeHead(200, {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4",
    });
    fs.createReadStream(videoPath).pipe(res);
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
