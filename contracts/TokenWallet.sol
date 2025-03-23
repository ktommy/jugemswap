// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function transfer(address recipient, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
}

contract TokenWallet {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner {
        require(msg.sender == owner, "Not owner");
        _;
    }

    // トークンの残高を取得
    function getTokenBalance(address token) external view returns (uint256) {
        return IERC20(token).balanceOf(address(this));
    }

    // コントラクトから任意のアドレスにトークン送信
    function sendToken(address token, address to, uint256 amount) external onlyOwner {
        require(IERC20(token).transfer(to, amount), "Transfer failed");
    }

    // 他人のトークンを transferFrom で受け取る（事前にapproveが必要）
    function receiveToken(address token, address from, uint256 amount) external onlyOwner {
        require(IERC20(token).transferFrom(from, address(this), amount), "TransferFrom failed");
    }

    // approve を自動で出すことはできない（ユーザーが直接approveする必要あり）

    // これがないと送信できない
    receive() external payable {}
    fallback() external payable {}
}
