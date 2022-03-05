pragma solidity >=0.4.22 <0.9.0;
import "openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";

contract HashedTimeLockERC721 {

     event HTLCCreate(
        bytes32 indexed contractId,
        address indexed sender,
        address indexed receiver,
        address tokenContract,
        uint256 tokenId,
        bytes32 hashlock,
        uint timelock
    );
    event HTLCWithdraw(bytes32 indexed contractId);
    event HTLCRefund(bytes32 indexed contractId);

    struct HTLContract {
        address sender;   
        address receiver;  
        address tokenContract;
        uint256 tokenId;
        bytes32 hashlock;
        uint timelock;
        bool isWithdraw;
        bool isRefund;
        bytes32 secret;
    }

    mapping (bytes32 => HTLContract) contracts;

    modifier contractExists(bytes32 contractId) {
        require(contractIsExist(contractId), "contractId not exist");
        _;
    }

    function createContract(address receiver, address tokenContract, uint256 tokenId, bytes32 hashlock, uint timelock) 
        external
        returns (bytes32 contractId)
    {
        require(
            ERC721(tokenContract).getApproved(tokenId) == address(this),
            "The HTLC must have been designated an approved spender for the tokenId"
        );
        require(timelock > now, "timelock must > now");

        contractId = sha256(
            abi.encodePacked(
                msg.sender,
                receiver,
                tokenContract,
                tokenId,
                hashlock,
                timelock
            )
        );
        // contract have exist
        if (contractIsExist(contractId))
            revert("Contract have exist");


        ERC721(tokenContract).transferFrom(msg.sender, address(this), tokenId);

        // save contractId => HTLContract
        contracts[contractId] = HTLContract(
            msg.sender,
            receiver,
            tokenContract,
            tokenId,
            hashlock,
            timelock,
            false,
            false,
            0x0
        );

        emit HTLCCreate(
            contractId,
            msg.sender,
            receiver,
            tokenContract,
            tokenId,
            hashlock,
            timelock
        );
    }


    function withdraw(bytes32 contractId, bytes32 secret)
        external
        contractExists(contractId)
        returns (bool)
    {
        // verify sender can withdraw
        require(contracts[contractId].hashlock == sha256(abi.encodePacked(secret)), "hashlock does not match");
        require(contracts[contractId].receiver == msg.sender, "sender is not receiver");
        require(contracts[contractId].isWithdraw == false, "token already withdrawn");
        require(contracts[contractId].isRefund == false, "token already refunded");
        require(contracts[contractId].timelock > now, "timelock already expired");

        HTLContract storage c = contracts[contractId];
        c.isWithdraw = true;
        ERC721(c.tokenContract).transferFrom(address(this), c.receiver, c.tokenId);
        emit HTLCWithdraw(contractId);
        return true;
    }

    function refund(bytes32 contractId) 
        external
        contractExists(contractId)
        returns (bool)
    {
        // verify sender can refund
        require(contracts[contractId].sender == msg.sender, " not sender");
        require(contracts[contractId].isRefund == false, "token already refunded");
        require(contracts[contractId].isWithdraw == false, "token already withdrawn");
        require(contracts[contractId].isRefund == false, "token already refunded");
        require(contracts[contractId].timelock <= now, "timelock has not expire");

        HTLContract storage c = contracts[contractId];
        c.isRefund = true;
        ERC721(c.tokenContract).transferFrom(address(this), c.sender, c.tokenId);

        emit HTLCRefund(contractId);
        return true;

    }

    function getContractDetail(bytes32 contractId) 
        public 
        view 
        returns (
            address sender,
            address receiver,
            address tokenContract,
            uint256 tokenId,
            bytes32 hashlock,
            uint timelock,
            bool isWithdraw,
            bool isRefund
        )
    {
        if (contractIsExist(contractId)) {
            HTLContract storage c = contracts[contractId];
            return (
                c.sender,
                c.receiver,
                c.tokenContract,
                c.tokenId,
                c.hashlock,
                c.timelock,
                c.isWithdraw,
                c.isRefund
            );
        } else {
            return (address(0), address(0), address(0), 0, 0, 0, false, false);
        }
    }

    function contractIsExist(bytes32 contractId)
        internal
        view
        returns (bool exist)
    {
        exist = (contracts[contractId].sender != address(0));
    }

}