import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';

import apiRoutes from './routes/index.js';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware.js';
import { UPLOADS_DIR } from './middlewares/upload.middleware.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3000' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Los documentos (pliegos de licitación, propuestas) se sirven de forma
// estática para que el portal ciudadano pueda descargarlos y verificarlos.
app.use('/uploads', express.static(UPLOADS_DIR));

app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api', apiRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`BitWhite backend escuchando en http://localhost:${PORT}`);
});
