import CloseIcon from "@mui/icons-material/Close";
import { Button, ButtonGroup, TextField } from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import React, { useState } from "react";
import { useIntl } from "react-intl";

const CashPaymentDialog = ({
  handlePayMode,
  setCashPayDialog,
  totalAmount,
  order,
}) => {
  const [cashAmount, setCashAmount] = useState(0);
  const [otherAmount, setOtherAmount] = useState(0);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [changeDue, setChangeDue] = useState(0);
  const { formatMessage: t, locale } = useIntl();

  const handleOtherPaymentSelection = (index) => {
    setSelectedMethod(index);
  };

  const handleCashAmountChange = (e) => {
    const newCashAmount = parseFloat(e.target.value) || 0;
    setCashAmount(newCashAmount);
    calculateChangeDue(newCashAmount, otherAmount);
  };

  const handleOtherAmountChange = (e) => {
    const newOtherAmount = parseFloat(e.target.value) || 0;
    setOtherAmount(newOtherAmount);
    calculateChangeDue(cashAmount, newOtherAmount);
  };

  const calculateChangeDue = (cashAmount, otherAmount) => {
    const paidAmount =
      (parseFloat(cashAmount) || 0) + (parseFloat(otherAmount) || 0);
    const change = totalAmount - paidAmount;
    setChangeDue(change.toFixed(2));
  };

  const handleNextClick = () => {
    handlePayMode("CASH", order);
    setCashPayDialog(false);
  };

  return (
    <div>
      <DialogTitle sx={{ m: 0, p: 2 }}>
        <b>{t({ id: "cash_change" })}</b>
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={() => setCashPayDialog(false)}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent
        style={{
          borderTop: "1px solid #ccc",
          borderBottom: "1px solid #ccc",
          padding: "0px 20px",
        }}
      >
        <div className={"dialog-row"}>
          <label>{t({ id: "bill_amount" })}:</label>
          <h2>
            <b>{totalAmount}</b>
          </h2>
        </div>
        <div className={"dialog-row"}>
          <label>{t({ id: "paid_by_cash" })}:</label>
          <TextField
            variant="outlined"
            type="text"
            value={cashAmount}
            onChange={handleCashAmountChange}
            style={{ width: "150px" }}
          />
        </div>
        <div className={"dialog-row"} style={{ marginTop: "10px" }}>
          <label>{t({ id: "split_pay_by" })}</label>
          <ButtonGroup>
            <Button
              variant={selectedMethod === 1 ? "contained" : "outlined"}
              onClick={() => handleOtherPaymentSelection(1)}
            >
              {t({ id: "scan_qr" })}
            </Button>
            <Button
              variant={selectedMethod === 2 ? "contained" : "outlined"}
              onClick={() => handleOtherPaymentSelection(2)}
            >
              {t({ id: "card" })}
            </Button>
            <Button
              variant={selectedMethod === 3 ? "contained" : "outlined"}
              onClick={() => handleOtherPaymentSelection(3)}
            >
              {t({ id: "coupons" })}
            </Button>
          </ButtonGroup>
          {selectedMethod && (
            <TextField
              variant="outlined"
              type="text"
              value={otherAmount}
              onChange={handleOtherAmountChange}
              style={{ width: "150px" }}
            />
          )}
        </div>
        <div className={"dialog-row"}>
          <label>{t({ id: "change_due" })}:</label>
          <h2 style={{ color: "red" }}>
            <b>{changeDue}</b>
          </h2>
        </div>
      </DialogContent>
      <DialogActions>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "10px",
            width: "100%",
          }}
        >
          <Button
            variant="outlined"
            color="error"
            onClick={() => setCashPayDialog(false)}
          >
            {t({ id: "cancel" })}
          </Button>
          <Button
            variant="contained"
            onClick={handleNextClick}
            disabled={parseFloat(changeDue) > 0 || parseFloat(cashAmount) < 1}
          >
            {t({ id: "Next" })}
          </Button>
        </div>
      </DialogActions>
    </div>
  );
};

export default CashPaymentDialog;
