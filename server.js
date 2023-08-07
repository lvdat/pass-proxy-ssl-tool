import express from 'express'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import logger from 'morgan'
import axios from 'axios'

const app = express()
dotenv.config()

const port = process.env.SERVER_PORT || 3000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(logger('dev'))

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0

app.get('/fetch', async(req, res) => {
    try {
        const { url } = req.query;

        if (!url) {
            return res.status(400).json({ error: 'Vui lòng cung cấp URL' });
        }

        const response = await axios.get(url);

        return res.json(response.data);
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'Đã có lỗi xảy ra' });
    }
})

app.post('/fetch', async(req, res) => {
    try {
        const { url, headers, data } = req.body;

        if (!url) {
            return res.status(400).json({ error: 'Vui lòng cung cấp URL' });
        }

        const axiosConfig = {
            method: 'post',
            url: url,
            headers: headers || {}, // Sử dụng headers đã được cung cấp hoặc một object trống nếu không có
            data: data || {}, // Sử dụng data đã được cung cấp hoặc một object trống nếu không có
        };

        const response = await axios(axiosConfig);

        return res.json(response.data);
    } catch (error) {
        return res.status(500).json({ error: 'Đã có lỗi xảy ra' });
    }
});

app.use('/', (req, res) => {
    res.send({
        message: "Hello",
    })
})

app.listen(port, () => {
    console.log(`Service running on port ${port}`)
})