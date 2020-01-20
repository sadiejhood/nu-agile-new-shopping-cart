import React, { useEffect, useState } from 'react';
import Product from './Product.js';
import { Button, Container, GridList, GridListTile, Grid, Typography, Select, MenuItem} from '@material-ui/core';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';

const App = () => {
  const [data, setData] = useState({});
  const products = Object.values(data);
  const sizes = ['XS', 'S', 'M', 'ML', 'L', 'XL', 'XXL']

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch('./data/products.json');
      const json = await response.json();
      setData(json);
    };
    fetchProducts();
  }, []);

  return (
    <Grid direction="row" container alignItems="stretch"   justify="flex-start">
      <Grid item xs={6} sm={3} style={{paddingLeft: '3%', paddingTop: '5%'}}>
        <Typography variant="h4" style={{textAlign: "center"}}>
          Sizes:
        </Typography>
        <Typography>
          {sizes.map(size => 
            <Button size="small">{size}</Button>
          )}
        </Typography>
      </Grid>
      <Grid item xs>
        <Container className="container">
          <Grid style={{paddingLeft:'65%'}} container>
            <Grid item xs={3}>
                <Typography>
                  Order By 
                </Typography>
            </Grid>
            <Grid item xs>
              <Select>
                  <MenuItem>Select</MenuItem>
                  <MenuItem>Lowest to Highest</MenuItem>
                  <MenuItem>Highest to Lowest</MenuItem>
                </Select>
              </Grid>
            <Grid item>
              <Button><ShoppingCartIcon fontSize="large" /></Button>
            </Grid>
          </Grid>
          <GridList cols={4} cellHeight={560}>
              {products.map(product => 
                <GridListTile>
                  <Product product={ product } ></Product>
                </GridListTile>
              )}
          </GridList>
        </Container>
      </Grid>
    </Grid>
  );
};

export default App;