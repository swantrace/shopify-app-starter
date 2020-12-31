import axios from 'axios';

import shopifyResourceTypes from './shopifyResourceTypes';
const swrFetcher = (resourceName, methodName, ...args) => {
  if (
    shopifyResourceTypes[resourceName] &&
    shopifyResourceTypes[resourceName][methodName] &&
    shopifyResourceTypes[resourceName][methodName].length >= args.length
  ) {
    const options = args.reduce((acc, cur, idx) => {
      acc[shopifyResourceTypes[resourceName][methodName][idx]] = cur;
      return acc;
    }, {});
    return axios.post(`/api/${resourceName}/${methodName}`, options).then((res) => res.data);
  } else {
    return window.Promise.reject(
      new Error("You didn't use fetcher correctly, please check it again")
    );
  }
};

export default swrFetcher;
