const { assert } = require("chai");
const LockBox = artifacts.require("./LockBox");
const RandoNFT = artifacts.require("./RandoNFT");

require("chai").use(require("chai-as-promised")).should();

contract("LockBox", ([deployer, user1, user2]) => {
  let lockBox;

  before(async () => {
    lockBox = await LockBox.deployed();
  });

  it("deploys successfully", async () => {
    const address = await lockBox.address;
    assert.notEqual(address, 0x0);
    assert.notEqual(address, "");
    assert.notEqual(address, null);
    assert.notEqual(address, undefined);
  });

  it("creates boxes", async () => {
    const result = await lockBox.createBox(user1);
    const lockBoxTokenId = result.logs[0].args.tokenId.toNumber();
    const address = await lockBox.ownerOf(lockBoxTokenId);

    assert.equal(address, user1);
  });

  describe("storage", async () => {
    let randoNFT, randoNFTId, lockBoxTokenId;

    before(async () => {
      randoNFT = await RandoNFT.deployed();
      await randoNFT.createRandoNFT(deployer);
      const result = await randoNFT.createRandoNFT(user1);
      randoNFTId = result.logs[0].args.tokenId.toNumber();

      const result2 = await lockBox.createBox(user1);
      lockBoxTokenId = result2.logs[0].args.tokenId.toNumber();
    });

    it("can store ERC721 tokens owned by the caller", async () => {
      const result = await lockBox.storeToken(
        randoNFT.address,
        randoNFTId,
        lockBoxTokenId,
        {
          from: user1,
        }
      );

      const randoNFTOwner = result.logs[0].args.boxOwner;
      assert.equal(randoNFTOwner, user1);
    });

    it("won't store tokens not owned by the caller", async () => {
      await lockBox.storeToken(randoNFT.address, randoNFTId, lockBoxTokenId, {
        from: user2,
      }).should.be.rejected;
    });

    it("shows contents of an unlocked box", async () => {
      await lockBox.setBoxLocked(lockBoxTokenId, false, {
        from: user1,
      });

      const result = await lockBox.viewBoxContents(lockBoxTokenId, {
        from: user2, // ANY user can view box contents if unlocked
      });

      const randoAddr = await randoNFT.address;
      const ownerOfContents = await randoNFT.ownerOf(result.tokenId);

      assert.equal(result.tokenContract, randoAddr);
      assert.equal(result.tokenId, randoNFTId);
      assert.equal(ownerOfContents, user1);
    });

    it("hides contents of a locked box", async () => {
      await lockBox.setBoxLocked(lockBoxTokenId, true, {
        from: user1,
      });

      await lockBox.viewBoxContents(lockBoxTokenId, {
        from: user2,
      }).should.be.rejected;
    });
  });
});
