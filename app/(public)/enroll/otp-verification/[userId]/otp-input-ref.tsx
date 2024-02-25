import React from "react";
import ReactOTPInput, { type OTPInputProps } from "react-otp-input";

// eslint-disable-next-line react/display-name
export const OtpInputRef = React.forwardRef<HTMLInputElement, OTPInputProps>(
  (props, ref) => (
    <div ref={ref}>
      <ReactOTPInput {...props} />
    </div>
  )
);
