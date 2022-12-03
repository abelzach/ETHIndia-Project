import * as PushAPI from '@pushprotocol/restapi';
import { useEffect, useState } from 'react';

export const PushChannels = () => {
  const [subscriptions, setSubscriptions] = useState<string[]>([]);
  useEffect({
          const subscriptions = await PushAPI.user.getSubscriptions({
user: 'eip155:5:0xD8634C39BBFd4033c0d3289C4515275102423681',
env: 'staging'
});
  }, [])
  return <div className="Channels">

  </div>;
};
