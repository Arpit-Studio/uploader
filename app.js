const express = require("express");
const formidable = require("formidable");
const path = require("path");
const fs = require("fs");
const session = require("express-session");
const flash = require("connect-flash");

const app = express();
app.set("views", path.join(__dirname, "views"));
const uploadDir = path.join(__dirname, "files");
app.set("view engine", "hbs");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
  })
);

// setup flash
app.use(flash());
app.get("/", (req, res) => {
  res.render("form", {
    success: req.flash("success"),
    error: req.flash("error"),
  });
});

app.post("/upload", (req, res) => {
  const form = formidable({
    multiples: true,
    uploadDir,
    keepExtensions: true,
    filename: (file, ext, event) => file + ext,
  });
  form.parse(req, (err, fields, files) => {
    if (err) {
      res.writeHead(err.httpCode || 400, { "Content-Type": "text/plain" });
      res.end(String(err));
      req.flash("error", "Error uploading file");
    } else {
      console.log("New Files Received!");
      req.flash("success", "File(s) uploaded");
    }
    res.redirect("/");
  });
});
app.get("/upload", (req, res) => {
  req.flash("error", "Direct access not allowed");
  res.redirect("/");
  return true;
});

app.listen(5000, () => {
  console.log("server started on port 5000");
});

