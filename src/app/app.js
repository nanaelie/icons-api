import express from 'express';
import sharp from "sharp";
import path from 'path';
import api from "../api/index.js";
import middlewares from '../middlewares.js';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(helmet());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: 'It\'s working...',
    });
});

const ICONS_DIR = path.resolve(process.cwd(), "src/icons");

const ICONS_MAP = {
    facebook: 'facebook-1.svg',
    instagram: 'instagram.svg',
    react: 'react.svg',
    python: 'python.svg',
}

// export type IconName = keyof typeof ICONS_MAP;
// export type IconProps = {
//     name: IconName;
// }

app.get('/:stack', (req, res) => {
    const { stack } = req.params;

    
    if (!stack) {
        return null;
    }
    
    const platform = stack;
    const name = ICONS_MAP[platform];
    const filePath = path.join(ICONS_DIR, name);

    if (filePath) {
        sharp(filePath)
            .resize(40, 40)
            .toBuffer()
            .then((buffer) => {
                res.type('svg').send(buffer);
            })
            .catch((err) => {
                console.error(err);
                res.status(500).json({ error: "Internal server error" });
            });
    } else {
        res.status(404).json({ error: "Stack not found" });
    }
});

app.use('/api/v1', api);
app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;