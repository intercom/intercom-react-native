import { MMKVLoader } from 'react-native-mmkv-storage';

export const storage = new MMKVLoader()
  .withInstanceID('defaultApp')
  .withEncryption()
  .initialize();
