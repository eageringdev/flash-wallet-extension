import React from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';

//import actions
import { setSelectedToken } from '../../../../Background/store/actions/TokensActions';
import { TextButton } from '../../../components/Buttons';

//import components
import TokenItemRow from './TokenItemRow';

//import mui
import { Add } from '@mui/icons-material';

//import styles
import { colors, fonts } from '../../../styles';

const TokenTab = ({
  currentNetwork,
  currentAccountIndex,
  tokens,
  setSelectedToken,
  networks,
}) => {
  const navigate = useNavigate();

  const tokensList = tokens[currentNetwork]
    ? tokens[currentNetwork][currentAccountIndex]
      ? tokens[currentNetwork][currentAccountIndex].tokensList
      : []
    : [];
  return (
    <div className="d-flex flex-column">
      <div className="flex-fill">
        <TokenItemRow
          token={'main'}
          removable={false}
          onClick={() => {
            setSelectedToken('main');
            // navigate('/token-show');
            // navigation.navigate('tokenshow');
          }}
        />
        {tokensList.map((token) => {
          return (
            <TokenItemRow
              token={token}
              onClick={() => {
                setSelectedToken(token);
                // navigate('/token-show');
                // navigation.navigate('tokenshow');
              }}
              removable={true}
              key={'tokenRoute_' + token.tokenAddress}
            />
          );
        })}
      </div>
      <div className="mt-3">
        <TextButton
          text="Add Tokens"
          onClick={() => {
            navigate('/add-token');
          }}
          icon={
            <Add
              className="mr-1"
              style={{ fontSize: '24px', color: colors.primary5 }}
            />
          }
        />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  networks: state.networks.networks,
  currentNetwork: state.networks.currentNetwork,
  accounts: state.accounts.accounts,
  currentAccountIndex: state.accounts.currentAccountIndex,
  tokens: state.tokens.tokensData,
});
const mapDispatchToProps = (dispatch) => ({
  setSelectedToken: (token) => setSelectedToken(dispatch, token),
});

export default connect(mapStateToProps, mapDispatchToProps)(TokenTab);
