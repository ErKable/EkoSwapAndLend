pragma solidity ^0.4.21;

"import "./pages/Ekolend/Ekolend";

contract LendingPool {
    address public lender;
    address public borrower;
    Ekotoken public token;
    unit256 public collateralAmount;
    unit256 public paybackAmount;
    unit256 public dueDate;

    function LendingPool (
        address _lender,
        address _borrower,
        Ekotoken _token,
        unit256 _collateralAmount,
        unit256_paybackAmount,
        unit256 loanDuration
    )
    public
    {lender = _lender;
    borrower = _borrower;
    Ekotoken = _token;
    collateralAmount = _collateralAmount;
    paybackAmount = _paybackAmount;
    dueDate = now + loanDuration;
    }
    event LoanPaid();

    function payLoan () public payable {
        require (now <= dueDate);
        require (msg.value == paybackAmount);

        require (Ekotoken. transfer (borrower, collateralAmount));
        emit LoanPaid();
        selfdestruct (lender);
    }
    function reposses () public {
        require (now > dueDate);

        require (Ekotoken. transfer (lender, collateralAmount));
        selfdestruct (lender);
    }
}