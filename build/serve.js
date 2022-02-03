"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_helpers_1 = require("./test-helpers");
(0, test_helpers_1.setup)(false)
    .then(() => {
    console.log('Tables created');
    console.log('They will be removed upon existing this script gracefully.');
    process.on('SIGTERM', async () => {
        await (0, test_helpers_1.cleanup)();
        console.log('Dropping tables');
        process.exit(1);
    });
    process.on('SIGINT', async () => {
        await (0, test_helpers_1.cleanup)();
        console.log('Dropping tables');
        process.exit(1);
    });
})
    .catch(console.log);
