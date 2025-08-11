"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchSigner = exports.NETWORKS = void 0;
const rpc_1 = require("alkanes/lib/rpc");
exports.NETWORKS = {
    mainnet: 'https://mainnet.sandshrew.io/v2/lasereyes',
    signet: 'https://signet.subfrost.io/v4/subfrost',
    subnet: 'https://regtest.subfrost.io/v4/subfrost',
    regtest: 'http://localhost:18888'
};
const stripHexPrefix = (v) => v.substr(0, 2) === '0x' ? v.substr(2) : v;
const addHexPrefix = (v) => '0x' + stripHexPrefix(v);
const fetchSigner = async (rpc) => {
    return stripHexPrefix((await (new rpc_1.AlkanesRpc({
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
    })).execution.data);
};
exports.fetchSigner = fetchSigner;
//# sourceMappingURL=index.js.map