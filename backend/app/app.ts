import express from 'express';
import cors from 'cors';
import passport from 'passport';
import userRoutes from './user/user.route';
import apikeyRoutes from './apikey/apikey.route';
import serviceRoutes from './service/service.route';
import appRoutes from './app/app.route';
const app = express();

app.use(cors());
app.use(express.json());
app.use(passport.initialize());



app.use('/api', userRoutes);
app.use('/api', apikeyRoutes);
app.use('/api', serviceRoutes);
app.use('/api', appRoutes);

export default app; 