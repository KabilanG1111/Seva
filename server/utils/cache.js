import NodeCache from 'node-cache';

// Initialize cache with standard check period of 10s
const cache = new NodeCache({ stdTTL: 600, checkperiod: 10 });

export default cache;
