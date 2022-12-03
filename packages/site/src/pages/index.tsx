import { useContext } from 'react';
import styled from 'styled-components';
import { Web3Storage } from 'web3.storage';
import { MetamaskActions, MetaMaskContext } from '../hooks';
import {
  connectSnap,
  getSnap,
  sendHello,
  shouldDisplayReconnectButton,
  showNotifications,
  uploadFile,
} from '../utils';
import {
  ConnectButton,
  InstallFlaskButton,
  UploadFileInput,
  ReconnectButton,
  SendHelloButton,
  Card,
  ShowNotificationsButton,
} from '../components';

// const TOKEN = process.env.WEB3_STORAGE_API_KEY;
const TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDA0YTY5ZWU2ZTY5NjdFMDJkYTkwN2EwZUQ3ZjJBOTIwNEI0OWNCODkiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NzAwMzI0MDk4MzcsIm5hbWUiOiJUZXN0IHdlYjMuc3RvcmFnZSJ9.YrEPVX06nlNs_9gEqHZCi2Czux84Kr-Iysrz-coWALc';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  margin-top: 7.6rem;
  margin-bottom: 7.6rem;
  ${({ theme }) => theme.mediaQueries.small} {
    padding-left: 2.4rem;
    padding-right: 2.4rem;
    margin-top: 2rem;
    margin-bottom: 2rem;
    width: auto;
  }
`;

const Heading = styled.h1`
  margin-top: 0;
  margin-bottom: 2.4rem;
  text-align: center;
`;

const Span = styled.span`
  color: ${(props) => props.theme.colors.primary.default};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.large};
  font-weight: 500;
  margin-top: 0;
  margin-bottom: 0;
  ${({ theme }) => theme.mediaQueries.small} {
    font-size: ${({ theme }) => theme.fontSizes.text};
  }
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  max-width: 64.8rem;
  width: 100%;
  height: 100%;
  margin-top: 1.5rem;
`;

const Notice = styled.div`
  background-color: ${({ theme }) => theme.colors.background.alternative};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  color: ${({ theme }) => theme.colors.text.alternative};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 2.4rem;
  margin-top: 2.4rem;
  max-width: 60rem;
  width: 100%;

  & > * {
    margin: 0;
  }
  ${({ theme }) => theme.mediaQueries.small} {
    margin-top: 1.2rem;
    padding: 1.6rem;
  }
`;

const ErrorMessage = styled.div`
  background-color: ${({ theme }) => theme.colors.error.muted};
  border: 1px solid ${({ theme }) => theme.colors.error.default};
  color: ${({ theme }) => theme.colors.error.alternative};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 2.4rem;
  margin-bottom: 2.4rem;
  margin-top: 2.4rem;
  max-width: 60rem;
  width: 100%;
  ${({ theme }) => theme.mediaQueries.small} {
    padding: 1.6rem;
    margin-bottom: 1.2rem;
    margin-top: 1.2rem;
    max-width: 100%;
  }
