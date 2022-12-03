/* eslint-disable import/no-extraneous-dependencies */
import { EmbedSDK } from '@pushprotocol/uiembed';
import { useEffect } from 'react';

export const Push = (props) => {
  const account = props.account;
  useEffect(() => {
    if (account) {
      // 'your connected wallet address'
      EmbedSDK.init({
        headerText: 'Hello DeFi', // optional
        targetID: 'sdk-trigger-id', // mandatory
        appName: 'consumerApp', // mandatory
        user: account, // mandatory
        chainId: 1, // mandatory
        viewOptions: {
          type: 'sidebar', // optional [default: 'sidebar', 'modal']
          showUnreadIndicator: true, // optional
          unreadIndicatorColor: '#cc1919',
          unreadIndicatorPosition: 'bottom-right',
        },
        theme: 'light',
        onOpen: () => {
          console.log('-> client dApp onOpen callback');
        },
        onClose: () => {
          console.log('-> client dApp onClose callback');
        },
      });
    }

    return () => {
      EmbedSDK.cleanup();
    };
  }, []);
  return <button id="sdk-trigger-id">PUSH</button>;
};
