import nc from 'next-connect';
import createNextShopifyFunctions from 'next-connect-shopify';
import prepareSessionOptions from '../../../utils/prepareSessionOptions';

const {
  SHOPIFY_APP_CLIENT_SECRET: sharedSecret,
  SHOPIFY_APP_CLIENT_ID: apiKey,
  SHOPIFY_APP_SCOPES: scopes,
  SHOPIFY_APP_SLUG: appSlug,
} = process.env;

const {
  setSessionMiddleware,
  getAuthUrlMiddleware,
  getAccessTokenMiddleware,
  handleShopifyAPIMiddleware,
  verifyAPIRoutesMiddleware,
  redirectMiddleware,
} = createNextShopifyFunctions({
  prepareSessionOptions,
  sharedSecret,
  apiKey,
  scopes,
  appSlug,
});
const handler = nc();

handler
  .use(setSessionMiddleware)
  .use(getAuthUrlMiddleware)
  .use(getAccessTokenMiddleware)
  .use(handleShopifyAPIMiddleware)
  .use(verifyAPIRoutesMiddleware)
  .use(redirectMiddleware);

export default handler;
