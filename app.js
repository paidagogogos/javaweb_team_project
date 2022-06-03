const express = require("express");
const morgan = require("morgan");
const mysql = require("mysql2");
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const { resolve } = require("path");

const port = 3000;
const app = express();

let sql =
  "INSERT INTO coretask (Core, Task1, Task2, Task3, Task4, Task5) VALUES(?, ?, ?, ?, ?, ?)";

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/", express.static(path.join(__dirname, "public")));
app.use("/chart", express.static(__dirname + "/chart"));
app.use("/css", express.static(__dirname + "/css"));
app.use("/font", express.static(__dirname + "/font"));
app.use("/client", express.static(__dirname + "/client"));

const con = mysql.createConnection({
  host: "35.222.15.137",
  user: "root",
  password: "dongdong7458",
  database: "javadatabase",
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Database Connected");
});

app.listen(port, () => console.log(`${port}번 포트에서 대기 중`));

try {
  fs.readdirSync("uploads");
} catch (error) {
  console.error("uploads 폴더가 없어 uploads 폴더를 생성합니다.");
  fs.mkdirSync("uploads");
}
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, "uploads/");
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname);
      done(null, path.basename(file.originalname, ext) + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "page.html"));
});

app.post("/upload", upload.single("file1"), (req, res) => {
  res.sendFile(path.join(__dirname, "graph.html"));
  fs.readFile("uploads\\inputFile.txt", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
  });

  var array1 = fs.readFileSync("uploads\\inputFile.txt").toString().split("\n");

  let result = [];

  for (let i = 0; i < array1.length; i++) {
    if (i % 7 !== 0 && i % 7 !== 6) {
      result.push(array1[i].trim().split("\t"));
    }
  }

  for (let j = 0; j < result.length; j++) {
    var params = [
      result[j][0],
      result[j][1],
      result[j][2],
      result[j][3],
      result[j][4],
      result[j][5],
    ];

    con.query(sql, params, function (err, rows, fields) {
      if (err) {
        console.log(err);
      } else {
        console.log(rows.insertId);
      }
    });
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(err.message);
});

app.get("/task/:task", async function (req, res, next) {
  let task = req.params.task;

  let minData = [];
  let maxData = [];
  let avgData = [];
  let sdData = [];

  let minQuery = `SELECT Core, MIN (${task}) FROM coretask GROUP BY Core`;
  let maxQuery = `SELECT Core, MAX (${task}) FROM coretask GROUP BY Core`;
  let avgQuery = `SELECT Core, AVG (${task}) FROM coretask GROUP BY Core`;
  let sdQuery = `SELECT Core, STDDEV (${task}) FROM coretask GROUP BY Core`;

  minData = await getMinTaskData(minQuery, task);
  maxData = await getMaxTaskData(maxQuery, task);
  avgData = await getAvgTaskData(avgQuery, task);
  sdData = await getSdTaskData(sdQuery, task);

  let chartData = {
    minData,
    maxData,
    avgData,
    sdData,
  };

  res.send(chartData);
});

function getMinTaskData(minQuery, task) {
  return new Promise((resolve, reject) => {
    con.query(minQuery, function (err, result) {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        let minData = [];
        for (let k = 0; k < result.length; k++) {
          minData.push(result[k][`MIN (${task})`]);
        }

        resolve(minData);
      }
    });
  });
}

function getMaxTaskData(maxQuery, task) {
  return new Promise((resolve, reject) => {
    con.query(maxQuery, function (err, result) {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        let maxData = [];
        for (let k = 0; k < result.length; k++) {
          maxData.push(result[k][`MAX (${task})`]);
        }

        resolve(maxData);
      }
    });
  });
}

function getAvgTaskData(avgQuery, task) {
  return new Promise((resolve, reject) => {
    con.query(avgQuery, function (err, result) {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        let avgData = [];
        for (let k = 0; k < result.length; k++) {
          const tmp = parseFloat(result[k][`AVG (${task})`]);
          avgData.push(tmp);
        }

        resolve(avgData);
      }
    });
  });
}

function getSdTaskData(sdQuery, task) {
  return new Promise((resolve, reject) => {
    con.query(sdQuery, function (err, result) {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        let sdData = [];
        for (let k = 0; k < result.length; k++) {
          sdData.push(result[k][`STDDEV (${task})`]);
        }

        resolve(sdData);
      }
    });
  });
}

app.get("/core/:core", async function (req, res, next) {
  let core = req.params.core;

  let minData = [];
  let maxData = [];
  let avgData = [];
  let sdData = [];

  let minQuery = `SELECT MIN (Task1), MIN (Task2), MIN (Task3), MIN (Task4), MIN (Task5)  FROM coretask WHERE Core ="${core}"`;
  let maxQuery = `SELECT MAX (Task1), MAX (Task2), MAX (Task3), MAX (Task4), MAX (Task5)  FROM coretask WHERE Core ="${core}"`;
  let avgQuery = `SELECT AVG (Task1), AVG (Task2), AVG (Task3), AVG (Task4), AVG (Task5)  FROM coretask WHERE Core ="${core}"`;
  let sdQuery = `SELECT STDDEV (Task1), STDDEV (Task2), STDDEV (Task3), STDDEV (Task4), STDDEV (Task5) FROM coretask WHERE Core ="${core}"`;

  minData = await getMinCoreData(minQuery);
  maxData = await getMaxCoreData(maxQuery);
  avgData = await getAvgCoreData(avgQuery);
  sdData = await getSdCoreData(sdQuery);

  let chartData = {
    minData,
    maxData,
    avgData,
    sdData,
  };

  res.send(chartData);
});

function getMinCoreData(minQuery, core) {
  return new Promise((resolve, reject) => {
    con.query(minQuery, function (err, result) {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        let minData = [];
        for (let k = 0; k < 5; k++) {
          minData.push(result[0][`MIN (Task${k + 1})`]);
        }

        resolve(minData);
      }
    });
  });
}

function getMaxCoreData(maxQuery) {
  return new Promise((resolve, reject) => {
    con.query(maxQuery, function (err, result) {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        let maxData = [];
        for (let k = 0; k < 5; k++) {
          maxData.push(result[0][`MAX (Task${k + 1})`]);
        }

        resolve(maxData);
      }
    });
  });
}

function getAvgCoreData(avgQuery) {
  return new Promise((resolve, reject) => {
    con.query(avgQuery, function (err, result) {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        let avgData = [];
        for (let k = 0; k < 5; k++) {
          const tmp = parseFloat(result[0][`AVG (Task${k + 1})`]);
          avgData.push(tmp);
        }

        resolve(avgData);
      }
    });
  });
}

function getSdCoreData(sdQuery) {
  return new Promise((resolve, reject) => {
    con.query(sdQuery, function (err, result) {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        let sdData = [];
        for (let k = 0; k < 5; k++) {
          sdData.push(result[0][`STDDEV (Task${k + 1})`]);
        }

        resolve(sdData);
      }
    });
  });
}
