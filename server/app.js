const path = require("path");
const fs = require("fs");
const http = require("http");
const { Server } = require("socket.io");
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const multer = require("multer");
const cors = require("cors");
const cookieParser = require("cookie-parser");

require("dotenv").config();

const cartRoutes = require("./routes/cart");
const chatroomsRoutes = require("./routes/chatroom");
const checkoutRoutes = require("./routes/checkout");
const commentRoutes = require("./routes/comment");
const historiesRoutes = require("./routes/history");
const messengerRoutes = require("./routes/messenger");
const productsRoutes = require("./routes/product");
const usersRoutes = require("./routes/user");

//
const MONGODB_URI = `mongodb+srv://test:EfOZwRzsOaDH0KOw@cluster0.jnncur8.mongodb.net/web`;

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

const fileStore = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix =
      new Date().getTime() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

io.on("connection", (socket) => {
  console.log(`Connect ID: ${socket.id}`);

  socket.on("send_message", (data) => {
    io.emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("Disconnected!");
  });
});

app.set("io", io);

const allowedOrigins = [
  "https://njs-assignment03-git-main-lamkhiets-projects.vercel.app/", // URL của Client App trên Vercel
  "https://njs-assignment03-admin-q119xkhby-lamkhiets-projects.vercel.app", // URL của Admin App trên Vercel
  "http://localhost:3000", // Cho phép test dưới máy local
  "http://localhost:3001", // Cho phép test dưới máy local
];

app.use(
  cors({
    // origin: ["http://localhost:3000", "http://localhost:3001"],
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        return callback(null, true);
      }

      return callback(new Error("CORS Policy Error"), false);
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  multer({ storage: fileStore, fileFilter: fileFilter }).array("images", 5),
);
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(express.static(path.join(__dirname, "public")));
app.use("/dist", express.static(path.join(__dirname, "dist")));
app.use("/assets", express.static(path.join(__dirname, "assets")));

app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  }),
);

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  next();
});

app.use("/carts", cartRoutes);
app.use("/chatrooms", chatroomsRoutes);
app.use("/email", checkoutRoutes);
app.use("/comment", commentRoutes);
app.use("/histories", historiesRoutes);
app.use("/messenger", messengerRoutes);
app.use("/products", productsRoutes);
app.use("/users", usersRoutes);

//

const PORT = process.env.PORT || 5000;

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    httpServer.listen(PORT, () => {
      console.log(`Server is running on Port: ${PORT}`);
      console.log(`MongoDB Connection Established Successfully.`);
    });
  })
  .catch((err) => {
    console.error("Database Connection Error:", err);
  });
