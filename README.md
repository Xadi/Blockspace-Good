## Dependencies
Install these prerequisites 
- NPM: https://nodejs.org
- Truffle: https://github.com/trufflesuite/truffle
- Ganache: http://truffleframework.com/ganache/
- Metamask: https://metamask.io/


## Step 1. Clone the project
`git clone https://github.com/Xadi/Blockspace.git`

## Step 2. Install dependencies
```
$ cd Blockspace 
$ npm install
```
## Step 3. Start Ganache
Open the Ganache GUI client that you downloaded and installed. This will start your local blockchain instance.
Setup port as 8545

## Step 4. Compile & Deploy Election Smart Contract
`$ truffle migrate --reset`
You must migrate the election smart contract each time your restart ganache.

## Step 5. Configure Metamask
Select localhost 8545 network 

## Step 6. Run the Front End Application
`$ npm run start` --> requires lite-server: npm install -g lite-server
Visit this URL in your browser: http://localhost:8080

