import { ethers } from 'ethers';

import erc721ABI from '../../App/abis/erc721ABI.json';

export const checkOwnerShip = (
  { currentNetworkObject, token, address, id },
  beforeWork,
  successCallback,
  failCallback
) => {
  beforeWork();
  const provider = new ethers.providers.JsonRpcProvider(
    currentNetworkObject.rpc
  );
  const tokenContract = new ethers.Contract(
    token.tokenAddress,
    erc721ABI,
    provider
  );
  tokenContract
    .ownerOf(ethers.BigNumber.from(id))
    .then((owner) => {
      if (owner.toString().toLowerCase() === address.toString().toLowerCase()) {
        successCallback();
      } else {
        failCallback("This asset doesn't belong to you.");
      }
    })
    .catch((err) => {
      console.log('Check Owner Ship ERROR: ', err);
      failCallback('Not valid address or id.');
    });
};

export const getNftUri = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { currentNetworkObject, nftAddress, nftId } = data;
      const provider = new ethers.providers.JsonRpcProvider(
        currentNetworkObject.rpc
      );
      const nftContract = new ethers.Contract(nftAddress, erc721ABI, provider);
      const uri = await nftContract.tokenURI(ethers.BigNumber.from(nftId));
      resolve(uri);
    } catch (err) {
      reject(err);
    }
  });
};
