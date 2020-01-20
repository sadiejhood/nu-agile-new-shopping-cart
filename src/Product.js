import React, { useEffect, useState, Fragment } from 'react';
import { CardMedia, CardContent, Typography } from '@material-ui/core';

const Product = ({ product }) => {

    const fullImageLocation = "/data/" + product.sku + "_1.jpg";
    const thumbnailImageLocation = "/data/" + product.sku + "_2.jpg";

    return (
        <Fragment>
        <CardContent>
            {(() => {
                switch (product.isFreeShipping) {
                case true:   return (<Typography style={{textAlign: 'right'}}> Free Shipping </Typography>);
                case false: return (<Typography style={{paddingTop: '10%'}}>  </Typography>);
                }
            })()}
        </CardContent>
        <CardMedia
            style={{height: '350px', width: '250px'}}
            image={fullImageLocation}
            title="Image of shirt"
        />
            
        <CardContent>
            <Typography gutterbottom style={{fontSize: '15px'}}>
                {product.title}
            </Typography>
            <Typography>
                {product.currencyFormat} { product.price.toFixed(2) }
            </Typography>
        </CardContent>
        </Fragment>
    );
}


export default Product;