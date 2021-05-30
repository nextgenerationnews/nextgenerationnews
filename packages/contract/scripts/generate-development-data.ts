/* eslint-disable no-console */
import MockPostColumns from '../mock-data/mock-post.json';
import MigrationAddresses from '../deployed_contracts/addresses.json';
import TruffleConfig from '../truffle-config';
import DexNewsAbi from '../build/contracts/DexNews.json';
import { DexNews } from '../build/types-lib/DexNews';
import { providers, Contract } from 'ethers';

async function generateData() {
  const contractAddress = MigrationAddresses[TruffleConfig.networks.development.ganacheOptions.chainId].DexNews;

  const provider = new providers.JsonRpcProvider('http://localhost:8545');
  const contract = (new Contract(
    contractAddress,
    (DexNewsAbi.abi as unknown) as any,
    provider.getSigner(),
  ) as unknown) as DexNews;

  for (let i = 0; i < 50; i++) {
    const postContent = [
      {
        data: { text: `MOCK ARTICLE #${i}`, level: 2 },
        type: 'Header',
      },
      ...MockPostColumns,
    ];

    const slug = `mock-article-${i}-${Date.now()}`;

    console.log(`Creating post #${i + 1}`);

    // _slug=0, _category=1, _title=2, _subtitle=3, _content=4, _country=5, _bannerImg=6
    await contract.createPost(
      [
        slug,
        'tech',
        `Lorem ipsum dolor sit amet #${i}`,
        `Lorem ipsum dolor sit amet, consectetur adipiscing elit #${i}`,
        JSON.stringify({
          blocks: postContent,
          time: Date.now() - 1000 * i,
        }),
        'us',
        'https://i.ibb.co/1ZcyhGQ/Blockchain1.jpg',
      ],
      1,
      1,
    );

    const amountOfDonations = Math.floor(Math.random() * 20);

    console.log(`Generating ${amountOfDonations} donations...`);

    for (let j = 0; j < amountOfDonations; j++) {
      const value = 500000000000000000 + Math.round(300000000000000000 * Math.max(Math.random(), 0.01));
      console.log(`Donation #${j} - value: ${value} wei`);
      await contract.sendPostDonation(slug, {
        value: `0x${value.toString(16)}`,
      });
    }
  }
}

generateData();
