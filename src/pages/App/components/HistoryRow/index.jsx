import React from 'react';

//import mui
import { Button } from '@mui/material';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';

//import styles
import { fonts, colors } from '../../styles';

const usdAmount = 226.69;

const HistoryRow = ({
  time,
  totalAmount,
  unit,
  transactionType,
  resultType,
  from,
  to,
  nonce,
  amount,
  fee,
}) => {
  return (
    <Button
      className="pt-1 pb-1 w-100"
      onClick={() => {
        // refRBSheet.current.open();
      }}
    >
      <div className="w-100">
        <div
          className="pb-1 pt-1 text-left"
          style={{
            color: colors.grey9,
            // ...fonts.caption_small12_18_regular
          }}
        >
          Mar 3 at 10:04 AM
        </div>
        <div className="d-flex flex-row align-items-center">
          <div>
            {transactionType === 'received' ? (
              <ArrowDownward
                className="mr-2"
                style={{
                  fontSize: '40px',
                  color:
                    resultType === 'confirmed' ? colors.green5 : colors.red5,
                }}
              />
            ) : (
              <ArrowUpward
                className="mr-2"
                style={{
                  fontSize: '40px',
                  color:
                    resultType === 'confirmed' ? colors.green5 : colors.red5,
                }}
              />
            )}
          </div>
          <div className="flex-fill text-left">
            <div
              className="text-white"
              style={
                {
                  // ...fonts.title2
                }
              }
            >
              {(transactionType === 'received' ? 'Received ' : 'Sent ') + unit}
            </div>
            <div
              className="mt-1"
              style={{
                color: resultType === 'confirmed' ? colors.green5 : colors.red5,
                // ...fonts.title2,
              }}
            >
              {resultType === 'confirmed' ? 'Confirmed' : 'Cancelled'}
            </div>
          </div>
          <div>
            <div
              className="text-white"
              style={
                {
                  // ...fonts.title2,
                }
              }
            >
              {totalAmount + ' ' + unit}
            </div>
            <div
              style={{
                // ...fonts.caption_small12_18_regular,
                color: colors.grey9,
              }}
              className="mt-1"
            >
              {'$' + parseFloat(totalAmount * usdAmount).toFixed(4)}
            </div>
          </div>
        </div>
      </div>
    </Button>
  );
};

export default HistoryRow;
