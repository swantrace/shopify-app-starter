import {
  Banner,
  Card,
  DisplayText,
  Form,
  FormLayout,
  Frame,
  Layout,
  Page,
  PageActions,
  TextField,
  TextStyle,
  Toast
} from '@shopify/polaris';
import { useCallback, useEffect, useState } from 'react';
import store from 'store-js';
import useSWR, { mutate } from 'swr';

import installAppIfNot from '../utils/installAppIfNot';
import swrFetcher from '../utils/swrFetcher';

export default function EditProduct() {
  const discountRate = 0.1;
  const item = store.get('item');
  const productId = item.id;
  const { data: product, error } = useSWR(['product', 'get', productId], swrFetcher);
  const [discountState, setDiscountState] = useState(null);
  const [showToastState, setShowToastState] = useState(false);
  const [mutationErrorState, setMutationErrorState] = useState(null);

  useEffect(() => {
    if (product) {
      setDiscountState((product.variants[0].price * (1 - discountRate)).toFixed(2));
    }
  }, [product]);
  const handleChange = useCallback((field, value) => {
    if (field === 'discount') {
      setDiscountState(value);
    }
  }, []);
  const showError = mutationErrorState && (
    <Banner status="critical">{mutationErrorState.message}</Banner>
  );
  const showToast = showToastState && (
    <Toast
      content="Sucessfully updated"
      onDismiss={() => {
        setShowToastState(false);
      }}
    />
  );
  if (error) {
    return (
      <Frame>
        <Page>
          <Layout>
            <TextStyle variation="strong">{error.message}</TextStyle>
          </Layout>
        </Page>
      </Frame>
    );
  }
  if (!product) {
    return (
      <Frame>
        <Page>
          <Layout>
            <TextStyle>Loading...</TextStyle>
          </Layout>
        </Page>
      </Frame>
    );
  }
  return (
    <Frame>
      <Page>
        <Layout>
          {showToast}
          <Layout.Section>{showError}</Layout.Section>
          <Layout.Section>
            <DisplayText size="large">{product.title}</DisplayText>
            <Form>
              <Card sectioned>
                <FormLayout>
                  <FormLayout.Group>
                    <TextField
                      prefix="$"
                      value={product.variants[0].price}
                      disabled={true}
                      label="Original price"
                      type="price"
                    />
                    <TextField
                      prefix="$"
                      value={discountState}
                      onChange={(value) => handleChange('discount', value)}
                      label="Discounted price"
                      type="discount"
                    />
                  </FormLayout.Group>
                  <p>This sale price will expire in two weeks</p>
                </FormLayout>
              </Card>
              <PageActions
                primaryAction={[
                  {
                    content: 'Save',
                    onAction: async () => {
                      const newVariants = product.variants.map((variant, index) => {
                        if (index === 0) {
                          variant.price = discountState;
                        }
                        return variant;
                      });
                      mutate(
                        ['product', 'get', productId],
                        {
                          ...product,
                          variants: newVariants
                        },
                        false
                      );
                      try {
                        await swrFetcher('productVariant', 'update', product.variants[0].id, {
                          price: discountState
                        });
                        setShowToastState(true);
                      } catch (err) {
                        setMutationErrorState(err);
                      }
                      mutate(['product', 'get', productId]);
                    }
                  }
                ]}
                secondaryActions={[
                  {
                    content: 'Remove discount'
                  }
                ]}
              />
            </Form>
          </Layout.Section>
        </Layout>
      </Page>
    </Frame>
  );
}

export async function getServerSideProps(ctx) {
  await installAppIfNot(ctx);
  return {
    props: {
      shopOrigin: ctx.req.session.shop
    }
  };
}
