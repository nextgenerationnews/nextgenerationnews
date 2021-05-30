// SPDX-License-Identifier: UNLICNSED
pragma solidity >=0.8.4;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";


contract DexNews {

    string[] public categories;
    string[] public countries;
    mapping(string => bool) private categoriesMap;
    mapping(string => bool) private countriesMap;
    bytes32 private emptyString = keccak256("");
    ERC20 public domToken;
    uint256 numberOfDOMRequiredToApprovePost;

    struct UserProfile {
        string name;
        string profileDescription;
        uint timeStamp;
        string imageUrl;
        string bannerUrl;
        uint8 validatorScore;
        bool exists;
    }

    struct Post {
        string slug;
        string category;
        uint timeStamp;
        address author;
        string title;
        string subtitle;
        string content;
        string country;
        string bannerUrl;
        uint donationsCount;
        bool exists;
        bool listed;
    }

    struct PostWithAuthorProfile {
        Post post;
        UserProfile authorProfile;
    }

    struct PostValidation {
      address validator;
      uint8 score;
      uint256 postId;
      string comment;
      uint timeStamp;
      bool validationDone;
      bool exists;
    }

    mapping(uint256 => uint256) postCreatedEpic;
    mapping(uint256 => uint8) validationDificultyLevel;
    mapping(uint256 => uint8) validationSuggestedTime;
    mapping(uint256 => uint256) private postScores;
    mapping(address => uint256) private donationsAmountForAddress;
    mapping(address => uint256) private approvalsAmountByAddress;
    mapping(uint256 => mapping(address => PostValidation)) private postValidations;
    mapping(uint256 => address[]) private postValidationsArray;
    mapping(address => UserProfile) public authorProfiles;
    mapping(string => uint256) public postBySlug;
    mapping(uint256 => uint256[]) public postRelations;
    Post[] public posts;
    uint256 private balanceForContractOwner;

    uint256 public creationTimestamp;
    address public contractOwner;

    constructor(ERC20 _domTokenAddress, string[] memory initialCategories, string[] memory initialCountries) {

       contractOwner = msg.sender;
       balanceForContractOwner = 0;
       // Create unexisting post (postBySlug defaults to index ZERO)
       posts.push(Post('', '', block.timestamp, msg.sender, '', '', '', '', '', 0, false, false));
       categories = initialCategories;
       for (uint i = 0; i < initialCategories.length; i++) {
           categoriesMap[initialCategories[i]] = true;
       }

       countries = initialCountries;
       for (uint i = 0; i < initialCountries.length; i++) {
           countriesMap[initialCountries[i]] = true;
       }

       domToken = ERC20(_domTokenAddress);
       creationTimestamp = block.timestamp;
       numberOfDOMRequiredToApprovePost = 20;
    }

    function getPostBySlug(string memory _slug) public view returns (PostWithAuthorProfile memory) {
        Post memory post = posts[postBySlug[_slug]];
        return PostWithAuthorProfile(post, authorProfiles[post.author]);
    }

    function getPostNumberBySlug(string memory _slug) public view returns (uint256) {
        return postBySlug[_slug];
    }

    function createCategory(string memory _name) public {
        require(msg.sender == contractOwner, "You are not the owner of this contract.");
        categories.push(_name);
        categoriesMap[_name] = true;
    }

    function createCountry(string memory _name) public {
        require(msg.sender == contractOwner, "You are not the owner of this contract.");
        countries.push(_name);
        countriesMap[_name] = true;
    }

    function deactivateCategory(string memory _name) public {
        require(msg.sender == contractOwner, "You are not the owner of this contract.");
        categoriesMap[_name] = false;
    }

    function deactivateCountry(string memory _name) public {
        require(msg.sender == contractOwner, "You are not the owner of this contract.");
        countriesMap[_name] = false;
    }

    function setUserProfile(string memory _name, string memory _profileDescription, string memory _imageUrl, string memory _bannerUrl) public {
        uint8 currentScore = authorProfiles[msg.sender].validatorScore;
        authorProfiles[msg.sender] = UserProfile(_name, _profileDescription, block.timestamp ,_imageUrl, _bannerUrl, currentScore, true);
    }

    function getUserProfile() public view returns (UserProfile memory) {
        return authorProfiles[msg.sender];
    }

    function getAuthorProfile(address payable _sender) public view returns (UserProfile memory) {
        return authorProfiles[_sender];
    }

    function createPost(string[] calldata functionParams, uint8 _validationDificultyLevel, uint8 _validationSuggestedTime) public returns (uint256) {
        // _slug=0, _category=1, _title=2, _subtitle=3, _content=4, _country=5, _bannerImg=6, validationDificultyLevel=7, validationSuggestedTime=8
        require(categoriesMap[functionParams[1]], "Invalid category");
        require(countriesMap[functionParams[5]], "Invalid country");
        require(posts[postBySlug[functionParams[0]]].exists == false, "This slug is not unique");
        postBySlug[functionParams[0]] = posts.length;
        posts.push(Post(functionParams[0], functionParams[1], block.timestamp, msg.sender, functionParams[2], functionParams[3], functionParams[4], functionParams[5], functionParams[6], 0, true, false));
        validationDificultyLevel[posts.length - 1] = _validationDificultyLevel;
        validationSuggestedTime[posts.length - 1] = _validationSuggestedTime;
        return posts.length - 1;
    }

    function setPostRelations(string calldata _slug, uint256[] calldata _postRelations) public {
        uint256 postId = postBySlug[_slug];
        require(posts[postId].author == msg.sender, "Only the author can set post relations");
        postRelations[postId] = _postRelations;
    }

    function sendPostDonation(string calldata postSlug) public payable {
       Post storage post = posts[postBySlug[postSlug]];
       require(post.exists, "Post with this slug does not exist.");
       post.donationsCount += 1;
       uint256 amountforContractOwner = msg.value / 9;
       donationsAmountForAddress[post.author] += msg.value - amountforContractOwner;
       balanceForContractOwner += amountforContractOwner;
    }

    function withDrawForAuthor(address payable _sender) public {
        require(_sender == msg.sender, "Your wallet address should be in the _sender parameter.");
        require(donationsAmountForAddress[msg.sender] > 0, "You don''t have any balance to withdraw.");
        _sender.transfer(donationsAmountForAddress[msg.sender]);
        donationsAmountForAddress[msg.sender] = 0;
    }

    function withDrawForContractOwner(address payable _sender) public {
        require(msg.sender == contractOwner, "You are not the owner of this contract.");
        require(_sender == contractOwner, "You are not the owner of this contract.");
        _sender.transfer(balanceForContractOwner);
        balanceForContractOwner = 0;
    }

    function getBalanceForContractOwner() public view returns (uint256) {
        require(msg.sender == contractOwner, "You are not the owner of this contract.");
        return balanceForContractOwner;
    }

    function getBalanceForAuthor() public view returns (uint256) {
        return donationsAmountForAddress[msg.sender];
    }

    function getCategoriesList() public view returns(string[] memory) {
        return categories;
    }

    function getCountriesList() public view returns(string[] memory) {
        return countries;
    }

    function getPostList(address _author, string memory _category, string memory _country, bool _approved, uint256 cursor, uint256 howMany) public view returns(PostWithAuthorProfile[] memory, uint256 newCursor) {
        PostWithAuthorProfile[] memory values = new PostWithAuthorProfile[](howMany);
        uint256 i = cursor;
        uint256 valuesSize = 0;

        while (valuesSize < howMany && i < posts.length) {
            i += 1;
            if (posts[i - 1].listed != _approved) {
              continue;
            }
            if (_author != address(0) && posts[i - 1].author != _author) {
                continue;
            } else if (keccak256(bytes(_category)) != emptyString && keccak256(bytes(posts[i -1].category)) != keccak256(bytes(_category))) {
                continue;
            } else if (keccak256(bytes(_country)) != emptyString && keccak256(bytes(posts[i-1].country)) != keccak256(bytes(_country))) {
                continue;
            }
            values[valuesSize].post = posts[i - 1];
            values[valuesSize].authorProfile = authorProfiles[values[valuesSize].post.author];
            valuesSize += 1;
        }
        return (values, cursor + valuesSize);
    }



    function getcurrentEpoch() public view returns (uint256) {
      // 1 epoch per day
      return (block.timestamp - creationTimestamp) / 60 / 60 / 24;
    }

    function getEpoch(uint _timeStamp) public view returns (uint256) {
      // 1 epoch per day
      return (_timeStamp - creationTimestamp) / 60 / 60 / 24;
    }

    function getPostScoreNeededToBeListed(uint _timeStamp) public view returns (uint256) {
      uint _epoch = getEpoch(_timeStamp);

      if (_epoch < 30) {
        return 15;
      }
      if (_epoch < 90) {
        return 40;
      }

      if(_epoch < 180) {
        return 80;
      }
      return 100;
    }

    function getNumberOfReviewersAllowed(uint _timeStamp) public view returns (uint8) {
      uint _epoch = getEpoch(_timeStamp);

      if (_epoch < 30) {
        return 2;
      }
      if (_epoch < 90) {
        return 6;
      }

      if(_epoch < 180) {
        return 15;
      }
      return 20;
    }

    function getNumberOfDOMRewards(uint _timeStamp, uint _validationDificultyLevel) public view returns (uint256) {
      uint _epoch = getEpoch(_timeStamp);

      if (_epoch < 30) {
        return 20 * _validationDificultyLevel;
      }
      if (_epoch < 90) {
        return 10 * _validationDificultyLevel;
      }

      if(_epoch < 180) {
        return 4 * _validationDificultyLevel;
      }
      return 2 * _validationDificultyLevel;
    }

    function getNumberOfDOMStakeNeededToReview(uint _timeStamp, uint _validationDificultyLevel) public view returns (uint256) {
      uint _epoch = getEpoch(_timeStamp);

      if (_epoch < 30) {
        return 100 * _validationDificultyLevel;
      }
      if (_epoch < 90) {
        return 200 * _validationDificultyLevel;
      }

      if(_epoch < 180) {
        return 300 * _validationDificultyLevel;
      }
      return 400 * _validationDificultyLevel;
    }

    function isValidatingPost(string calldata _postSlug) public view returns (bool, uint, bool) {
      PostValidation memory validation = postValidations[postBySlug[_postSlug]][msg.sender];
      return (validation.exists, validation.timeStamp, validation.validationDone);
    }

    function setPostValidationResult(string calldata _postSlug, uint8 _score, string calldata _comment) public {
      uint256 postId = postBySlug[_postSlug];
      Post memory post = posts[postId];

      require(_score >= 0 && _score <=10 , "Score should be between 0 and 10.");
      require(!postValidations[postId][msg.sender].validationDone, "You have already reviewed this post.");
      require(postValidations[postId][msg.sender].postId > 0, "You have not yet applied to be a validator for this post.");
      require(postValidations[postId][msg.sender].timeStamp + validationSuggestedTime[postId] <= block.timestamp, "You did not take the minimum time necessary to validate this post.");

      postValidations[postId][msg.sender].score = _score;
      postValidations[postId][msg.sender].comment = _comment;
      postValidations[postId][msg.sender].validationDone = true;
      postScores[postId] += _score;
      authorProfiles[msg.sender].validatorScore += 1;

      if (postScores[postId] >= getPostScoreNeededToBeListed(post.timeStamp)) {
        posts[postId].listed = true;
        for (uint i = 0; i < postValidationsArray[postId].length; i++) {
            domToken.transferFrom(address(this), postValidationsArray[postId][i], getNumberOfDOMStakeNeededToReview(post.timeStamp, validationDificultyLevel[postId]) + getNumberOfDOMRewards(post.timeStamp, validationDificultyLevel[postId]));
        }
      }
    }

    function applyForPostValidator(string calldata _postSlug) public {
      uint256 postId = postBySlug[_postSlug];
      Post memory post = posts[postId];
      require(!post.listed, "This post is already listed.");
      require(postValidations[postId][msg.sender].postId == 0, "You have already applied to be a validator for this post.");
      require(domToken.balanceOf(msg.sender) >= getNumberOfDOMStakeNeededToReview(post.timeStamp, validationDificultyLevel[postId]), "You dont have enough DOM balance.");
      require(!post.listed, "This post is already listed.");

      require(postValidationsArray[postId].length <= getNumberOfReviewersAllowed(post.timeStamp), "This post reached the maximum reviewers quantity.");

      postValidations[postId][msg.sender] = PostValidation(msg.sender, 0, postId, "", block.timestamp, false, true);
      postValidationsArray[postId].push(msg.sender);
    }
}
