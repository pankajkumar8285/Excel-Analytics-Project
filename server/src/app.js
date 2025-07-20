import express from 'express';
import cors from "cors";
import cookieParser from 'cookie-parser';

const app = express();
app.use(express.json());
app.use(cors({
  origin: process.env.CORS_ORIGIN ,
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