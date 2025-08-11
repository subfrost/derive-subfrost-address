"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAddress = exports.computeAddress = exports.fetchSigner = exports.NETWORKS = void 0;
const rpc_1 = require("alkanes/lib/rpc");
const bitcoin = __importStar(require("bitcoinjs-lib"));
const ecpair_1 = __importDefault(require("ecpair"));
const ecc = __importStar(require("tiny-secp256k1"));
bitcoin.initEccLib(ecc);
const ECPair = (0, ecpair_1.default)(ecc);
exports.NETWORKS = {
    mainnet: 'https://mainnet.sandshrew.io/v2/lasereyes',
    signet: 'https://signet.subfrost.io/v4/subfrost',
    subnet: 'https://regtest.subfrost.io/v4/subfrost',
    regtest: 'http://localhost:18888'
};
const stripHexPrefix = (v) => v.substr(0, 2) === '0x' ? v.substr(2) : v;
const addHexPrefix = (v) => '0x' + stripHexPrefix(v);
const ln = (v) => ((console.log(v)), v);
const fetchSigner = async (rpc) => {
    return Buffer.from(stripHexPrefix((await (new rpc_1.AlkanesRpc({
        baseUrl: exports.NETWORKS[rpc] || rpc
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
exports.fetchSigner = fetchSigner;
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
const computeAddress = (internalPubkey, network) => {
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
};
exports.computeAddress = computeAddress;
const getAddress = async (network) => {
    return (0, exports.computeAddress)(await (0, exports.fetchSigner)(network), network);
};
exports.getAddress = getAddress;
//# sourceMappingURL=index.js.map