import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';

//import actions
import { addToken } from '../../../../Background/store/actions/TokensActions';
import SingleInput from '../../../components/CustomInputs/SingleInput';

//import utils
import { isValidAddress } from '../../../utils/common';
import { getTokenDataFromAddress } from '../../../utils/token';

//import mui
import { Check, CheckCircle } from '@mui/icons-material';

//import styles
import { colors, fonts } from '../../../styles';
import { Button, CircularProgress } from '@mui/material';
import { PrimaryButton, TextButton } from '../../../components/Buttons';

const CustomTab = ({
  addToken,
  networks,
  currentNetwork,
  currentAccountIndex,
  onCancel,
}) => {
  const navigate = useNavigate();

  const [tokenAddress, setTokenAddress] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [tokenDecimal, setTokenDecimal] = useState('');
  const [step, setStep] = useState(0);
  const [canNext, setCanNext] = useState(false);
  const [addTokenLoading, setAddTokenLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [canEditSymbol, setCanEditSymbol] = useState(false);
  const [importError, setImportError] = useState('');

  const checkCanNext = (data) => {
    if (data.tokenAddress && isValidAddress(data.tokenAddress)) {
      if (!fetchingData) {
        setFetchingData(true);
        getTokenDataFromAddress(data.tokenAddress, networks[currentNetwork].rpc)
          .then((res) => {
            setTokenSymbol(res.symbol.toString());
            setTokenDecimal(res.decimals.toString());
            setCanNext(true);
            setFetchingData(false);
          })
          .catch((err) => {
            console.log(err);
            setCanNext(false);
            setFetchError('No such a contract.');
            setFetchingData(false);
          });
      }
    } else {
      setCanEditSymbol(false);
      setFetchingData(false);
      setTokenSymbol('');
      setTokenDecimal('');
      setCanNext(false);
      return false;
    }
    return true;
  };

  const renderStep0 = () => {
    return (
      <>
        <div className="mt-2">
          <SingleInput
            value={tokenAddress}
            onChangeValue={(value) => {
              setFetchError('');
              checkCanNext({ tokenAddress: value, tokenSymbol, tokenDecimal });
              setTokenAddress(value);
            }}
            label="Token Address"
            editable={!fetchingData}
          />
          <div
            className="pl-2"
            style={{
              //   ...fonts.caption_small12_16_regular,
              color: isValidAddress(tokenAddress)
                ? colors.green5
                : colors.grey12,
            }}
          >
            Must be valid address.{' '}
            {isValidAddress(tokenAddress) && (
              <Check
                style={{
                  fontSize: '12px',
                  color: colors.green5,
                }}
              />
            )}
          </div>
          {fetchError.length > 0 && (
            <div
              className="pl-2"
              style={{
                // ...fonts.caption_small12_16_regular,
                color: colors.red5,
              }}
            >
              {fetchError}
            </div>
          )}
          {importError.length > 0 && (
            <div
              className="pl-2 mt-1"
              style={{
                // ...fonts.caption_small12_16_regular,
                color: colors.red5,
              }}
            >
              {importError}
            </div>
          )}
        </div>
        {fetchingData && (
          <div className="w-100 d-flex flex-row align-items-center justify-content-start ml-2">
            <CircularProgress style={{ color: colors.primary5 }} size="16px" />
            <div
              className="ml-1"
              style={{
                // ...fonts.para_regular,
                color: colors.grey9,
              }}
            >
              Fetching Token Data...
            </div>
          </div>
        )}

        <div className="mt-2">
          <SingleInput
            value={tokenSymbol}
            onChangeValue={(value) => {
              setTokenSymbol(value);
            }}
            label="Token Symbol"
            editable={!canEditSymbol ? false : fetchingData ? false : true}
          />
          {!canEditSymbol && tokenSymbol.length > 0 && (
            <div className="w-100 d-flex flex-row-reverse">
              <Button
                onClick={() => {
                  setCanEditSymbol(true);
                }}
              >
                <div
                  style={{
                    // ...fonts.para_semibold,
                    color: colors.primary5,
                  }}
                >
                  Edit
                </div>
              </Button>
            </div>
          )}
        </div>
        <div className="mt-2">
          <SingleInput
            value={tokenDecimal}
            onChangeValue={() => {}}
            label="Token Precision"
            editable={false}
          />
        </div>
      </>
    );
  };

  const renderStep1 = () => {
    const renderTokenRow = (token) => {
      const { tokenSymbol } = token;
      return (
        <div className="p-2">
          <div className="d-flex flex-row align-items-center">
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '16px',
                backgroundColor: colors.grey9,
              }}
            ></div>
            <div className="ml-2">
              <div
                className="text-white"
                style={
                  {
                    // ...fonts.title2
                  }
                }
              >
                {tokenSymbol}
              </div>
            </div>
            <div className="d-flex flex-row-reverse flex-fill">
              <CheckCircle style={{ fontSize: 24, color: colors.green5 }} />
            </div>
          </div>
        </div>
      );
    };
    return (
      <>
        <div className="mt-2">
          <div
            style={{
              // ...fonts.para_regular,
              color: colors.grey9,
            }}
          >
            Would you like to add these tokens?
          </div>
        </div>
        <div className="mt-2">
          {renderTokenRow({ tokenSymbol, tokenAddress, tokenDecimal })}
        </div>
      </>
    );
  };

  return (
    <div className="h-100 ml-2 mr-2 d-flex flex-column">
      <div className="flex-fill">
        {step === 0 && renderStep0()}
        {step === 1 && renderStep1()}
      </div>

      <div className="d-flex flex-row align-items-center justify-content-around w-100 mb-3">
        <TextButton
          className="m-0"
          text="Cancel"
          style={{ width: '160px' }}
          onClick={() => {
            if (step === 1) {
              setStep(0);
            } else if (step === 0) {
              onCancel();
            }
          }}
        />
        <PrimaryButton
          className="m-0"
          loading={addTokenLoading}
          text={step === 0 ? 'Next' : 'Add Token'}
          onClick={() => {
            if (step === 0) {
              setStep(1);
            } else if (step === 1) {
              addToken(
                {
                  token: {
                    tokenAddress,
                    tokenDecimal,
                    tokenSymbol,
                  },
                  currentNetwork,
                  currentAccountIndex,
                },
                () => {
                  setAddTokenLoading(true);
                },
                () => {
                  console.log('success on add custom token');
                  navigate('/wallet');
                },
                (err) => {
                  console.log('fail on add custom token');
                  setImportError(err);
                  setAddTokenLoading(false);
                  setStep(0);
                }
              );
            }
          }}
          style={{ width: '160px' }}
          enableFlag={canNext}
        />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  networks: state.networks.networks,
  currentNetwork: state.networks.currentNetwork,
  currentAccountIndex: state.accounts.currentAccountIndex,
});
const mapDispatchToProps = (dispatch) => ({
  addToken: (data, beforeWork, successCallback, failCallback) =>
    addToken(dispatch, data, beforeWork, successCallback, failCallback),
});
export default connect(mapStateToProps, mapDispatchToProps)(CustomTab);
