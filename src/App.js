import React, { useEffect, useState } from 'react';
import Product from './Product.js';
import ShoppingCartItem from './Components/ShoppingCartItem.js';
import { Button, Container, GridList, GridListTile, Grid, Typography, Select, MenuItem, Drawer, Card, CardActionArea, CardContent} from '@material-ui/core';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';

const App = () => {
  const [data, setData] = useState({});
  const [cartOpen, setCartOpen] = useState(false)
  const [shoppingCartItems, setShoppingCartItems] = useState({})
  const [totalPrice, setTotalPrice] = useState(0)

  const products = Object.values(data);
  const sizes = ['XS', 'S', 'M', 'ML', 'L', 'XL', 'XXL']
  const items = [products[0]]

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch('./data/products.json');
      const json = await response.json();
      setData(json);
    };
    fetchProducts();
  }, []);

  const flipCart = () => {
    setCartOpen(!cartOpen)
  };

  function addToCart(product) {
    var tempCart = {};
    Object.keys(shoppingCartItems).forEach((element) => {
      tempCart[shoppingCartItems[element].item.sku] = {item: shoppingCartItems[element].item, quantity: shoppingCartItems[element].quantity}
    });
  
    if (tempCart[product.sku]) {
      tempCart[product.sku].quantity = tempCart[product.sku].quantity + 1
    } else {
      console.log("Adding....", product)
      tempCart[product.sku] = {item: product, quantity: 1}
      setTotalPrice(totalPrice + product.price)
    }
  
    setShoppingCartItems(tempCart)
  };


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
              <Button onClick={flipCart}><ShoppingCartIcon fontSize="large" /></Button>
            </Grid>
          </Grid>
          <GridList cols={4} cellHeight={560}>
              {products.map(product => 
                <GridListTile>
                  <Card className="card">
                    <Product product={ product } ></Product>
                    <Button color='primary' fullWidth={true} onClick={() => addToCart(product)}>Add to Cart</Button>
                  </Card>
                </GridListTile>
              )}
          </GridList>
        </Container>
      </Grid>

      <Drawer anchor="right" open={ cartOpen } onClose={ flipCart }>
        <Grid container direction="column" style={{overflow: 'hidden'}}>
          <Grid item style={{paddingTop: '5%'}}>
            <div style={{paddingLeft: '20%'}}>
              <Typography variant={'h4'}>
                Shopping Cart
              </Typography>
            </div>
            <div style={{paddingLeft: '50%', width: '400px'}}>
              <ShoppingCartIcon fontSize="large"/>
            </div>
          </Grid>
          <Grid item style={{height: '60%', overflow: 'scroll'}}>
            {
              Object.keys(shoppingCartItems).map((item) => {
                return (
                  <Typography>
                    <ShoppingCartItem item={[shoppingCartItems[item].item, shoppingCartItems[item].quantity]}></ShoppingCartItem>
                  </Typography>
                )
              })
            }   
          </Grid>
          <div style={{position: 'absolute', bottom: '2%', paddingLeft: '2%', width: '100%'}}> 
            <Card>
              <CardContent>
                  <Typography >
                    <div style={{textAlign: 'center', fontSize: '30px'}}>
                      SUBTOTAL
                    </div>
                    <div style={{textAlign: 'center'}}>
                    $ {totalPrice.toFixed(2)}
                    </div>
                  </Typography>
              </CardContent>
              <CardActionArea>
                <Button fullWidth={true}> CHECKOUT </Button>
              </CardActionArea>
            </Card>
          </div>
        </Grid>
      </Drawer>
    </Grid>
  );
};

export default App;