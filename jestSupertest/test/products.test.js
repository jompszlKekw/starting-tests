/* eslint-disable no-undef */
import request from 'supertest';

import app from '../src/app';

let products;

beforeEach(() => {
  products = [{
    code: 12,
    description: 'macbook',
    buyPrice: 4000,
    sellPrice: 8000,
    tags: ["tecnolgia", "Apple", "computador"]
  }, {
    code: 20,
    description: 'dell',
    buyPrice: 3000,
    sellPrice: 7000,
    tags: ["tecnolgia", "Dell", "computador"]
  }]
});

test("Deve ser possivel adicionar um novo produto", async () => {
  const response = await request(app)
    .post('/products')
    .send(products[0]);
  
  expect(response.body).toMatchObject({
    ...products[0],
    lovers: 0
  });
});

test("o status code de um produto criado devera ser 201", async () => {
  await request(app)
    .post('/products')
    .send(products[0])
    .expect(201);
});

test("Deve ser possivel atualizar dados de um produto", async () => {
  const response = await request(app)
    .post('/products')
    .send(products[0]);

  const updateProduct = {
    ...products[0],
    description: 'Positivo',
  };

  const responseUpdate = await request(app)
    .put(`/products/${response.body.id}`)
    .send(updateProduct);

  expect(responseUpdate.body).toMatchObject(updateProduct);
});

test("Nao deve ser possivel atualizar um produto inexistente", async () => {
  await request(app)
    .put('/products/465846551')
    .expect(400);
  });
  
test("Nao deve ser possivel remover um produto inexistente", async () => {
  await request(app)
    .delete('/products/465846551')
    .expect(400);
});

test("Deve retornar o codigo 204 quando um produto for removido", async () => {
  const response = await request(app)
    .post('/products')
    .send(products[0]);

  await request(app)
    .delete(`/products/${response.body.code}`)
    .expect(204);
});

test("Deve ser possivel listar todos os produtos", async () => {
  await request(app)
    .post('/products')
    .send(products[0]);

  const responseGet = await request(app)
    .get('/products');

  expect(responseGet.body).toHaveLength(5);
});

test("Deve ser possivel remover os produtos pelo codigo", async () => {
  await request(app)
    .post('/products')
    .send(products[0]);

  const response = await request(app)
    .post('/products')  
    .send(products[0]); 

  await request(app)
    .post('/products')
    .send(products[1]);

  await request(app)
    .delete(`/products/${response.body.code}`);

  const responseALL = await request(app)
    .get('/products');

  console.log(responseALL.body)

  expect(responseALL.body).toHaveLength(8);
});

test("Deve ser possivel dar um love em um produto", async () => {
  const response = await request(app)
    .post('/products')
    .send(products[0]);

  const responseLove = await request(app)
    .post(`/products/${response.body.code}/love`)
    .send(response.body);

  expect(responseLove.body).toMatchObject({
    lovers: 1
  })
})