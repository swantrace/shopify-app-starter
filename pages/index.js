import { ResourcePicker, TitleBar } from '@shopify/app-bridge-react';
import { EmptyState, Layout, Page } from '@shopify/polaris';
import dynamic from 'next/dynamic';
import { useCallback, useState } from 'react';
import store from 'store-js';

const ResourceListWithProducts = dynamic(() => import('../components/ResourceList'), {
  ssr: false
});
import installAppIfNot from '../utils/installAppIfNot';
const img = 'https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg';

export default function Home() {
  const [open, setOpen] = useState(false);
  const emptyState = !store.get('handles');
  const handleSelection = useCallback((resources) => {
    setOpen(false);
    const handlesFromResources = resources.selection.map((product) => product.handle);
    store.set('handles', handlesFromResources);
  }, []);
  return (
    <Page>
      <TitleBar
        title="Sample App"
        primaryAction={{
          content: 'Select products',
          onAction: () => setOpen(true)
        }}
      />
      <ResourcePicker
        resourceType="Product"
        showVariants={false}
        open={open}
        onSelection={(resources) => handleSelection(resources)}
        onCancel={() => setOpen(false)}
      />
      <Layout>
        {emptyState ? (
          <EmptyState
            heading="Discount your products temporarily"
            action={{
              content: 'Select products',
              onAction: () => setOpen(true)
            }}
            image={img}>
            <p>Select products to change their price temporarily.</p>
          </EmptyState>
        ) : (
          <ResourceListWithProducts />
        )}
      </Layout>
    </Page>
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
