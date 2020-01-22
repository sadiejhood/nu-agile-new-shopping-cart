import React, { useEffect, useState, Fragment } from 'react';
import Product from './Product.js';
import ShoppingCartItem from './Components/ShoppingCartItem.js';
import { Button, Container, GridList, GridListTile, Grid, Typography, Select, MenuItem, Drawer, Card, CardActionArea, CardContent} from '@material-ui/core';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

const App = () => {
  const [data, setData] = useState({});
  const [inventory, setInventory] = useState({});
  const [cartOpen, setCartOpen] = useState(false);
  const [shoppingCartItems, setShoppingCartItems] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [products, setProducts] = useState([]);
  const [selectedSizes] = useState([]);
  const [selectedSize, setSelectedSize] = useState({});
  const [user, setUser] = useState(null);

  var firebaseConfig = {
    apiKey: "AIzaSyC3_638-M3CjvK14uhSIrrCUXn98VLgYRI",
    authDomain: "nu-agile-new-shopping-cart.firebaseapp.com",
    databaseURL: "https://nu-agile-new-shopping-cart.firebaseio.com",
    projectId: "nu-agile-new-shopping-cart",
    storageBucket: "nu-agile-new-shopping-cart.appspot.com",
    messagingSenderId: "196855447533",
    appId: "1:196855447533:web:ff33f3a9419f564c7c31e4"
  };

  const uiConfig = {
    signInFlow: 'popup',
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID
    ],
    callbacks: {
      signInSuccessWithAuthResult: () => false
    }
  };
  // Initialize Firebase
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
 }

 const dbInv = firebase.database().ref("inventory");
 const dbCarts = firebase.database().ref();


 useEffect(() => {
  firebase.auth().onAuthStateChanged(setUser);
  // console.log(user)
  //add shopping cart items to users shopping cart
  // db.ref('carts').child()

  }, []);


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
      dbInv.on('value', snap => {
        if (snap.val()) {
          setInventory((snap.val()));
        } 
      }, error => alert(error));
    };
    fetchInventory();
  }, []);

  useEffect(() => {
    dbCarts.on('value', snap => {
      if (snap.val()) {
        if (user && snap.val()["carts"] && snap.val()["carts"][user.uid]){
          var newItems = snap.val()["carts"][user.uid][items]
          if (newItems && newItems !== "None") {
            Object.keys(newItems).forEach((items) => {
              shoppingCartItems[items] = {
                item: newItems[items].item, 
                size: newItems[items].size,
                quantity: newItems[items].quantity
              }
              setShoppingCartItems(shoppingCartItems)
            })
          }
        }
      }
      fetchCartItems();
      addToDBCart() 
    }, error => alert(error));

    // console.log(shoppingCartItems)
  }, user);

  useEffect(() => {
    addToDBCart()
  }, shoppingCartItems)

  const fetchCartItems = async () => {
    dbCarts.on('value', snap => {
      if (snap.val()) {
        if (user && snap.val()["carts"] && snap.val()["carts"][user.uid]){
          var newItems = snap.val()["carts"][user.uid]["items"]

          if (newItems) {
            Object.keys(newItems).forEach((items) => {
              shoppingCartItems[items] = {
                item: newItems[items].item, 
                size: newItems[items].size,
                quantity: newItems[items].quantity
              }
              setShoppingCartItems(shoppingCartItems)
            })
          }
        }
      }
    }, error => alert(error));
  }

  function addToDBCart() {
    if (user) {
      var cartItems = []
      Object.keys(shoppingCartItems).forEach((item) => {
        cartItems.push(shoppingCartItems[item])
      })

      if (cartItems.length === 0 || cartItems[0].item === undefined) {
        if (cartItems[0] === undefined || cartItems[0].item === undefined) {
          setShoppingCartItems({})
        }
        dbCarts.child("carts").child(user.uid).update({items: "None"}).then().catch()
      } else {
        dbCarts.child("carts").child(user.uid).update({items: cartItems}).then().catch()
      }
    }
  }

  function updateInventory() {
    Object.keys(shoppingCartItems).forEach((item) => {
      dbInv.child(item).update({
        "S": inventory[item]["S"],
        "M":  inventory[item]["M"],
        "XL": inventory[item]["XL"],
        "L": inventory[item]["L"]
      })
    })
  }

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
        // console.log(inventory[product.sku])
        return
      } else {
        tempCart[product.sku].quantity = tempCart[product.sku].quantity + 1
        setTotalPrice(totalPrice + product.price)
      }
    } else {
      if (inventory[product.sku][size] <= 0) {
        // Do nothing
        // console.log(inventory[product.sku])
        return
      } else {
        tempCart[product.sku] = {item: product, quantity: 1, size: size}
        setTotalPrice(totalPrice + product.price)
      }
    }
  
    var tempInventory = {...inventory}
    tempInventory[product.sku][size] -= 1;
    // console.log(inventory)
    setInventory(tempInventory)
    // console.log(inventory)
    sortBySize('')
    setShoppingCartItems(tempCart);

    // console.log(inventory[product.sku])
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
    // console.log(inventory)
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
          {sizes.map(s => 
            <Button key={s} size="small" selected={selectedSizes.includes(s)} onClick={() => sortBySize(s)}>{s}</Button>
          )}
        </Typography>

        {(() => {
          switch (user == null) {
          case false:   return (
            <Fragment>
              <Typography style={{paddingTop:'20%'}}>Welcome back, {user.displayName}!</Typography>
              <Button onClick={() => firebase.auth().signOut()}>
                Log out
              </Button>
            </Fragment>
          );
          case true: return (<StyledFirebaseAuth
            uiConfig={uiConfig}
            firebaseAuth={firebase.auth()}
          />);
          default: return;
          }
        })()}
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
                // console.log(item)
                if (item != 0 && item != 1) {
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
                }
                return; 
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
                <Button fullWidth={true} onClick={() => {
                    updateInventory()
                    setShoppingCartItems({}); 
                    setTotalPrice(0);
                    // if (user){
                    //   dbCarts.child("carts").child(user.uid).update({items: "None"}).then().catch();
                    // }
                  }
                }> CHECKOUT </Button>
              </CardActionArea>
            </Card>
          </div>
        </Grid>
      </Drawer>
    </Grid>
  );
};

export default App;