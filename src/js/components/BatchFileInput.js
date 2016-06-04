import React, {PropTypes} from "react";

const BatchFileInput = ({changeInputs, changeOutputs, onReadFile, onMakeBulkChange}) => {
    let inputFile;

    return (
        <div className="ccr-batch col-md-5 col-md-offset-1">
            <div className="row">
                <h2 className="title">Creative Bulk Cash Register</h2>
                <form className="form-horizontal"
                      onSubmit={
                        e => {
                            e.preventDefault();
                            if (inputFile.files && inputFile.files[0]) {
                                onReadFile(inputFile.files[0]);
                            }
                        }
                    }>
                    <div className="form-group">
                        <label className="col-xs-offset-4 col-xs-7">1. Choose a File</label>
                        <br />
                        <div className="col-xs-offset-4 col-xs-7">
                            <input type="file" id="inputFIle"
                                   ref={node => {inputFile = node}}>
                            </input>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="col-xs-offset-4 col-xs-7">
                            <button type="submit" className="btn btn-default">
                                2. Upload the File
                            </button>
                        </div>
                    </div>
                </form>
                <form className="form-horizontal"
                      onSubmit={
                        e => {
                            e.preventDefault();
                            onMakeBulkChange();
                        }
                    }>
                    <div className="form-group">
                        <div className="col-xs-offset-4 col-xs-7">
                            <button type="submit" className="btn btn-default">
                                3. Make Change
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            <div className="ccr-batch-inputs row">
                <h2 className="title">Inputs</h2>
                <table className="change-table col-xs-10 col-xs-offset-1">
                    <tbody>
                    <tr>
                        <th>Line</th>
                        <th>Purchase Price</th>
                        <th>Amount Tendered</th>
                    </tr>
                    {
                        changeInputs.map((input, i) => {
                            return (
                                <tr key={i}>
                                    <td>{i + 1}</td>
                                    <td>{input.purchaseAmount}</td>
                                    <td>{input.tenderedAmount}</td>
                                </tr>
                            )
                        })
                    }
                    </tbody>
                </table>
            </div>
            <div className="ccr-batch-inputs row">
                <h2 className="title">Change Due</h2>
                <table className="change-table col-xs-10 col-xs-offset-1">
                    <tbody>
                    <tr>
                        {
                            ['line', 'dollars', 'quarters', 'dimes', 'nickels', 'pennies'].map((denomName, i) => {
                                return (
                                    <th key={i}>{toTitleCase(denomName)}</th>
                                )
                            })
                        }
                    </tr>
                    {
                        changeOutputs.map((output, i) => {
                            return (
                                <tr key={i}>
                                    <td>{i + 1}</td>
                                    <td>{output.dollars}</td>
                                    <td>{output.quarters}</td>
                                    <td>{output.dimes}</td>
                                    <td>{output.nickels}</td>
                                    <td>{output.pennies}</td>
                                </tr>
                            )
                        })
                    }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

BatchFileInput.propTypes = {
    changeInputs: PropTypes.array.isRequired,
    changeOutputs: PropTypes.array.isRequired,
    onReadFile: PropTypes.func.isRequired,
    onMakeBulkChange: PropTypes.func.isRequired
}

const toTitleCase = (str) => {
    return str.replace(/(?:^|\s)\w/g, function (match) {
        return match.toUpperCase();
    });
}

export default BatchFileInput;

