import React, { useEffect, useState } from 'react';
import Product from './Product.js';
import 'rbx/index.css';
import { Button, Container, Title} from 'rbx';

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
        <Button.Group>
          <Button>XS</Button>
          <Button>S</Button>
          <Button>M</Button>
          <Button>ML</Button>
          <Button>L</Button>
          <Button>XL</Button>
          <Button>XXL</Button>
        </Button.Group>
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