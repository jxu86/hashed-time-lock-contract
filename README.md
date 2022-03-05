# hashed-time-lock-contract

`Truffle v5.4.10`  
`solc: 0.5.16`

## Run test
```
npm install
npm run ganache
npm test
```
## run web-server 
The project is not fully completed, It mainly completes the interface of the contract. the main code path in web-server/app/service

```
cd web-server
npm install
npm run
```

## The main framework 
![](docs/web-server-contract.jpeg)

## The main flow diagram
### ETH createContract and receiver withdraw
![](docs/htlc-eth.jpeg)

### ETH createContract and sender refund
![](docs/htlc-eth-refund.jpeg)

### ERC20 createContract and receiver withdraw
![](docs/htlc-erc20.jpeg)

### ERC20 createContract and sender refund
![](docs/htlc-erc20-refund.jpeg)


## TODO
* Complete the web-server according to the business logic
* Increase unit test coverage
* add unit test for web-server
* update solc version
   