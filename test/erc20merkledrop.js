const { expect } = require("chai");
const tokens = require("./tokens.json");
const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");
const { ethers } = require("hardhat");

function hashToken(tokenId, account) {
  return Buffer.from(
    ethers.utils
      .solidityKeccak256(["uint256", "address"], [tokenId, account])
      .slice(2),
    "hex"
  );
}

describe("ERC20MerkleDrop", () => {
  it("Should deploy and claim drop", async () => {
    const [signer] = await ethers.getSigners();
    const merkleTree = new MerkleTree(
      Object.entries(tokens).map((token) => hashToken(...token)),
      keccak256,
      { sortPairs: true }
    );
    const erc20Drop = await ethers.deployContract("ERC20MerkleDrop", [
      signer.address,
      merkleTree.getHexRoot(),
    ]);

    for (const [tokenId, account] of Object.entries(tokens)) {
      const proof = merkleTree.getHexProof(hashToken(tokenId, account));
      await expect(erc20Drop.redeem(account, tokenId, proof))
        .to.emit(erc20Drop, "Transfer")
        .withArgs(ethers.constants.AddressZero, account, tokenId);
      expect(await erc20Drop.balanceOf(account)).to.equal(tokenId);
    }
  });
});
