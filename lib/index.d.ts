export declare const NETWORKS: {
    mainnet: string;
    signet: string;
    subnet: string;
    regtest: string;
};
export declare const fetchSigner: (rpc: any) => Promise<Buffer<ArrayBuffer>>;
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
export declare const computeAddress: (internalPubkey: Buffer, network: string) => string | undefined;
export declare const getAddress: (network: any) => Promise<string>;
