import React, { useEffect, useState } from 'react';
import Product from './Product.js';
import 'rbx/index.css';
import { Container, Title} from 'rbx';

const App = () => {
  const [data, setData] = useState({});
  const products = Object.values(data);
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch('./data/products.json');
      const json = await response.json();
      setData(json);
    };
    fetchProducts();
  }, []);

  return (
    <div>
      <Title size='large'>
        Edgy Shirt Shop
      </Title>
      <Container>
        {products.map(product => 
          <Product product={ product } ></Product>
        )}
      </Container>
    </div>
  );
};

export default App;