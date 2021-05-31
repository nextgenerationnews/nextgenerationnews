# Litepaper
[Litepaper Link](https://github.com/nextgenerationnews/nextgenerationnews/blob/main/packages/ui/src/assets/dexnews_litepaper.pdf)

# 0xHack Instructions:

- Clone the project
- Make sure you have:

  - Node >= 15.3 (you can use the projects .nvmrc files)
  - yarn
  - lerna

- `yarn install`
- `lerna bootstrap`

Go into the contracts folder "packages/contract"
Start the ganache local ethereum blockchain:

- `yarn start`
  - Wait for it to finish deploying everything.

Go into the ui folder: "packages/ui"
Start the UI server:

- `yarn start:http`

The app will be running under "http://localhost:8000"

You can use a script to generate articles development data:

Inside of the contract folder "packages/contract" after the contracts have already been deployed:

- `yarn generate-development-data`

# Your truffle-svelte template app

Use `yarn start` on the `contract` package to start the development server for contracts.
Use `yarn start` on the `ui` package to start the development server for the server ui.
Remember to always commit the `addresses.json` file after non-development deploys!
And dont forget to set the following environment variables (github secrets as well!):

SENTRY_DSN

INFURA_ID

FORTMATIC_KEY

PORTIS_KEY

BITSTKI_CLIENT_ID

BITSTKI_CALLBACK_URL

NETLIFY_AUTH_TOKEN

NETLIFY_SITE_ID

For deploying:

AUTH_MNEMONIC

DEPLOY_URL

- Note: if you plan to deploy from your local machine you will need to set those in your env too!

While deploying through Github Actions, you also need to set (to deploy to each network):

CONTRACT_AUTH_MNEMONIC_MAIN

CONTRACT_DEPLOY_URL_MAIN

CONTRACT_AUTH_MNEMONIC_RINKEBY

CONTRACT_DEPLOY_URL_RINKEBY

CONTRACT_AUTH_MNEMONIC_KOVAN

CONTRACT_DEPLOY_URL_KOVAN
