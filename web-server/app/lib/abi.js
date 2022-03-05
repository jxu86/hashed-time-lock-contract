const emojiContractABI = [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "openId",
          "type": "string"
        },
        {
          "indexed": false,
          "name": "nickName",
          "type": "string"
        },
        {
          "indexed": false,
          "name": "gender",
          "type": "string"
        },
        {
          "indexed": false,
          "name": "wechat",
          "type": "string"
        },
        {
          "indexed": false,
          "name": "phone",
          "type": "string"
        },
        {
          "indexed": false,
          "name": "sessionKey",
          "type": "string"
        },
        {
          "indexed": false,
          "name": "unionId",
          "type": "string"
        }
      ],
      "name": "SetUserInfo",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "obejectId",
          "type": "string"
        },
        {
          "indexed": false,
          "name": "openId",
          "type": "string"
        },
        {
          "indexed": false,
          "name": "emojiName",
          "type": "string"
        },
        {
          "indexed": false,
          "name": "emojipkg",
          "type": "string"
        },
        {
          "indexed": false,
          "name": "filePath",
          "type": "string"
        },
        {
          "indexed": false,
          "name": "desc",
          "type": "string"
        },
        {
          "indexed": false,
          "name": "addr",
          "type": "string"
        },
        {
          "indexed": false,
          "name": "createdAt",
          "type": "string"
        },
        {
          "indexed": false,
          "name": "updatedAt",
          "type": "string"
        },
        {
          "indexed": false,
          "name": "tags",
          "type": "string"
        }
      ],
      "name": "SetEmoji",
      "type": "event"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "openId",
          "type": "string"
        },
        {
          "name": "nickName",
          "type": "string"
        },
        {
          "name": "gender",
          "type": "string"
        },
        {
          "name": "wechat",
          "type": "string"
        },
        {
          "name": "phone",
          "type": "string"
        },
        {
          "name": "sessionKey",
          "type": "string"
        },
        {
          "name": "unionId",
          "type": "string"
        }
      ],
      "name": "setUserInfo",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "openId",
          "type": "string"
        }
      ],
      "name": "getUserInfoByOpenId",
      "outputs": [
        {
          "name": "Id",
          "type": "string"
        },
        {
          "name": "nickName",
          "type": "string"
        },
        {
          "name": "gender",
          "type": "string"
        },
        {
          "name": "wechat",
          "type": "string"
        },
        {
          "name": "phone",
          "type": "string"
        },
        {
          "name": "sessionKey",
          "type": "string"
        },
        {
          "name": "unionId",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "getUserNumber",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "index",
          "type": "uint256"
        }
      ],
      "name": "getUserInfoByIndex",
      "outputs": [
        {
          "name": "Id",
          "type": "string"
        },
        {
          "name": "nickName",
          "type": "string"
        },
        {
          "name": "gender",
          "type": "string"
        },
        {
          "name": "wechat",
          "type": "string"
        },
        {
          "name": "phone",
          "type": "string"
        },
        {
          "name": "sessionKey",
          "type": "string"
        },
        {
          "name": "unionId",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "obejectId",
          "type": "string"
        },
        {
          "name": "openId",
          "type": "string"
        },
        {
          "name": "emojiName",
          "type": "string"
        },
        {
          "name": "emojipkg",
          "type": "string"
        },
        {
          "name": "filePath",
          "type": "string"
        },
        {
          "name": "tags",
          "type": "string"
        },
        {
          "name": "desc",
          "type": "string"
        },
        {
          "name": "addr",
          "type": "string"
        },
        {
          "name": "createdAt",
          "type": "string"
        },
        {
          "name": "updatedAt",
          "type": "string"
        }
      ],
      "name": "setEmoji",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "getEmojiNumber",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "obejectId",
          "type": "string"
        }
      ],
      "name": "getEmojiByObjectId",
      "outputs": [
        {
          "name": "Id",
          "type": "string"
        },
        {
          "name": "openId",
          "type": "string"
        },
        {
          "name": "emojiName",
          "type": "string"
        },
        {
          "name": "emojipkg",
          "type": "string"
        },
        {
          "name": "filePath",
          "type": "string"
        },
        {
          "name": "tags",
          "type": "string"
        },
        {
          "name": "desc",
          "type": "string"
        },
        {
          "name": "addr",
          "type": "string"
        },
        {
          "name": "createdAt",
          "type": "string"
        },
        {
          "name": "updatedAt",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "openId",
          "type": "string"
        }
      ],
      "name": "getEmojiNumberByOpenId",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "openId",
          "type": "string"
        },
        {
          "name": "index",
          "type": "uint256"
        }
      ],
      "name": "getEmojiByOpenId",
      "outputs": [
        {
          "name": "Id",
          "type": "string"
        },
        {
          "name": "userId",
          "type": "string"
        },
        {
          "name": "emojiName",
          "type": "string"
        },
        {
          "name": "emojipkg",
          "type": "string"
        },
        {
          "name": "filePath",
          "type": "string"
        },
        {
          "name": "tags",
          "type": "string"
        },
        {
          "name": "desc",
          "type": "string"
        },
        {
          "name": "addr",
          "type": "string"
        },
        {
          "name": "createdAt",
          "type": "string"
        },
        {
          "name": "updatedAt",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "index",
          "type": "uint256"
        }
      ],
      "name": "getEmojiByIndex",
      "outputs": [
        {
          "name": "Id",
          "type": "string"
        },
        {
          "name": "userId",
          "type": "string"
        },
        {
          "name": "emojiName",
          "type": "string"
        },
        {
          "name": "emojipkg",
          "type": "string"
        },
        {
          "name": "filePath",
          "type": "string"
        },
        {
          "name": "tags",
          "type": "string"
        },
        {
          "name": "desc",
          "type": "string"
        },
        {
          "name": "addr",
          "type": "string"
        },
        {
          "name": "createdAt",
          "type": "string"
        },
        {
          "name": "updatedAt",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    }
  ]


exports.emojiContractABI = emojiContractABI
