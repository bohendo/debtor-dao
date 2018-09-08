pragma solidity ^0.4.24;

contract DebtorDAO {
    event DividentsDistributed(uint _amount);
    event DebtRepayed(uint _amount);
    event DebtRequested(uint _amount);
    event EquityCashed(uint _amount);

    function repayDebt(uint amount) public {
        emit DebtRepayed(amount);
    }

    function requestDebt(uint amount) public {
        emit DebtRequested(amount);
    }

}
