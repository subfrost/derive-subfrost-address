import { AlkanesRpc } from "alkanes/lib/rpc";

export const NETWORKS = {
  mainnet: 'https://mainnet.sandshrew.io/v2/lasereyes',
  signet: 'https://signet.subfrost.io/v4/subfrost',
  subnet: 'https://regtest.subfrost.io/v4/subfrost',
  regtest: 'http://localhost:18888'
};

const stripHexPrefix = (v) => v.substr(0, 2) === '0x' ? v.substr(2) : v;
const addHexPrefix = (v) => '0x' + stripHexPrefix(v)

export const fetchSigner = async (rpc) => {
  return Buffer.from(stripHexPrefix((await (new AlkanesRpc({
    baseUrl: NETWORKS[rpc] || rpc
  })).simulate({
    alkanes: [],
    height: 880000,
    vout: 0,
    target: {
      block: 32n,
      tx: 0n
    },
    inputs: [103n],
    pointer: 0,
    refundPointer: 0,
    block: Buffer.from([]),
    transaction: Buffer.from([])
  })).execution.data), 'hex');
};
