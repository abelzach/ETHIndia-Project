# SnapLoad
### ETHIndia 22' Submission

![logo](logo.png?raw=true)

A Metamask snap for decentralized file storage and management with FEVM and IPFS along with PUSH notifications.

## Getting Started

1 Clone this repository
<br/>
2 Install Metamask snaps and create an account
<br/>
3 Open hardhat folder 

   ```yarn install ```
   
   ```npx hardhat compile```
   
  ```npx hardhat deploy --network wallaby```
  
  - After deploying the contracts onto FEVM (Using Filecoin Wallaby network) copy the deployed to address
  
4 Open SnapLoad folder
  Use the address obtained earlier to interact with contract abi 
  
  ```yarn install ```
  
  ```yarn start```

## About SnapLoad

Reliable and secure data storage is the need of the hour. Users need to have their files and data backed up by decentralized storage solutions and avoid corporate control altogether. SnapLoad tries to make the process a whole lot easier for users. It integrates with Metamask, which is one of the most popular web3 wallets. The snap enables users to upload files which are then stored on IPFS-Filecoin by using the web3.storage API service. It creates a storage deal for the files. The deal information such as id, cid, client, provider etc is stored and further preserved using the Market API smart contract on FEVM. This allows for persistent storage and allows users to interact with the Market API methods for managing their storage deals. SnapLoad provides persistent , decentralized storage for critical files and data while also giving individuals the ability to manage their storage deals with the help of the FEVM contract and even choose to compute over state.
