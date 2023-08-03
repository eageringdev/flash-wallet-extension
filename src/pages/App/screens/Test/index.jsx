import React from 'react';
import { connect } from 'react-redux';

// import router
import { Link } from 'react-router-dom';

//import actions
import { setCurrentAccountIndex } from '../../../Background/store/actions/accountsActions';

const Test = (props) => {
  console.log(props);
  return (
    <div>
      <div>Hello Test</div>
      <div>{props.currentAccountIndex}</div>
      <button
        onClick={() => {
          props.setCurrentAccountIndex(123);
        }}
      >
        asdfasf
      </button>
      <Link to="test">Test</Link>
    </div>
  );
};

const mapStateToProps = (state) => {
  console.log(state);
  return {
    currentAccountIndex: state.accounts.currentAccountIndex,
  };
};
const mapDispatchToProps = (dispatch) => ({
  setCurrentAccountIndex: (index) => setCurrentAccountIndex(dispatch, index),
});

export default connect(mapStateToProps, mapDispatchToProps)(Test);
