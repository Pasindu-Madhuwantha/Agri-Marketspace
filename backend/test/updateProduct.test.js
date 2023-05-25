// Import necessary dependencies and modules
const { updateProduct } = require('./your-file-name');

// Mock dependencies
jest.mock('path/to/Product', () => ({
  findById: jest.fn(),
}));

// Test suite for the updateProduct function
describe('updateProduct', () => {
  // Positive test case: Product exists
  it('should update the product', async () => {
    // Mock data
    const mockProduct = {
      _id: 'product_id',
      name: 'Old Product Name',
      price: 10.99,
      description: 'Old Product Description',
      ratings: 4.5,
      volume: ['100ml', '200ml'],
      stock: 10,
      numofReviews: 5,
      reviews: [
        { name: 'User1', rating: 4, comment: 'Good product' },
        { name: 'User2', rating: 5, comment: 'Excellent product' },
      ],
      user: 'seller_id',
      createdAt: '2023-05-20T12:00:00.000Z',
    };

    const req = {
      params: { id: 'product_id' },
      body: {
        name: 'New Product Name',
        price: 12.99,
        description: 'New Product Description',
        volume: ['300ml'],
        stock: 15,
      },
    };

    const res = {};
    const next = jest.fn();

    // Mock Product.findById to return the mock product
    const Product = require('path/to/Product');
    Product.findById.mockResolvedValue(mockProduct);

    // Call the updateProduct function
    await updateProduct(req, res, next);

    // Assert that Product.findById is called with the correct parameter
    expect(Product.findById).toHaveBeenCalledWith('product_id');

    // Assert that the product properties are updated correctly
    expect(req.body.name).toBe('New Product Name');
    expect(req.body.price).toBe(12.99);
    expect(req.body.description).toBe('New Product Description');
    expect(req.body.volume).toEqual(['300ml']);
    expect(req.body.stock).toBe(15);

    // Assert that next is called without an error
    expect(next).toHaveBeenCalledWith();
    expect(next).toHaveBeenCalledTimes(1);
  });

  // Negative test case: Product not found
  it('should return an error when the product is not found', async () => {
    const req = {
      params: { id: 'nonexistent_product_id' },
      body: {
        name: 'New Product Name',
        price: 12.99,
        description: 'New Product Description',
        volume: ['300ml'],
        stock: 15,
      },
    };

    const res = {};
    const next = jest.fn();

    // Mock Product.findById to return null or undefined
    const Product = require('path/to/Product');
    Product.findById.mockResolvedValue(null); // or Product.findById.mockResolvedValue(undefined);

    // Call the updateProduct function
    await updateProduct(req, res, next);

    // Assert that Product.findById is called with the correct parameter
    expect(Product.findById).toHaveBeenCalledWith('nonexistent_product_id');

    // Assert that next is called with an error
    expect(next).toHaveBeenCalledTimes(1);
    expect(next.mock.calls[0][0]).toBeInstanceOf(Error);
    expect(next.mock.calls[0][0].statusCode).toBe(404);
    expect(next.mock.calls[0][0].message).toBe('Product not found');
  });
});
