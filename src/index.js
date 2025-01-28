import express from 'express';
import { createServer } from 'http';
import socketIOConfig from './config/socketIO.js';
import dotenv from 'dotenv';
import { router } from './routes/route.js';
//import { seedData } from './utils/seed.js';

dotenv.config();
const PORT = process.env.PORT;

const app = express();
const server = createServer(app);
socketIOConfig.initSocket(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT'],
    },
});

app.use(express.json());
app.use('/api/v1/messages', router);

//seedData();

server.listen(PORT, () => console.log(`server listerening on port ${PORT}`));
