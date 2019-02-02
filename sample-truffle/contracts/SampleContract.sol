pragma solidity >=0.4.21 < 0.6.0;

contract SampleContract {

    uint256[] private myValues;

    constructor() public {
    }

    function add(uint256 _value) public {
        myValues.push(_value);
    }

    function getValues() public view returns (uint256[] memory) {
        return myValues;
    }
}
