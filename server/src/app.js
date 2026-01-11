import express from 'express';
import cors from "cors";
import cookieParser from 'cookie-parser';

const app = express();
app.set("trust proxy", 1);
app.use(express.json());
const allowedOrigins = process.env.CORS_ORIGIN?.split(",");

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed"));
    }
  },
  credentials: true
}));

app.use(cookieParser())


// import routes
import userRouter from './routes/userAuth.routes.js';
import uploadRouter from './routes/upload.routes.js'
import insightRouter from './routes/insight.routes.js'

// import Admin routes
import adminRouter from './admin/routes/adminAuth.routes.js'
import adminData from './admin/routes/admindata.routes.js'

//user routes

app.use('/api/v1/user', userRouter);
app.use('/api/v1/file', uploadRouter)
app.use('/api/v1/insight', insightRouter)

//admin routes
 app.use('/api/v1/admin', adminRouter);
 app.use('/api/v1/data', adminData);

export { app };
