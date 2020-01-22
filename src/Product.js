import React, { useState, Fragment } from 'react';
import { CardMedia, CardContent, Typography} from '@material-ui/core';
import {ToggleButton, ToggleButtonGroup} from '@material-ui/lab'

const Product = ({ product }) => {
    const [inventory, setInventory] = useState({})
    const [size, setSize] = useState("");
    const fullImageLocation = "/data/" + product[0].sku + "_1.jpg";

    const sizes = ["S", "M", "L", "XL"];

    // const currentSize = () => {
    //     return size
    // }

    function changeSize(size) {
        setInventory(product[1])

        if (inventory[size] > 0) {
            setSize(size)

            var tempSize = {...product[2]}
            tempSize[product[0].sku] = size
            product[3](tempSize)
            return true
        } else {
            return false
        }
    }

    // console.log(product)

    return (
        <Fragment>
        <CardContent>
            {(() => {
                switch (product[0].isFreeShipping) {
                case true:   return (<Typography style={{textAlign: 'right'}}> Free Shipping </Typography>);
                case false: return (<Typography style={{paddingTop: '10%'}}>  </Typography>);
                default: return;
                }
            })()}
        </CardContent>
        <CardMedia
            style={{height: '350px', width: '250px'}}
            image={fullImageLocation}
            title="Image of shirt"
        />
            
        <CardContent>
            <ToggleButtonGroup exclusive value={'left'}>
                {
                    sizes.map((s) => 
                        <ToggleButton key={s} selected={size === s} onClick={() => changeSize(s)} value={'left'}>
                            {s}
                        </ToggleButton>
                    )
                }
            </ToggleButtonGroup>
            <Typography style={{fontSize: '15px'}} >
                {product[0].title}
            </Typography>
            <Typography>
                {product[0].currencyFormat} { product[0].price.toFixed(2) }
            </Typography>
        </CardContent>
        </Fragment>
    );
}


export default Product;