import React, {PropTypes} from "react";

const CashRegister = ({purchaseAmount, tenderedAmount, change, onMakeChange}) => {
    let inputPurch, inputTendered;
    return (
        <div className="ccr col-md-5 col-md-offset-1">
            <div className="row">
                <h2 className="title">Creative Cash Register</h2>
                <form className="form-horizontal"
                      onSubmit={
                            e => {
                                e.preventDefault();
                                if (inputPurch.value.trim() && inputTendered.value.trim()) {
                                    onMakeChange(inputPurch.value, inputTendered.value);
                                }
                            }
                        }>
                    <div className="form-group">
                        <label htmlFor="inputPurch" className="col-xs-4 control-label">Purchase</label>
                        <div className="col-xs-6">
                            <input type="text"
                                   className="form-control"
                                   id="inputPurch"
                                   placeholder="Purchase Amount"
                                   defaultValue={purchaseAmount ? purchaseAmount : null}
                                   ref={node => {inputPurch = node}}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="inputTendered" className="col-xs-4 control-label">Amount Tendered</label>
                        <div className="col-xs-6">
                            <input type="text"
                                   className="form-control"
                                   id="inputTendered"
                                   placeholder="Amount Tendered"
                                   defaultValue={tenderedAmount ? tenderedAmount : null}
                                   ref={node => {inputTendered = node}}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="col-xs-offset-4 col-xs-6">
                            <button type="submit"
                                    className="btn btn-default">
                                Make Change
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            <div className="change row">
                <h2 className="title">Change Due</h2>
                <form className="form-horizontal">
                    {
                        ['dollars', 'quarters', 'dimes', 'nickels', 'pennies'].map((denomName, i) => {
                            return (
                                <div className="form-group" key={i}>
                                    <label className="col-xs-4 control-label">{toTitleCase(denomName)}</label>
                                    <div className="col-xs-7">
                                        <p className="col-xs-7 form-control-static">{change[denomName]}</p>
                                    </div>
                                </div>
                            )
                        })
                    }
                </form>
            </div>
        </div>
    )
}

CashRegister.propTypes = {
    purchaseAmount: PropTypes.number,
    tenderedAmount: PropTypes.number,
    change: PropTypes.shape({
        dollars: PropTypes.number,
        quarters: PropTypes.number,
        dimes: PropTypes.number,
        nickels: PropTypes.number,
        pennies: PropTypes.number
    }).isRequired,
    onMakeChange: PropTypes.func.isRequired
}

const toTitleCase = (str) => {
    return str.replace(/(?:^|\s)\w/g, function (match) {
        return match.toUpperCase();
    });
}

export default CashRegister;
