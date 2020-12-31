import { Redirect } from '@shopify/app-bridge/actions';
import { useAppBridge } from '@shopify/app-bridge-react';
import { Card, ResourceList, Stack, TextStyle, Thumbnail } from '@shopify/polaris';
import { useRef } from 'react';
import store from 'store-js';
import useSWR from 'swr';

import swrFetcher from '../utils/swrFetcher';

export default function ResourceListWithProducts() {
  const optionsRef = useRef({ handle: store.get('handles').join(',') });
  const { data: products, error } = useSWR(['product', 'list', optionsRef.current], swrFetcher, {
    initialData: [],
    revalidateOnMount: true
  });
  console.log('products:', products);
  const app = useAppBridge();
  const redirectToProduct = () => {
    const redirect = Redirect.create(app);
    redirect.dispatch(Redirect.Action.APP, '/edit-products');
  };
  const twoWeeksFromNow = new Date(Date.now() + 12096e5).toDateString();
  return (
    <Card>
      <ResourceList
        showHeader
        resourceName={{ singular: 'Product', plural: 'Products' }}
        items={products}
        renderItem={(item) => {
          const media = (
            <Thumbnail
              source={item.images[0] ? item.images[0].src : ''}
              alt={item.images[0] ? item.images[0].alt : ''}
            />
          );
          const price = item.variants[0].price;
          return (
            <ResourceList.Item
              id={item.id}
              media={media}
              accessibilityLabel={`View details for ${item.title}`}
              onClick={() => {
                store.set('item', item);
                redirectToProduct();
              }}>
              <Stack>
                <Stack.Item fill>
                  <h3>
                    <TextStyle variation="strong">{item.title}</TextStyle>
                  </h3>
                </Stack.Item>
                <Stack.Item>
                  <p>${price}</p>
                </Stack.Item>
                <Stack.Item>
                  <p>Expires on {twoWeeksFromNow} </p>
                </Stack.Item>
              </Stack>
            </ResourceList.Item>
          );
        }}
        loading={!products && !error}
      />
    </Card>
  );
}
