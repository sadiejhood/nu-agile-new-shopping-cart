import React, { useEffect, useState } from 'react';
import 'rbx/index.css';
import { Title, Button, Card, Image } from 'rbx';

const Product = ({ product }) => {

    const fullImageLocation = "/data/" + product.sku + "_2.jpg";
    const thumbnailImageLocation = "/data/" + product.sku + "_1.jpg";

    return (
        <Card>
            <Card.Header>
                <Card.Header.Title>
                    { product.title }
                </Card.Header.Title>
            </Card.Header>
            <Card.Image size='100%' >
                <Image src={thumbnailImageLocation} />
            </Card.Image>
            <Card.Content>
                <div>
                    {product.title}
                </div>
                {product.currencyFormat} { product.price }
            </Card.Content>
            <Button id="addToCart">Add to Cart</Button>
        </Card>
    );
}


export default Product;