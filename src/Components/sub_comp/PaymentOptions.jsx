import React, { useState } from "react"; 
import { ButtonGroup, Button, Dialog, Box, IconButton } from "@mui/material";
import { useIntl } from "react-intl";
import CloseIcon from "@mui/icons-material/Close";
import CashPaymentDialog from "./CashPaymentDialog";

function PaymentOptions(props) {
  const [openDialog, setOpenDialog] = useState(false);
  const { formatMessage: t } = useIntl();

  const getTotalPrc = () => {
    if (!props.order) return 0;
    if (props.order.discountType) {
      if (props.order.discountType === "percentage") {
        return props.order.totalPrice - (props.order.totalPrice * (props.order.discountAmount / 100));
      } else {
        return props.order.totalPrice - props.order.discountAmount;
      }
    } else {
      return props.order.totalPrice;
    }
  };

  return (
    <div style={{ padding: "30px 10px" }}>
      {props.order && (
        <ButtonGroup aria-label="Payment Options">
          {/* Cash Payment */}
          <Button
            variant={props.paymentIndex === 0 ? "contained" : "outlined"}
            style={{
              backgroundColor: props.paymentIndex === 0 ? "#F7C919" : "inherit",
              borderColor: "#F7C919",
              color: props.paymentIndex === 0 ? "black" : "inherit",
              cursor: "pointer",
            }}
            onClick={() => {
              setOpenDialog(true);
              props.setPayModeIndx(0);
            }}
          >
            {t({ id: "cash" })}
          </Button>

          {/* UPI Payment */}
          <Button
            variant={props.paymentIndex === 1 ? "contained" : "outlined"}
            style={{
              backgroundColor: props.paymentIndex === 1 ? "#F7C919" : "inherit",
              borderColor: "#F7C919",
              color: props.paymentIndex === 1 ? "black" : "inherit",
              cursor: "pointer",
            }}
            disabled={!props.order}
            onClick={() => {
              props.setPayModeIndx(1);
              props.handlePayMode("UPI", props.order);
              props.closeParentDialog(); 
            }}
          >
            {t({ id: "upi" })}
          </Button>

          {/* Card Payment */}
          <Button
            variant={props.paymentIndex === 2 ? "contained" : "outlined"}
            style={{
              backgroundColor: props.paymentIndex === 2 ? "#F7C919" : "inherit",
              borderColor: "#F7C919",
              color: props.paymentIndex === 2 ? "black" : "inherit",
              cursor: "pointer",
            }}
            disabled={!props.order}
            onClick={() => {
              props.setPayModeIndx(2);
              props.handlePayMode("CARD", props.order);
              props.closeParentDialog(); // Close popup after selection
            }}
          >
            {t({ id: "card" })}
          </Button>

          {/* Coupon Payment */}
          <Button
            variant={props.paymentIndex === 3 ? "contained" : "outlined"}
            style={{
              backgroundColor: props.paymentIndex === 3 ? "#F7C919" : "inherit",
              borderColor: "#F7C919",
              color: props.paymentIndex === 3 ? "black" : "inherit",
              cursor: "pointer",
            }}
            disabled={!props.order}
            onClick={() => {
              props.setPayModeIndx(3);
              props.handlePayMode("COUPON", props.order);
              props.closeParentDialog(); // Close popup after selection
            }}
          >
            {t({ id: "coupouns" })}
          </Button>
        </ButtonGroup>
      )}

      {/* Cash Payment Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        style={{ zIndex: 9999999 }}
      >
        <Box sx={{ border: 1, p: 1, bgcolor: "background.paper" }}>
          <IconButton
            onClick={() => setOpenDialog(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
          <CashPaymentDialog
            setCashPayDialog={() => setOpenDialog(false)}
            handlePayMode={(method, order) => {
              props.handlePayMode(method, order);
              props.closeParentDialog(); // Close parent dialog when cash payment is completed
            }}
            totalAmount={getTotalPrc()}
            order={props.order}
          />
        </Box>
      </Dialog>
    </div>
  );
}

export default PaymentOptions;
