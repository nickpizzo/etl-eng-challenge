const express = require("express");
const path = require("path");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const csv = require("csvtojson");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(fileUpload());
app.use("/public", express.static(__dirname + "/public"));

const csvWriter = createCsvWriter({
  path: "public/mapped/mapped.csv",
  header: [
    { id: "SignUpDate", title: "created_at" },
    { id: "First", title: "first_name" },
    { id: "Last", title: "last_name" },
    { id: "Email", title: "email" },
    { id: "Latitude", title: "latitude" },
    { id: "Longitude", title: "longitude" },
    { id: "IP", title: "ip" }
  ]
});

app.post("/upload", (req, res, next) => {
  let csvFile = req.files.file;

  csvFile.mv(`${__dirname}/public/${req.body.filename}.csv`, function(err) {
    if (err) {
      return res.status(500).send(err);
    }
    res.json({ file: `public/${req.body.filename}.csv` });
  });

  let csvToTransform = `public/${req.body.filename}.csv`;

  csv()
    .fromFile(csvToTransform)
    .then(function(jsonArrayObj) {
      csvWriter
        .writeRecords(jsonArrayObj)
        .then(() => console.log("The CSV file was written successfully"));
    });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app.listen(8000, () => {
  console.log("8000");
});

module.exports = app;
