const { getSingleProduct } = require('../controllers/productController');
const Product = require('../models/product');
const ErrorHandler = require('../utils/errorHandler');

describe('getSingleProduct', () => {
  afterEach(() => {
    jest.restoreAllMocks(); // Restore mocked functions after each test
  });

  it('should return a single product when given a valid product ID', async () => {
    // Create a mock product to return from the database
    const mockProduct = { _id: '123', name: 'Test Product' };
    jest.spyOn(Product, 'findById').mockResolvedValue(mockProduct);

    // Create mock request and response objects
    const req = { params: { id: '123' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    // Call the getSingleProduct function
    await getSingleProduct(req, res, next);

    // Expect the product to be returned in the response
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      product: mockProduct,
    });

    // Expect that next was not called
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next with an error when given an invalid product ID', async () => {
    // Set up the mock findById method to return null
    jest.spyOn(Product, 'findById').mockResolvedValue(null);

    // Create mock request and response objects
    const req = { params: { id: 'invalid-id' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    // Call the getSingleProduct function
    await getSingleProduct(req, res, next);

    // Expect that next was called with an error
    expect(next).toHaveBeenCalledWith(new ErrorHandler('Product not found', 404));

    // Expect that res.status and res.json were not called
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();

     // Print the error message in the console
     console.log('Error:', next.mock.calls[0][0].message);
  });
});
