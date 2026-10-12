import { DeviceEventEmitter } from 'react-native';

jest.mock('../src/nativeModules', () => ({
  IntercomModule: {
    setUserJwtProvider: jest.fn(() => Promise.resolve(true)),
    removeUserJwtProvider: jest.fn(() => Promise.resolve(true)),
    completeUserJwtRequest: jest.fn(),
  },
  IntercomEventEmitter: {
    USER_JWT_REQUESTED_NOTIFICATION: 'IntercomUserJwtRequested',
    addListener: jest.fn(),
    removeListeners: jest.fn(),
  },
}));

const { IntercomModule } = jest.requireMock('../src/nativeModules');
const Intercom = require('../src').default;

const requestJwt = async (requestId: string) => {
  DeviceEventEmitter.emit('IntercomUserJwtRequested', { requestId });
  await new Promise((resolve) => setImmediate(resolve));
};

describe('setUserJwtProvider', () => {
  beforeEach(() => jest.clearAllMocks());
  afterEach(() => Intercom.removeUserJwtProvider());

  test('completes the request with the JWT the provider resolves', async () => {
    await Intercom.setUserJwtProvider(() => Promise.resolve('fresh-jwt'));
    await requestJwt('1');

    expect(IntercomModule.setUserJwtProvider).toHaveBeenCalledTimes(1);
    expect(IntercomModule.completeUserJwtRequest).toHaveBeenCalledWith(
      '1',
      'fresh-jwt'
    );
  });

  test.each([
    ['resolves null', () => Promise.resolve(null)],
    ['resolves an empty string', () => Promise.resolve('')],
    ['rejects', () => Promise.reject(new Error('offline'))],
  ])('fails the request when the provider %s', async (_, provider) => {
    await Intercom.setUserJwtProvider(provider);
    await requestJwt('2');

    expect(IntercomModule.completeUserJwtRequest).toHaveBeenCalledWith(
      '2',
      null
    );
  });

  test('only the latest provider answers', async () => {
    const first = jest.fn(() => Promise.resolve('first'));
    await Intercom.setUserJwtProvider(first);
    await Intercom.setUserJwtProvider(() => Promise.resolve('second'));
    await requestJwt('3');

    expect(first).not.toHaveBeenCalled();
    expect(IntercomModule.completeUserJwtRequest).toHaveBeenCalledTimes(1);
    expect(IntercomModule.completeUserJwtRequest).toHaveBeenCalledWith(
      '3',
      'second'
    );
  });

  test('stops answering after removeUserJwtProvider', async () => {
    const provider = jest.fn(() => Promise.resolve('jwt'));
    await Intercom.setUserJwtProvider(provider);
    await Intercom.removeUserJwtProvider();
    await requestJwt('4');

    expect(IntercomModule.removeUserJwtProvider).toHaveBeenCalledTimes(1);
    expect(provider).not.toHaveBeenCalled();
    expect(IntercomModule.completeUserJwtRequest).not.toHaveBeenCalled();
  });
});
