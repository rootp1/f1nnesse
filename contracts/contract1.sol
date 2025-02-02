// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Betting {
    address public owner;
    address public feeCollector = 0x659E04177e310228b4555f4d6443CbB72665F40a;
    uint256 public constant BET_AMOUNT = 0.0001 ether;
    uint256 public constant FEE_PERCENTAGE = 10;
    bool public matchEnded;
    string public winningTeam;
    
    struct Bet {
        address user;
        uint256 amount;
        string team;
    }

    Bet[] public bets;
    
    event BetPlaced(address indexed user, uint256 amount, string team);
    event MatchResultDeclared(string winningTeam);
    event Payout(address indexed user, uint256 amount);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }
    
    modifier matchNotEnded() {
        require(!matchEnded, "Match already ended");
        _;
    }
    
    constructor() {
        owner = msg.sender;
    }
    
    function placeBet(string memory team) external payable matchNotEnded {
        require(msg.value == BET_AMOUNT, "Bet must be exactly 0.0001 ETH");
        require(bytes(team).length > 0, "Invalid team");

        bets.push(Bet(msg.sender, msg.value, team));
        emit BetPlaced(msg.sender, msg.value, team);
    }
    
    function declareWinner(string memory team) external onlyOwner matchNotEnded {
        require(bets.length > 0, "No bets placed");
        
        bool validTeam = false;
        for (uint256 i = 0; i < bets.length; i++) {
            if (keccak256(abi.encodePacked(bets[i].team)) == keccak256(abi.encodePacked(team))) {
                validTeam = true;
                break;
            }
        }
        require(validTeam, "Invalid team");

        matchEnded = true;
        winningTeam = team;

        uint256 totalPool = address(this).balance;
        uint256 fee = (totalPool * FEE_PERCENTAGE) / 100;
        payable(feeCollector).transfer(fee);
        
        uint256 remainingPool = totalPool - fee;
        distributeRewards(winningTeam, remainingPool);
        
        emit MatchResultDeclared(winningTeam);
    }
    
    function distributeRewards(string memory team, uint256 rewardPool) internal {
        uint256 totalWinningBets = 0;
        for (uint256 i = 0; i < bets.length; i++) {
            if (keccak256(abi.encodePacked(bets[i].team)) == keccak256(abi.encodePacked(team))) {
                totalWinningBets += bets[i].amount;
            }
        }
        require(totalWinningBets > 0, "No winners");

        for (uint256 i = 0; i < bets.length; i++) {
            if (keccak256(abi.encodePacked(bets[i].team)) == keccak256(abi.encodePacked(team))) {
                uint256 reward = (bets[i].amount * rewardPool) / totalWinningBets;
                payable(bets[i].user).transfer(reward);
                emit Payout(bets[i].user, reward);
            }
        }
    }

    function getAllBets() public view returns (Bet[] memory) {
        return bets;
    }

    // New function to reset the contract state for a new match
    function resetMatch() external onlyOwner {
        require(matchEnded, "Match has not ended yet");
        delete bets;
        matchEnded = false;
        winningTeam = "";
    }
}