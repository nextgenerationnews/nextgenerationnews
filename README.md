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

Use the ganache local test provider in the connect wallet prompt. (the project has not yet been deployed to a mainnet/testnet)

# DApp Screenshots

![image](https://user-images.githubusercontent.com/85082452/120127388-a48e2900-c195-11eb-9940-78b22c1203ff.png)|![image](https://user-images.githubusercontent.com/85082452/120127459-cedfe680-c195-11eb-8000-6767e987adc6.png)
![image](https://user-images.githubusercontent.com/85082452/120127474-d7d0b800-c195-11eb-87ea-12d7b2e78e8b.png)
![image](https://user-images.githubusercontent.com/85082452/120127591-2aaa6f80-c196-11eb-8788-331b220fa6cc.png)
![image](https://user-images.githubusercontent.com/85082452/120127617-3dbd3f80-c196-11eb-9e71-65f7e738db8f.png)
![image](https://user-images.githubusercontent.com/85082452/120127634-4746a780-c196-11eb-8699-c4d4bf186322.png)
![image](https://user-images.githubusercontent.com/85082452/120127654-53cb0000-c196-11eb-8865-a07e463d285d.png)
![image](https://user-images.githubusercontent.com/85082452/120127663-5a597780-c196-11eb-8590-e99004fc327a.png)
![image](https://user-images.githubusercontent.com/85082452/120127674-62b1b280-c196-11eb-8ff9-fa55ae28592c.png)
![image](https://user-images.githubusercontent.com/85082452/120127688-69402a00-c196-11eb-9408-84120ad59941.png)



