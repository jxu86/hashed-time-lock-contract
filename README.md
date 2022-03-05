# hashed-time-lock-contract
Hashed time lock contract for Ethereum


`Truffle v5.4.10`

## Run test
```
npm install
npm run ganache
npm test
```


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
* Increase unit test coverage
  