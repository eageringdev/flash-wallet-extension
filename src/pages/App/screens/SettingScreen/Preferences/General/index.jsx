import React, { useState } from 'react';
import { connect } from 'react-redux';

//import actions
import {
  setBaseCurrency,
  setPrivacyCurrency,
  setCurrentLanguage,
  setSearchEngine,
} from '../../../../../Background/store/actions/SettingsActions';

//import constants
import Constants from '../../../../constants';
const currencyConversionProps = Constants.currencyConversionProps;
const privacyCurrencyProps = Constants.privacyCurrencyProps;
const languageProps = Constants.languageProps;
const searchEngineProps = Constants.searchEngineProps;

//import mui
import {
  Modal,
  Box,
  Button,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import { CheckCircle, KeyboardArrowDown } from '@mui/icons-material';
import { modalStyle } from '../../../../styles/mui/muiStyles';

//import styles
import { colors, fonts } from '../../../../styles';

const General = ({
  settingsInfo,
  setBaseCurrency,
  setPrivacyCurrency,
  setCurrentLanguage,
  setSearchEngine,
}) => {
  const { baseCurrency, privacyCurrency, currentLanguage } = settingsInfo;
  const currentSearchEngine = settingsInfo.searchEngine;
  const [showBaseCurrencyModal, setShowBaseCurrencyModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showSearchEngineModal, setShowSearchEngineModal] = useState(false);

  const renderBaseCurrencyModal = () => {
    return (
      <Modal
        open={showBaseCurrencyModal}
        onClose={() => {
          setShowBaseCurrencyModal(false);
        }}
        aria-labelledby="base-currency-modal-title"
        aria-describedby="base-currency-modal-description"
      >
        <Box sx={modalStyle}>
          <div id="base-currency-modal-title">
            <h6 className="font-weight-bold text-center text-white">
              Base Currency
            </h6>
          </div>
          <div
            id="base-currency-modal-description"
            className="text-white"
            sx={{ mt: 4 }}
          >
            {currencyConversionProps.map((currency) => {
              return (
                <Button
                  className="w-100 p-2 mb-2 d-flex flex-row align-items-center"
                  onClick={() => {
                    setBaseCurrency(currency);
                    setShowBaseCurrencyModal(false);
                  }}
                  key={'generalTab_' + currency.value}
                >
                  <div
                    className="text-white flex-fill text-left"
                    style={
                      {
                        // ...fonts.para_regular,
                      }
                    }
                  >
                    {currency.value + ' - ' + currency.label}
                  </div>
                  {currency.value === baseCurrency.value && (
                    <CheckCircle
                      style={{ fontSize: '18px', color: colors.green5 }}
                    />
                  )}
                </Button>
              );
            })}
          </div>
        </Box>
      </Modal>
    );
  };

  const renderLanguageModal = () => {
    return (
      <Modal
        open={showLanguageModal}
        onClose={() => {
          setShowLanguageModal(false);
        }}
        aria-labelledby="language-modal-title"
        aria-describedby="language-modal-description"
      >
        <Box sx={modalStyle}>
          <div id="language-modal-title">
            <h6 className="font-weight-bold text-center text-white">
              Current Language
            </h6>
          </div>
          <div
            id="language-modal-description"
            className="text-white"
            sx={{ mt: 4 }}
          >
            {languageProps.map((language) => {
              return (
                <Button
                  className="w-100 p-2 mb-2 d-flex flex-row align-items-center"
                  onClick={() => {
                    setCurrentLanguage(language);
                    setShowLanguageModal(false);
                  }}
                  key={'generalTab_language_' + language.value}
                >
                  <div
                    className="text-white flex-fill text-left"
                    style={
                      {
                        // ...fonts.para_regular,
                      }
                    }
                  >
                    {language.label}
                  </div>
                  {language.value === currentLanguage.value && (
                    <CheckCircle
                      style={{ fontSize: '18px', color: colors.green5 }}
                    />
                  )}
                </Button>
              );
            })}
          </div>
        </Box>
      </Modal>
    );
  };

  const renderSearchEngineModal = () => {
    return (
      <Modal
        open={showSearchEngineModal}
        onClose={() => {
          setShowSearchEngineModal(false);
        }}
        aria-labelledby="search-engine-modal-title"
        aria-describedby="search-engine-modal-description"
      >
        <Box sx={modalStyle}>
          <div id="search-engine-modal-title">
            <h6 className="font-weight-bold text-center text-white">
              Search Engine
            </h6>
          </div>
          <div
            id="search-engine-modal-description"
            className="text-white"
            sx={{ mt: 4 }}
          >
            {searchEngineProps.map((item) => {
              return (
                <Button
                  className="w-100 p-2 mb-2 d-flex flex-row align-items-center"
                  onClick={() => {
                    setSearchEngine(item);
                    setShowSearchEngineModal(false);
                  }}
                  key={'generalTab_searchE_' + item.value}
                >
                  <div
                    className="text-white flex-fill text-left"
                    style={
                      {
                        // ...fonts.para_regular,
                      }
                    }
                  >
                    {item.label}
                  </div>
                  {item.value === currentSearchEngine.value && (
                    <CheckCircle
                      style={{ fontSize: '18px', color: colors.green5 }}
                    />
                  )}
                </Button>
              );
            })}
          </div>
        </Box>
      </Modal>
    );
  };

  return (
    <>
      {renderBaseCurrencyModal()}
      {renderLanguageModal()}
      {renderSearchEngineModal()}

      <div className="mt-4 ml-1 mr-1 mb-3 overflow-auto">
        <div>
          <div>
            <div
              className="text-white font-weight-bold"
              style={
                {
                  // ...fonts.title2,
                }
              }
            >
              Currency Conversion
            </div>
            <div
              className="mt-1"
              style={{
                // ...fonts.para_regular,
                color: colors.grey9,
              }}
            >
              Display fiat values in using o specific currency throughout the
              application
            </div>
          </div>
          <div className="mt-3 ml-2 mr-2">
            <Button
              className="w-100 border"
              style={{
                borderWidth: '2px',
                borderRadius: '8px',
                borderColor: colors.grey9,
              }}
              onClick={() => {
                setShowBaseCurrencyModal(true);
              }}
            >
              <div
                className="text-white flex-fill text-left font-weight-bold"
                style={
                  {
                    // ...fonts.para_semibold,
                  }
                }
              >
                {`${baseCurrency.value} - ${baseCurrency.label}`}
              </div>
              <KeyboardArrowDown
                className="text-white"
                style={{ fontSize: '18px' }}
              />
            </Button>
          </div>
        </div>
        <div className="mt-4">
          <div>
            <div
              className="font-weight-bold text-white"
              style={
                {
                  // ...fonts.title2,
                }
              }
            >
              Privacy Currency
            </div>
            <div
              className="mt-1"
              style={{
                // ...fonts.para_regular,
                color: colors.grey9,
              }}
            >
              Select Native to prioritize displaying values in the native
              currency of the chain (e.g. ETH). Select Fiat to prioritize
              displaying values in your selected fiat currency
            </div>
          </div>
          <div className="mt-4 d-flex flex-row">
            <FormControl>
              <RadioGroup
                className="text-white"
                row
                name="privacy-currency"
                value={privacyCurrency}
                onChange={(event) => {
                  setPrivacyCurrency(event.target.value);
                }}
              >
                {privacyCurrencyProps.map((obj, i) => (
                  <FormControlLabel
                    key={'privacyCurrency_' + obj.value}
                    value={obj.value}
                    control={
                      <Radio
                        sx={{
                          color: colors.grey9,
                          '&.Mui-checked': {
                            color: colors.primary5,
                          },
                        }}
                      />
                    }
                    label={obj.label}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </div>
          <div className="mt-4">
            <div
              className="text-white font-weight-bold"
              style={
                {
                  //  ...fonts.title2,
                }
              }
            >
              Current Language
            </div>
            <div
              style={{
                //  ...fonts.para_regular,
                color: colors.grey9,
              }}
            >
              Translate the application to a different supported language
            </div>
            <div className="mt-3 ml-2 mr-2">
              <Button
                className="w-100 border"
                style={{
                  borderWidth: '2px',
                  borderRadius: '8px',
                  borderColor: colors.grey9,
                }}
                onClick={() => {
                  setShowLanguageModal(true);
                }}
              >
                <div
                  className="font-weight-bold text-white text-left flex-fill"
                  style={
                    {
                      //  ...fonts.para_semibold,
                    }
                  }
                >
                  {currentLanguage.label}
                </div>
                <KeyboardArrowDown
                  className="text-white"
                  style={{ fontSize: '18px' }}
                />
              </Button>
            </div>
          </div>
          <div className="mt-4 pb-2">
            <div
              className="font-weight-bold text-white"
              style={
                {
                  // ...fonts.title2,
                }
              }
            >
              Search Engine
            </div>
            <div
              style={{
                //  ...fonts.para_regular,
                color: colors.grey9,
              }}
            >
              Change the default search engine used when entering search terms
              in the URL bar
            </div>
            <div className="mt-3 ml-2 mr-2">
              <Button
                className="w-100 border"
                style={{
                  borderWidth: '2px',
                  borderRadius: '8px',
                  borderColor: colors.grey9,
                }}
                onClick={() => {
                  setShowSearchEngineModal(true);
                }}
              >
                <div
                  className="text-white font-weight-bold text-left flex-fill"
                  style={
                    {
                      // ...fonts.para_semibold,
                    }
                  }
                >
                  {currentSearchEngine.label}
                </div>
                <KeyboardArrowDown
                  className="text-white"
                  style={{ fontSize: '18px' }}
                />
              </Button>
            </div>
          </div>
          <div className="mt-4 mb-4">
            <div
              className="text-white font-weight-bold"
              style={
                {
                  //  ...fonts.title2,
                }
              }
            >
              Account Identicon
            </div>
            <div
              style={{
                //  ...fonts.para_regular,
                color: colors.grey9,
              }}
            >
              You can customize your account
            </div>
            <div className="mt-3 ml-2 mr-2">
              <Button
                className="w-100 border"
                style={{
                  borderWidth: '2px',
                  borderRadius: '8px',
                  borderColor: colors.grey9,
                }}
              >
                <div
                  className="text-white font-weight-bold text-left flex-fill"
                  style={
                    {
                      // ...fonts.para_semibold,
                    }
                  }
                >
                  Custom Account
                </div>
                <KeyboardArrowDown
                  className="text-white"
                  style={{ fontSize: '18px' }}
                />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  settingsInfo: state.settings,
});
const mapDispatchToProps = (dispatch) => ({
  setBaseCurrency: (value) => setBaseCurrency(dispatch, value),
  setPrivacyCurrency: (value) => setPrivacyCurrency(dispatch, value),
  setCurrentLanguage: (value) => setCurrentLanguage(dispatch, value),
  setSearchEngine: (value) => setSearchEngine(dispatch, value),
});
export default connect(mapStateToProps, mapDispatchToProps)(General);
