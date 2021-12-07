/**
 * @param {*} product
 * @param {*} amount
 */

export default function sellProduct(product, amount) {
  product.stock -= amount;
  return product;
}
