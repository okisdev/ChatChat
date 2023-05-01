import { NextApiRequest, NextApiResponse } from 'next';

import formidable, { Files } from 'formidable';
import pdf from 'pdf-parse';
import fs from 'fs';

import { promisify } from 'util';

const readFileAsync = promisify(fs.readFile);

export const config = {
    api: {
        bodyParser: false,
    },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        try {
            const form = new formidable.IncomingForm();
            const data = await new Promise<Files>((resolve, reject) => {
                form.parse(req, (err, fields, files) => {
                    if (err) {
                        reject(err);
                        return;
                    } else
                        resolve({
                            file: files.file,
                        });
                });
            });

            const uploadedFile = data['file'];

            if (Array.isArray(uploadedFile)) {
                res.status(400).json({ error: 'Multiple files not supported' });
            } else {
                if (uploadedFile.mimetype?.includes('pdf')) {
                    const fileContentBuffer = await readFileAsync(uploadedFile.filepath);
                    const pdfData = await pdf(fileContentBuffer);
                    res.status(200).json({ text: pdfData.text });
                } else {
                    const fileContent = await readFileAsync(uploadedFile.filepath, 'binary');
                    const fileContentStr = Buffer.from(fileContent, 'binary').toString('utf-8');
                    res.status(200).json({ text: fileContentStr });
                }
            }
        } catch (error) {
            return res.status(500).json({ error: 'Error processing the file' });
        }
    } else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
};

export default handler;
