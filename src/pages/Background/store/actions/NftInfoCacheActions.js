import { SET_NFT_CACHE_NAME, SET_NFT_CACHE_DATA } from '../types';

import { ethers } from 'ethers';

import erc721ABI from '../../../App/abis/erc721ABI.json';

export const updateNftCacheInfo = (dispatch, data) => {};

export const setCachedNftName = (dispatch, data) => {
  const { currentNetworkObject, nftData, currentNetwork } = data;
  const provider = new ethers.providers.JsonRpcProvider(
    currentNetworkObject.rpc
  );
  const nftContract = new ethers.Contract(
    nftData.nftAddress,
    erc721ABI,
    provider
  );
  nftContract.name().then((res) => {
    dispatch({
      type: SET_NFT_CACHE_NAME,
      payload: {
        currentNetwork,
        nftData,
        name: res,
      },
    });
  });
};

export const setCachedNftData = (dispatch, data) => {
  const { currentNetworkObject, nftData, currentNetwork } = data;
  const provider = new ethers.providers.JsonRpcProvider(
    currentNetworkObject.rpc
  );
  const nftContract = new ethers.Contract(
    nftData.nftAddress,
    erc721ABI,
    provider
  );
  nftContract
    .tokenURI(ethers.BigNumber.from(nftData.nftId))
    .then((uri) => {
      fetch(uri)
        .then((res) => res.json())
        .then((data) => {
          dispatch({
            type: SET_NFT_CACHE_DATA,
            payload: {
              currentNetwork,
              nftData,
              data,
            },
          });
        })
        .catch((err) => {
          console.log('set cached nft data error: ', err);
        });
    })
    .catch((err) => {
      console.log('set cached nft data error: ', err);
    });
};
