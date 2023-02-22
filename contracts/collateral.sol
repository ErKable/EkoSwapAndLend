pragma solidity ^0.4.21;

import _Ekolend from "./pages/Ekolend/Ekolend";
import "loan.sol";

contract LoanRequest (
    address public borrower = msg.sender;
    Ekotoken public token;
    unit256 public collateralAmount;
    unit256 publicloanAmount;
    unit256 public paybackAmount;
    unit256 public loanDuration;

    function LoanRequest(
        Ekotoken _token,
        unit256  _collateralAmount,
        unit256 _loanAmount,
        unit256 _paybackAmount,
        unit256 _loanDuration
    )
    public
    {
        Ekoscore = _token;
        collateralAmount = _collateralAmount;
        loanAmount = _loanAmount;
        paybackAmount = _paybackAmount;
        loanDuration = _loanDuration;
    }
    Loan public loan;

    event LoanRequestAccepted(address loan)

    function LendEkotokens () public payable {
        require(msg.value == loanAmount);
        loan = new Loan(
            msg.sender,
            borrower,
            token,
            collateralAmount,
            paybackAmount,
            loanDuration
        );
        require(Ekoscoretoken. transferFrom(borrower, loan, collateralAmount))
        borrower. transfer (loanAmount);
        emit LoanRequestAccepted(loan);
    }
