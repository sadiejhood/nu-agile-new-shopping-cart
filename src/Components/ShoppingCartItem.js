import React from 'react';
import { CardMedia, CardContent, Typography, Container } from '@material-ui/core';

const ShoppingCartItem = ({item}) => {

    const thumbnailImageLocation = "/data/" + item[0].sku + "_2.jpg";

    return (
        <Container>
            <div style={{display: 'flex', flexDirection: 'row', width: '400px'}}>
                <CardMedia
                        style={{height: '150px', width: '75px', float: 'left'}}
                        image={thumbnailImageLocation}
                        title="Image of shirt"
                />
                <CardContent style={{float: 'right'}}>
                    <Typography>
                        {item[0].title}
                    </Typography>
                    <Typography>
                        {item[0].currencyFormat} { item[0].price.toFixed(2) }
                    </Typography>
                    <Typography>Size: {item[2]}</Typography>
                    <Typography>Quantity: {item[1]}</Typography>
                </CardContent>
            </div>
        </Container>
    );
};


export default ShoppingCartItem;