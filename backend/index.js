import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';

dotenv.config();
const app = express();
app.set('json spaces', 2);
app.use(express.json());

app.get('/', (req, res) => {
  res.send('TEST MIC');
});

app.use('/api', userRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});