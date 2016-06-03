import React, {PropTypes} from "react";

const CashRegister = ({purchaseAmount, tenderedAmount, onMakeChange}) => {
    return (
        <h2>Hello Change!</h2>
    )
}

CashRegister.propTypes = {
    purchaseAmount: PropTypes.number.isRequired,
    tenderedAmount: PropTypes.number.isRequired,
    onMakeChange: PropTypes.func.isRequired
}

export default CashRegister;
