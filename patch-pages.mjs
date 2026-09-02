import { readFileSync } from "fs";

const envLocal = readFileSync(".env.local", "utf8");
const envVars = {};
for (const line of envLocal.split("\n")) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (!m) continue;
  let val = m[2].trim();
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
    val = val.slice(1, -1);
  }
  envVars[m[1]] = { type: "secret_text", value: val };
}

const cfgPath = process.env.USERPROFILE + "/AppData/Roaming/xdg.config/.wrangler/config/default.toml";
const oauth = readFileSync(cfgPath, "utf8").match(/oauth_token\s*=\s*"([^"]+)"/)[1];
const account = "6284429c1b41e17dae8c7463b57f9f59";

const body = {
  deployment_configs: {
    production: {
      env_vars: envVars,
      kv_namespaces: {
        KV_STORE: { namespace_id: "d640a428bcee4e1f8e912b04da20835d" },
      },
      compatibility_flags: ["nodejs_compat"],
      fail_open: true,
    },
    preview: {
      env_vars: envVars,
      kv_namespaces: {
        KV_STORE: { namespace_id: "d640a428bcee4e1f8e912b04da20835d" },
      },
      compatibility_flags: ["nodejs_compat"],
      fail_open: true,
    },
  },
};

const r = await fetch(
  `https://api.cloudflare.com/client/v4/accounts/${account}/pages/projects/florin-b2b`,
  {
    method: "PATCH",
    headers: { Authorization: `Bearer ${oauth}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }
);
const j = await r.json();
console.log("success:", j.success);
if (!j.success) {
  console.log("errors:", JSON.stringify(j.errors, null, 2));
} else {
  const p = j.result.deployment_configs?.production;
  console.log("kv_namespaces:", JSON.stringify(p?.kv_namespaces));
  console.log("compat_flags:", JSON.stringify(p?.compatibility_flags));
  console.log("env_var_names:", Object.keys(p?.env_vars || {}).join(","));
  console.log("env_var_count:", Object.keys(p?.env_vars || {}).length);
}