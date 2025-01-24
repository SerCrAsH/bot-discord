import ytdl from "@distube/ytdl-core";
import { createAgent } from "@distube/ytdl-core/lib/agent.js";
import { applyIPv6Rotations } from "@distube/ytdl-core/lib/utils.js";


const options = {
  IPv6Block: "2001:2::/48"
};
applyIPv6Rotations(options);

console.log(`Applying this options: ${JSON.stringify(options)}`)

// Agt1
const agentForARandomIP = createAgent(undefined, options);
const info1 = await ytdl.getBasicInfo("https://www.youtube.com/watch?v=Q91hydQRGyM", { agent: agentForARandomIP });
console.log(`Info 1º: ${JSON.stringify(info1)}`)

// Agt2
const agentForAnotherRandomIP = createAgent(undefined, options);
const info2 = await ytdl.getInfo("http://www.youtube.com/watch?v=aqz-KE-bpKQ", { agent: agentForAnotherRandomIP });
console.log(`Info 2º: ${JSON.stringify(info2)}`)
