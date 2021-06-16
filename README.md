# IronFinance auto compound CLI

Auto compound CLI for [IronFinance vaults](https://ironfinance.medium.com/introducing-iron-private-vaults-1022dbdf47ab)

## Usage

Before all, please make sure you have node.js v12 or newer installed on your system.

1. Generate a config file:

```sh
npx @h3xag0nx/iron-autocompound@latest config -a <your addresses>
```

A config file will be created, located at `./config.toml` with the following content (kind of)

```toml
rpc = "https://rpc-mainnet.matic.network"
privateKey = "...."
harvester = "0xaaaaaaa..."
schedule = "* 0 * * * *"

[[vaults]]
address = "[vault addres]"
diabled = false
```

The address and private key of harvester (the address who can call compound method) is randomly generated. Feel free to change if you created your own.

**NOTE:**
If you decide to use the auto generated wallet, please make sure you have set the harvester address to the vault contract, via explorer UI. We also added a utility to print out URL to explorer page for each vault, so you can use the command `npx @h3xag0nx/iron-autocompound@latest explorer` to find out.

Each vault can be toggle using the `disabled` flag, or can be scheduled separately as such:

```
[[vaults]]
address = "[vault addres]"
diabled = false
schedule = "* 0 */3 * * * *"
```

This tool use [node-schedule](https://www.npmjs.com/package/node-schedule) under the hood, so please refer to this module document for format of the cron expression (the `"* 0 * * * *"` part).

2. Run the auto compound job

With the config generated before, all you have to do is run:

```sh
npx @h3xag0nx/iron-autocompound@latest run
```

More recipes will be updated on [wiki](https://github.com/h3xag0nx/iron-autocompound/wiki).
