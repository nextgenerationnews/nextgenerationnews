const DexNewsContract = artifacts.require('DexNews');
const DomTokenContract = artifacts.require('DOMToken');

contract('DexNews', accounts => {
  it('deploy successfully', async () => {
    const instance = await DexNewsContract.deployed();
    expect(instance).to.be.ok;
  });

  it('can post news and retrieve them', async () => {
    const instance = await DexNewsContract.deployed();
    await instance.createPost(
      ['test-slug-01', 'tech', 'Some random title', 'Some random subtitle', '{}', 'us', 'aaa.png'],
      10,
      30,
    );
    const post = await instance.getPostBySlug('test-slug-01');
    expect(post.post.exists).to.eq(true);
    expect(post.post.title).to.eq('Some random title');
    expect(post.post.listed).to.eq(false);
    expect(instance).to.be.ok;
  });

  it('can approve post', async () => {
    const instance = await DexNewsContract.deployed();
    const domToken = await DomTokenContract.deployed();
    await instance.createPost(
      ['test-slug-02', 'tech', 'Some random title', 'Some random subtitle', '{}', 'us', 'aaa.png'],
      10,
      30,
    );
    const post = await instance.getPostBySlug('test-slug-02');
    expect(post.post.exists).to.eq(true);
    expect(post.post.listed).to.eq(false);
    await domToken.approve(instance.address, 1000);
    const balance = await domToken.balanceOf(accounts[0]);
    console.log('balance');
    console.log(balance);
    await instance.applyForPostValidator(1);
    await instance.setPostValidationResult(1, 10, 'Very good!');
    const post2 = await instance.getPostBySlug('test-slug-01');
    console.log(post2.post.score);
    expect(instance).to.be.ok;
  });
});
