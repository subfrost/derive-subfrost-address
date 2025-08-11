import { AlkanesRpc } from "alkanes/lib/rpc";
import * as bitcoin from 'bitcoinjs-lib';
import ECPairFactory from 'ecpair';
import * as ecc from 'tiny-secp256k1';

bitcoin.initEccLib(ecc);
const ECPair = ECPairFactory(ecc);

export const NETWORKS = {
  mainnet: 'https://mainnet.sandshrew.io/v2/lasereyes',
  signet: 'https://signet.subfrost.io/v4/subfrost',
  subnet: 'https://regtest.subfrost.io/v4/subfrost',
  regtest: 'http://localhost:18888'
};

const stripHexPrefix = (v) => v.substr(0, 2) === '0x' ? v.substr(2) : v;
const addHexPrefix = (v) => '0x' + stripHexPrefix(v)

const ln = (v) => ((console.log(v)), v);

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

/**
 * Computes a P2TR (Pay-to-Taproot) address from a given public key.
 *
 * This function takes a public key as a Buffer and a network identifier string.
 * It computes the taproot output address, which is consistent with how the
 * reference Rust implementation in subfrost-alkanes derives addresses.
 *
 * @param {Buffer} pubkey The public key to derive the address from. This should be the buffer returned by fetchSigner.
 * @param {string} network The Bitcoin network to use ('mainnet', 'signet', 'testnet', or 'regtest').
 * @returns {string | undefined} The computed P2TR address as a string, or undefined if the network is invalid.
 */
export const computeAddress = (internalPubkey: Buffer, network: string): string | undefined => {
  let bNetwork;
  switch (network) {
    case 'mainnet':
      bNetwork = bitcoin.networks.bitcoin;
      break;
    case 'testnet':
    case 'signet':
      bNetwork = bitcoin.networks.testnet;
      break;
    case 'regtest':
      bNetwork = bitcoin.networks.regtest;
      break;
    default:
      return undefined;
  }
  const { address } = bitcoin.payments.p2tr({
    internalPubkey,
    network: bNetwork,
  });
  return address;
}

export const getAddress = async (network) => {
  return computeAddress(await fetchSigner(network), network);
};
