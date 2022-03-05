pragma solidity >=0.4.22 <0.8.0;

contract HashedTimeLockETH {


     event HTLCCreate(
        bytes32 indexed contractId,
        address indexed sender,
        address indexed receiver,
        uint amount,
        bytes32 hashlock,
        uint timelock
    );

    event HTLCWithdraw(bytes32 indexed contractId);
    event HTLCRefund(bytes32 indexed contractId);

    struct HTLContract {
        address payable sender;    // 
        address payable receiver;  // 
        uint amount;
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

    function createContract(address payable receiver, bytes32 hashlock, uint timelock) 
        external
        payable
        returns (bytes32 contractId)
    {
        require(msg.value > 0, "msg.value must be > 0");
        require(timelock > now, "timelock must > now");

        contractId = sha256(
            abi.encodePacked(
                msg.sender,
                receiver,
                msg.value,
                hashlock,
                timelock
            )
        );
        // contract have exist
        if (contractIsExist(contractId))
            revert("Contract have exist");

        // save contractId => HTLContract
        contracts[contractId] = HTLContract(
            msg.sender,
            receiver,
            msg.value,
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
            msg.value,
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
        require(contracts[contractId].hashlock == sha256(abi.encodePacked(secret)), "hashlock hash does not match");
        require(contracts[contractId].receiver == msg.sender, "sender is not receiver");
        require(contracts[contractId].isWithdraw == false, "amount already withdrawn");
        require(contracts[contractId].isRefund == false, "amount already refunded");
        require(contracts[contractId].timelock > now, "timelock already expired");

        HTLContract storage c = contracts[contractId];
        c.isWithdraw = true;
        c.secret = secret;
        c.receiver.transfer(c.amount);
        

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
        require(contracts[contractId].isRefund == false, "amount already refunded");
        require(contracts[contractId].isWithdraw == false, "amount already withdrawn");
        require(contracts[contractId].isRefund == false, "amount already refunded");
        require(contracts[contractId].timelock <= now, "timelock has not expire");

        HTLContract storage c = contracts[contractId];
        c.isRefund = true;
        c.sender.transfer(c.amount);

        emit HTLCRefund(contractId);

        return true;

    }

    function getContractDetail(bytes32 contractId) 
        public 
        view 
        returns (
            address sender,
            address receiver,
            uint amount,
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
                c.amount,
                c.hashlock,
                c.timelock,
                c.isWithdraw,
                c.isRefund
            );
        } else {
            return (address(0), address(0), 0, 0, 0, false, false);
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