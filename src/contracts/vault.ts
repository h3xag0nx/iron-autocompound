import { Contract } from '@ethersproject/contracts';
import { BaseProvider } from '@ethersproject/providers';
import { Signer } from '@ethersproject/abstract-signer';
import { Interface } from '@ethersproject/abi';

const signature = [
  'function compound() external',
  'function abandoned() view returns (bool)',
];

export class Vault extends Contract {
  constructor(provider: BaseProvider | Signer, address: string) {
    super(address, new Interface(signature), provider);
  }
}
