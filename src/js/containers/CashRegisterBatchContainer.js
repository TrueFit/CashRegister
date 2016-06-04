import {connect} from "react-redux";
import {readFile, makeBulkChange} from "../actions";
import BatchFileInput from "../components/BatchFileInput";

const mapStateToProps = (state) => {
    return {
        changeInputs: state.changeInputs,
        changeOutputs: state.changeOutputs
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onReadFile: (textFile) => {
            dispatch(readFile(textFile))
        },
        onMakeBulkChange: () => {
            dispatch(makeBulkChange())
        }
    }
}

const CashRegisterBatchContainer = connect(mapStateToProps, mapDispatchToProps)(BatchFileInput);

export default CashRegisterBatchContainer
