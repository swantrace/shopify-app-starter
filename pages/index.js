import { useEffect, useState } from 'react';
import axios from 'axios';
import Head from 'next/head';
import createNextShopifyFunctions from 'next-connect-shopify';
import prepareSessionOptions from '../utils/prepareSessionOptions';
import styles from '../styles/Home.module.css';

export default function Home() {
  // const [products, setProducts] = useState([]);

  // useEffect(async () => {
  //   const products = await axios
  //     .get('/api/shopify/product/list')
  //     .then((response) => response.data);
  //   console.log('products', products);
  //   setProducts(products);
  // }, []);

  // return (
  //   <div className={styles.container}>
  //     {products.map((product) => (
  //       <h1>{product.title}</h1>
  //     ))}
  //   </div>
  // );
  return <h1>hello world</h1>;
}

export async function getServerSideProps(ctx) {
  const {
    SHOPIFY_APP_CLIENT_SECRET: sharedSecret,
    SHOPIFY_APP_CLIENT_ID: apiKey,
    SHOPIFY_APP_SCOPES: scopes,
    SHOPIFY_APP_SLUG: appSlug,
  } = process.env;
  console.log(ctx.resolvedUrl);
  const { installAppIfNot } = createNextShopifyFunctions({
    prepareSessionOptions,
    sharedSecret,
    apiKey,
    scopes,
    appSlug,
  });

  await installAppIfNot(ctx);

  return {
    props: {},
  };
}
