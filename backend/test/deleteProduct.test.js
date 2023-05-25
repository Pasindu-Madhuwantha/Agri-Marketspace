// Import necessary dependencies and modules
const { deleteProduct } = require('../controllers/productController');

// Mock dependencies
jest.mock('../models/product', () => ({
  findById: jest.fn(),
}));

// Test suite for the deleteProduct function
describe('deleteProduct', () => {
  // Positive test case: Product exists and is successfully deleted
  it('should delete the product', async () => {
    // Mock data
    const mockProduct = {
      _id: 'product_id',
      remove: jest.fn(),
    };

    const req = {
      params: { id: 'product_id' },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();

    // Mock Product.findById to return the mock product
    const Product = require('../models/product');
    Product.findById.mockResolvedValue(mockProduct);

    // Call the deleteProduct function
    await deleteProduct(req, res, next);

    // Assert that Product.findById is called with the correct parameter
    expect(Product.findById).toHaveBeenCalledWith('product_id');

    // Assert that the product.remove function is called
    expect(mockProduct.remove).toHaveBeenCalledTimes(1);

    // Assert that res.status is called with 200
    expect(res.status).toHaveBeenCalledWith(200);

    // Assert that res.json is called with the success message
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Product is deleted.',
    });

    // Assert that next is not called
    expect(next).not.toHaveBeenCalled();
  });

  // Negative test case: Product not found
  it('should return an error when the product is not found', async () => {
    const req = {
      params: { id: 'nonexistent_product_id' },
    };

    const res = {};
    const next = jest.fn();

    // Mock Product.findById to return null or undefined
    const Product = require('../models/product');
    Product.findById.mockResolvedValue(null); // or Product.findById.mockResolvedValue(undefined);

    // Call the deleteProduct function
    await deleteProduct(req, res, next);

    // Assert that Product.findById is called with the correct parameter
    expect(Product.findById).toHaveBeenCalledWith('nonexistent_product_id');

    // Assert that next is called with an error
    expect(next).toHaveBeenCalledTimes(1);
    expect(next.mock.calls[0][0]).toBeInstanceOf(Error);
    expect(next.mock.calls[0][0].statusCode).toBe(404);
    expect(next.mock.calls[0][0].message).toBe('Product not found');
  });
});
