# NFT Workshop - Reactjs
**Workshop duration:** 30 min
**Workshop outputs:** Self hosted, self sovereign NFT collection
## Workshop Contents

- Introduction to Apillon
- Creating Images for the collection using Midjourney
- Handling NFT metadata
- Deploying NFT smart contract from the Dashboard
- React NFT Collection template - GIT
  - Template usage and adjustment
  - Template upload to Hosting
  - Custom domain setup

## Using the git repo
Git repo includes the following files: 
- NFT images used in the workshop are in the folder **NFT-images**
- CSV file with descriptions ready for bulk import is named **NFT-CSV.csv**
- Reactjs template is included in the repo

## Using the React Template

This git already includes the react-js template that is able to connect to newly deployed collection, with minting and displaying functionalities. 

## Configure

Before the template can interact with the Smart Contract you have deployed via UI, it needs to be manually configured.

To configure the template, do the following:

1. Open the .env file in code editor
2. Change the first line by entering your smart contract address between parenthesis
3. Select the chain version by commenting and uncommenting the right chain

Example:

```sh
const nftAddress = ""; // Paste the address of the NFT collection between the parenthesis

// uncomment the chain you are using by deleting the slashes
// const chainId = "0x507"; // Moonbase
// const chainId = "0x504"; // Moonbeam
// const chainId = "0x250"; // Astar
```

Once you have updated the .env. file, save it. Now the website files are ready to be deployed.
​

## Preview the website on your computer

Before uploading the website to Apillon hosting, feel free to edit the code, add any customization or just review whether everything works as expected.

To preview the website on your computer you need to serve a http server from the root folder of the website. For example, you can run node package http-server from root folder like this:

```sh
npm run dev
```

## Deploy to Apillon Hosting

### Basic

1. If not already, register to [Apillon.io](https://app.apillon.io)
2. Log in to Apillon console and create new Hosting bucket inside your project.
3. Select all files of your website (as configured in the previous step) and use drag&drop action to pull the files into the Hosting bucket
4. Once the files are uploaded, push them to Staging and finally to the Production
5. Add your custom domain (as displayed in the dashboards UI)
6. Review your newly deployed website

### Advanced

To deploy your NFT website to Apillon Hosting you should:

1. Clone this repository and [configure](#configure) it to your needs.
2. If not already, register to [Apillon.io](https://app.apillon.io)
3. Log in to Apillon console and create new Hosting bucket inside your project.
4. In settings, create an API KEY with storage permissions. Write down API key and API secret.
5. In your github repository setup actions secrets (variables)
   - WEBSITE_UUID : copy UUID from hosting bucket on Apillon dashboard
   - APILLON_API_KEY : your previously created API key
   - APILLON_API_SECRET : your previously created API secret

Now everything should be ready. When you will push to master branch, your website should start deploy to Apillon IPFS hosting. Monitor progress on [Apillon.io](https://app.apillon.io) dashboard. After some time you'll be able to get IPNS url and also setup your own domain.

You can change behavior of the automatic deployment by editing [/.github/workflows/deploy.yml](/.github/workflows/deploy.yml).