`;

const Index = () => {
  const [state, dispatch] = useContext(MetaMaskContext);

  const handleConnectClick = async () => {
    try {
      await connectSnap();
      const installedSnap = await getSnap();

      dispatch({
        type: MetamaskActions.SetInstalled,
        payload: installedSnap,
      });
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  const handleSendHelloClick = async () => {
    try {
      await sendHello();
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  function jsonFile(filename: string, obj: { path: string; caption?: string }) {
    return new File([JSON.stringify(obj)], filename);
  }

  function makeGatewayURL(cid: string, path: string) {
    return `https://${cid}.ipfs.dweb.link/${encodeURIComponent(path)}`;
  }

  function updateUploadInfo(
    cid: string,
    metadataGatewayURL: string,
    imageGatewayURL: string,
    imageURI: string,
    metadataURI: string,
  ) {
    console.log(cid);
    console.log(metadataGatewayURL);
    console.log(imageGatewayURL);
    console.log(imageURI);
    console.log(metadataURI);
  }

  const handleShowNotificationsClick = async () => {
    try {
      await showNotifications();
      // await fetchNotifications();
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  const handleUpload = async (e: InputEvent) => {
    const namePrefix = 'ImageGallery';

    const { files } = e.target as HTMLInputElement;
    if (files === null || files.length < 1) {
      console.log('nothing selected');
      return;
    }

    // handleFileSelected(e.target.files[0])
    try {
      const uploadName = [namePrefix, ''].join('|');
      const web3storage = new Web3Storage({ token: TOKEN });
      const imageFile = files[0];
      const metadataFile = jsonFile('metadata.json', { path: imageFile.name });

      const cid = await web3storage.put([imageFile, metadataFile], {
        // the name is viewable at https://web3.storage/files and is included in the status and list API responses
        name: uploadName,

        onRootCidReady: (localCid) => {
          console.log('Local CID: ', localCid);
        },

        onStoredChunk: (bytes) =>
          console.log(`sent ${bytes.toLocaleString()} bytes to web3.storage`),
      });

      const metadataGatewayURL = makeGatewayURL(cid, 'metadata.json');
      const imageGatewayURL = makeGatewayURL(cid, imageFile.name);
      const imageURI = `ipfs://${cid}/${imageFile.name}`;
      const metadataURI = `ipfs://${cid}/metadata.json`;
      updateUploadInfo(
        cid,
        metadataGatewayURL,
        imageGatewayURL,
        imageURI,
        metadataURI,
      );

      await uploadFile();
    } catch (err) {
      console.error(err);
      dispatch({ type: MetamaskActions.SetError, payload: err });
    }
  };

  return (
    <Container>
      <Heading>
        Welcome to <Span>template-snap</Span>
      </Heading>
      <Subtitle>
        Get started by editing <code>src/index.ts</code>
      </Subtitle>
      <CardContainer>
        {state.error && (
          <ErrorMessage>
            <b>An error happened:</b> {state.error.message}
          </ErrorMessage>
        )}
        {!state.isFlask && (
          <Card
            content={{
              title: 'Install',
              description:
                'Snaps is pre-release software only available in MetaMask Flask, a canary distribution for developers with access to upcoming features.',
              button: <InstallFlaskButton />,
            }}
            fullWidth
          />
        )}
        {!state.installedSnap && (
          <Card
            content={{
              title: 'Connect',
              description:
                'Get started by connecting to and installing the example snap.',
              button: (
                <ConnectButton
                  onClick={handleConnectClick}
                  disabled={!state.isFlask}
                />
              ),
            }}
            disabled={!state.isFlask}
          />
        )}
        {shouldDisplayReconnectButton(state.installedSnap) && (
          <Card
            content={{
              title: 'Reconnect',
              description:
                'While connected to a local running snap this button will always be displayed in order to update the snap if a change is made.',
              button: (
                <ReconnectButton
                  onClick={handleConnectClick}
                  disabled={!state.installedSnap}
                />
              ),
            }}
            disabled={!state.installedSnap}
          />
        )}
        <Card
          content={{
            title: 'Upload file',
            description: 'Upload file to send',
            button: (
              <UploadFileInput
                onChange={handleUpload}
                disabled={!state.installedSnap}
              />
            ),
          }}
          disabled={!state.installedSnap}
          fullWidth={
            state.isFlask &&
            Boolean(state.installedSnap) &&
            !shouldDisplayReconnectButton(state.installedSnap)
          }
        />
        <Card
          content={{
            title: 'Get notifications',
            description: 'get notifications',
            button: (
              <ShowNotificationsButton
                onClick={handleShowNotificationsClick}
                disabled={!state.installedSnap}
              />
            ),
          }}
          disabled={!state.installedSnap}
          fullWidth={
            state.isFlask &&
            Boolean(state.installedSnap) &&
            !shouldDisplayReconnectButton(state.installedSnap)
          }
        />
        <Card
          content={{
            title: 'Send Hello message',
            description:
              'Display a custom message within a confirmation screen in MetaMask.',
            button: (
              <SendHelloButton
                onClick={handleSendHelloClick}
                disabled={!state.installedSnap}
              />
            ),
          }}
          disabled={!state.installedSnap}
          fullWidth={
            state.isFlask &&
            Boolean(state.installedSnap) &&
            !shouldDisplayReconnectButton(state.installedSnap)
          }
        />
        <Notice>
          <p>
            Please note that the <b>snap.manifest.json</b> and{' '}
            <b>package.json</b> must be located in the server root directory and
            the bundle must be hosted at the location specified by the location
            field.
          </p>
        </Notice>
      </CardContainer>
    </Container>
  );
};

export default Index;
