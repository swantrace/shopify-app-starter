import {
  Button,
  Card,
  Form,
  FormLayout,
  Layout,
  Page,
  SettingToggle,
  Stack,
  TextField,
  TextStyle
} from '@shopify/polaris';
import { useCallback, useState } from 'react';

import installAppIfNot from '../utils/installAppIfNot';

function AnnotatedLayout() {
  const [discount, setDiscount] = useState('10%');
  const [enabled, setEnabled] = useState(false);

  const handleSubmit = useCallback(() => {
    setDiscount('10%');
  }, []);

  const handleChange = useCallback((value) => {
    setDiscount(value);
  }, []);

  const handleToggle = useCallback(() => setEnabled((enabled) => !enabled), []);

  const contentStatus = enabled ? 'Disable' : 'Enable';
  const textStatus = enabled ? 'enabled' : 'disabled';

  return (
    <Page>
      <Layout>
        <Layout.AnnotatedSection
          title="Default discount"
          description="Add a product to Sample App, it will automatically be discounted.">
          <Card sectioned>
            <Form onSubmit={handleSubmit}>
              <FormLayout>
                <TextField
                  value={discount}
                  onChange={handleChange}
                  label="Discount percentage"
                  type="discount"
                />
                <Stack distribution="trailing">
                  <Button primary submit>
                    Save
                  </Button>
                </Stack>
              </FormLayout>
            </Form>
          </Card>
        </Layout.AnnotatedSection>
        <Layout.AnnotatedSection
          title="Price updates"
          description="Temporarily disable all Sample App price updates">
          <SettingToggle
            action={{
              content: contentStatus,
              onAction: handleToggle
            }}
            enabled={enabled}>
            This setting is <TextStyle variation="strong">{textStatus}</TextStyle>.
          </SettingToggle>
        </Layout.AnnotatedSection>
      </Layout>
    </Page>
  );
}

export default AnnotatedLayout;

export async function getServerSideProps(ctx) {
  await installAppIfNot(ctx);
  return {
    props: {
      shopOrigin: ctx.req.session.shop
    }
  };
}
