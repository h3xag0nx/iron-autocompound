import VaultFactoryAbi from '../abis/VaultFactory.json';
import { Contract } from '@ethersproject/contracts';
import { BaseProvider } from '@ethersproject/providers';

export class VaultFactory extends Contract {
  constructor(provider: BaseProvider) {
    super(
      '0x3631B6bBf1E51D18dAbd1D0e1b1589668DDF250B',
      VaultFactoryAbi,
      provider
    );
  }
}
