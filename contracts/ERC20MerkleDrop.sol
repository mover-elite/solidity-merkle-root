// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Token.sol";
import "./MerkleProof.sol";

contract ERC20MerkleDrop is Token {
    bytes32 immutable public root;

    constructor(address owner, bytes32 merkleroot)
    Token(owner)
    {
        root = merkleroot;
    }

    function redeem(address account, uint256 amount, bytes32[] calldata proof)
    external
    {
        require(_verify(_leaf(account, amount), proof), "Invalid merkle proof");
        _mint(account, amount);
    }

    function _leaf(address account, uint256 amount)
    internal pure returns (bytes32)
    {
        return keccak256(abi.encodePacked(amount, account));
    }

    
    function _verify(bytes32 leaf, bytes32[] memory proof)
    internal view returns (bool)
    {
        return MerkleProof.verify(proof, root, leaf);
    }
}