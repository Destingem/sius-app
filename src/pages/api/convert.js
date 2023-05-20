import axios from 'axios';
import { PDFExtract } from 'pdf.js-extract';

const options = {
  direct: true,
  html: true,
};

const pdfExtract = new PDFExtract();

const calculateSum = async (url) => {
  const { data } = await axios.get(url, { responseType: 'arraybuffer' });
  const pdf = await pdfExtract.extractBuffer(data, options);

  const text = pdf.pages
    .map((page) => page.content.map((item) => item.str).join('\n'))
    .join('\n');

  const decimalNumberPattern = /^\d*\.\d+$/;

  const numbers = text
    .split('\n')
    .map((line) =>
      line.split(' ').map((word) => {
        if (decimalNumberPattern.test(word) && parseFloat(word) <= 10.9) {
          return Math.floor(parseFloat(word));
        }
        return null;
      })
    )
    .flat()
    .filter((num) => num !== null);

  const total = numbers.reduce((a, b) => a + b, 0);

  return { total, numbers };
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { url } = req.body;

    try {
      const result = await calculateSum(url);

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: 'Something went wrong.' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed.' });
  }
}
