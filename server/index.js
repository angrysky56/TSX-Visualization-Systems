const express = require('express');
const cors = require('cors');
const { MilvusClient } = require('@zilliz/milvus2-sdk-node');

const app = express();
app.use(cors());
app.use(express.json());

const milvusClient = new MilvusClient('localhost:19530');

app.post('/api/milvus/connect', async (req, res) => {
    try {
        const health = await milvusClient.checkHealth();
        res.json({ status: 'connected', health });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/milvus/search', async (req, res) => {
    try {
        const { collection, vectors } = req.body;
        const searchResult = await milvusClient.search({
            collection_name: collection,
            vector: vectors,
            limit: 10,
            output_fields: ['*']
        });
        res.json(searchResult);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Milvus proxy server running on port ${PORT}`);
});