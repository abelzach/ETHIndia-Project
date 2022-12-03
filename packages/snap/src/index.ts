/* eslint-disable jsdoc/require-jsdoc */
import * as PushAPI from '@pushprotocol/restapi';
import { OnRpcRequestHandler } from '@metamask/snap-types';

const account = '0x8BdB96506a636C32AEcf2eFae72d59bA35B80E5b';

/**
 * Get a message from the origin. For demonstration purposes only.
 *
 * @param originString - The origin string.
 * @returns A message based on the origin.
 */
export const getMessage = (originString: string): string =>
  `Hello, ${originString}!`;

async function fetchNotifications(): Promise<string> {
  const fetchedNotifications = await PushAPI.user.getFeeds({
    user: `eip155:5:${account}`,
    env: 'staging',
  });
  let msg;
  // Parse the notification fetched
  if (fetchedNotifications) {
    msg = `You have ${fetchedNotifications.length} notifications\n`;
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < fetchedNotifications.length; i++) {
      msg += `${fetchedNotifications[i].title} ${fetchedNotifications[i].message}\n`;
    }
  } else {
    msg = 'You have 0 notifications';
  }
  console.log(msg);
  return msg;
  // This is used to render the text present in a notification body as a JSX element
  // <NotificationItem
  //   notificationTitle={parsedResponse.title}
  //   notificationBody={parsedResponse.message}
  //   cta={parsedResponse.cta}
  //   app={parsedResponse.app}
  //   icon={parsedResponse.icon}
  //   image={parsedResponse.image}
  // />;
}

/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns `null` if the request succeeded.
 * @throws If the request method is not valid for this snap.
 * @throws If the `snap_confirm` call failed.
 */
export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}) => {
  const msg = await fetchNotifications();
  switch (request.method) {
    case 'hello':
      return wallet.request({
        method: 'snap_confirm',
        params: [
          {
            prompt: getMessage(origin),
            description:
              'This custom confirmation is just for display purposes.',
            textAreaContent:
              'But you can edit the snap source code to make it do something, if you want to!',
          },
        ],
      });
    case 'upload':
      return wallet.request({
        method: 'snap_confirm',
        params: [
          {
            prompt: getMessage(origin),
            description: 'Inside Snap/src/index.ts',
            textAreaContent: 'You Uploaded a file ',
          },
        ],
      });
    case 'push_notifications':
      return wallet.request({
        method: 'snap_confirm',
        params: [
          {
            prompt: 'Push Notifications',
            description: 'These are the notifications From PUSH.',
            textAreaContent: msg,
          },
        ],
      });

    default:
      throw new Error('Method not found.');
  }
};
