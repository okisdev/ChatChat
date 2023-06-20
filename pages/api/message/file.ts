import { NextApiRequest, NextApiResponse } from 'next';

import formidable, { Files } from 'formidable';
import pdf from 'pdf-parse';
import fs from 'fs';

import axios from 'axios';

import { promisify } from 'util';

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const { url } = req.query as { url: string };

        if (url) {
            try {
                const response = await axios.get(url, { responseType: 'arraybuffer' });
                const tempFilePath = `/tmp/${Date.now()}.pdf`;
                await writeFileAsync(tempFilePath, response.data);

                const fileContentBuffer = await readFileAsync(tempFilePath);
                const pdfData = await pdf(fileContentBuffer);
                return res.status(200).json({ url, text: pdfData.text });
            } catch (error) {
                return res.status(500).json({ error: 'Error processing the file' });
            }
        }

        return res.status(400).json({ error: 'Missing URL' });
    } else if (req.method === 'POST') {
        try {
            const form = new formidable.IncomingForm();
            const data = await new Promise<Files>((resolve, reject) => {
                form.parse(req, (err, fields, files) => {
                    if (err) {
                        reject(err);
                        return;
                    } else {
                        resolve({
                            file: files.file,
                        });
                    }
                });
            });

            const uploadedFile = data['file'];

            if (Array.isArray(uploadedFile)) {
                res.status(400).json({ error: 'Multiple files not supported' });
            } else if (uploadedFile.mimetype?.includes('pdf')) {
                const fileContentBuffer = await readFileAsync(uploadedFile.filepath);
                const pdfData = await pdf(fileContentBuffer);
                return res.status(200).json({ text: pdfData.text });
            } else {
                const fileContent = await readFileAsync(uploadedFile.filepath, 'binary');
                const fileContentStr = Buffer.from(fileContent, 'binary').toString('utf-8');
                return res.status(200).json({ text: fileContentStr });
            }
        } catch (error) {
            return res.status(500).json({ error: 'Error processing the file' });
        }
    } else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
}
