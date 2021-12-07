/* eslint-disable no-param-reassign */
/* eslint-disable eqeqeq */
/* eslint-disable no-return-assign */
import express, { response } from 'express';
import cors from 'cors';
import { uuid } from 'uuidv4';

const app = express();

app.use(express.json());
app.use(cors());

let products = [];

app.get('/products', (req, res) => {
  res.json(products)
});

app.post('/products', (req, res) => {
  const { code, description, buyPrice, sellPrice, tags } = req.body;

  const existCode = products.find((v) => v.code == code);
  const lov = existCode ? existCode.lovers : 0;

  const product = {
    id: uuid(),
    code,
    description,
    buyPrice,
    sellPrice,
    tags,
    lovers: lov
  };

  products.push(product);

  res.status(201).json(product)

});

app.put('/products/:id', (req, res) => {
  const { id } = req.params;

  const { description, buyPrice, sellPrice, tags } = req.body;

  const existId = products.find((v) => v.id == id);
  if(existId) {
    existId.description = description;
    existId.buyPrice = buyPrice;
    existId.sellPrice = sellPrice;
    existId.tags = tags;
  
    res.json(existId);
  }else {
    response.status(400).send();
  }

});

app.delete('/products/:code', (req, res) => {
  const { code } = req.params;

  const index = products.findIndex((v) => v.code === code);

  if(index == -1) {
    res.status(400).send();
  }else {
    products = products.filter((v) => v.code !== code);
    res.status(204).send();
  }

});

app.post('/products/:code/love', (req, res) => {
  const { code } = req.params;

  const codeExist = products.find((v) => v.code == code)

  if(!codeExist) {
    res.status(400).send()
  }else {
    products.filter((v) => v.code == code)
    .map((val) => val.lovers += 1);

    res.json({lovers: codeExist.lovers})
  }
});

export default app;
