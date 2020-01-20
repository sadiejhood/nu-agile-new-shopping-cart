import React, { useEffect, useState } from 'react';
import Product from './Product.js';
import ShoppingCartItem from './Components/ShoppingCartItem.js';
import { Button, Container, GridList, GridListTile, Grid, Typography, Select, MenuItem, Drawer, Card, CardActionArea, CardContent} from '@material-ui/core';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';

const App = () => {
  const [data, setData] = useState({});
  const [inventory, setInventory] = useState({});
  const [cartOpen, setCartOpen] = useState(false);
  const [shoppingCartItems, setShoppingCartItems] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [products, setProducts] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedSize, setSelectedSize] = useState({})

  // var products = Object.values(data);
  const sizes = ['S', 'M', 'L', 'XL']
  const items = [products[0]]

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch('./data/products.json');
      const json = await response.json();
      setData(json);
      setProducts(Object.values(json));
    };
    fetchProducts();

  }, []);

  useEffect(() => {
    const fetchInventory = async () => {
      const response = await fetch('./data/inventory.json');
      const json = await response.json();
      setInventory(json);
    };
    fetchInventory();
  }, []);

  const flipCart = () => {
    setCartOpen(!cartOpen)
  };

  function addToCart(product, size) {
    var tempCart = {};

    if (size === undefined) {
      alert("Please select a size")
      return
    }

    Object.keys(shoppingCartItems).forEach((element) => {
      tempCart[shoppingCartItems[element].item.sku] = {item: shoppingCartItems[element].item, quantity: shoppingCartItems[element].quantity, size: size}
    });
  
    if (tempCart[product.sku] && tempCart[product.sku].size === size) {
      if (inventory[product.sku][size] <= 0) {
        console.log(inventory[product.sku])
        return
      } else {
        tempCart[product.sku].quantity = tempCart[product.sku].quantity + 1
        setTotalPrice(totalPrice + product.price)
      }
    } else {
      if (inventory[product.sku][size] <= 0) {
        // Do nothing
        console.log(inventory[product.sku])
        return
      } else {
        tempCart[product.sku] = {item: product, quantity: 1, size: size}
        setTotalPrice(totalPrice + product.price)
      }
    }
  
    var tempInventory = {...inventory}
    tempInventory[product.sku][size] -= 1;
    console.log(inventory)
    setInventory(tempInventory)
    console.log(inventory)
    sortBySize('')
    setShoppingCartItems(tempCart);

    console.log(inventory[product.sku])
  };

  function removeFrom(product, size) {
    var tempCart = {};
    Object.keys(shoppingCartItems).forEach((element) => {
      if (shoppingCartItems[element].item.sku === product.sku && shoppingCartItems[element].quantity < 2) {
        return 
      }
      if (shoppingCartItems[element].item.sku === product.sku) {
        tempCart[shoppingCartItems[element].item.sku] = {item: shoppingCartItems[element].item, quantity: shoppingCartItems[element].quantity - 1, size: size}  
      } else {
        tempCart[shoppingCartItems[element].item.sku] = {item: shoppingCartItems[element].item, quantity: shoppingCartItems[element].quantity, size: size}
      }
      
    });

    setTotalPrice(totalPrice - product.price)

    var tempInventory = {...inventory}
    tempInventory[product.sku][size] += 1;
    setInventory(tempInventory)
    sortBySize('')
    setShoppingCartItems(tempCart);
    return;
  }

  function sortBySize(size) {
    if (size) {
      if (selectedSizes.includes(size)) {
        selectedSizes.splice(selectedSizes.indexOf(size), 1)
      } else {
        selectedSizes.push(size)
      }
    }

    var tempProducts = []
    Object.keys(inventory).forEach((item) => {
      var sizePresent = false
      selectedSizes.forEach((sizes) => {
        if (inventory[item][sizes] > 0) {
          sizePresent = true
        }
      })
      if ( sizePresent ) {
        tempProducts.push(data[item]);
      }
      sizePresent = false
    })

    if (selectedSizes.length === 0) {
      tempProducts = Object.values(data)
    }

    setProducts(tempProducts);

  }


  return (
    <Grid direction="row" container alignItems="stretch"   justify="flex-start">
      <Grid item xs={6} sm={3} style={{paddingLeft: '3%', paddingTop: '5%'}}>
        <Typography variant="h4" style={{textAlign: "center"}}>
          Sizes:
        </Typography>
        <Typography>
          {sizes.map(size => 
            <Button size="small" onClick={() => sortBySize(size)}>{size}</Button>
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
          <GridList cols={4} cellHeight={600}>
              { products.map(product => 
                <GridListTile key={product.sku}>
                  <Card className="card">
                    <Product product={ [product, inventory[product.sku], selectedSize, setSelectedSize] }></Product>
                    <Button color='primary' fullWidth={true} 
                      onClick={() => {
                        addToCart(product, selectedSize[product.sku]);  
                        if (selectedSize[product.sku])
                          flipCart();}
                      }>
                        Add to Cart
                    </Button>
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
                  <Typography key={shoppingCartItems[item].item.sku}>
                    <Card style={{paddingLeft: '2%', height:'200px'}}>
                      <ShoppingCartItem item={[shoppingCartItems[item].item, shoppingCartItems[item].quantity, shoppingCartItems[item].size]} />
                      <div style={{paddingLeft: '60%'}}>
                        <Button onClick={() => removeFrom(shoppingCartItems[item].item, shoppingCartItems[item].size)}> - </Button>
                        <Button onClick={() => addToCart(shoppingCartItems[item].item, shoppingCartItems[item].size)}> + </Button>
                      </div>
                    </Card>
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