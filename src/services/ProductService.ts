import { EnvVariable, getEnvVariable } from '@config/get-env-variable';
import { Product, ProductItem } from '@models/product';
import { provideDynamoDBClient } from '@services/dynamoDBClientProvider';

const productsTable = getEnvVariable(EnvVariable.PRODUCTS_TABLE_NAME);
const dynamoDBClient = provideDynamoDBClient();

const ProductService = {
  setPrice: async (product: Product): Promise<ProductItem> => {
    try {
      const { Item: storedProduct } = await dynamoDBClient.get({
        TableName: productsTable,
        Key: {
          url: product.url,
        },
      }).promise();
      console.log('storedProduct:', storedProduct);

      const productItem: ProductItem = {
        ...product,
        previousPrice: storedProduct?.currentPrice || 0,
        timestamp: new Date().toISOString(),
      };
      console.log('productItem:', productItem);

      await dynamoDBClient.put({
        TableName: productsTable,
        Item: productItem,
      }).promise();

      return productItem;
    } catch(error) {
      console.log(error);
    }
  },
};

export default ProductService;
