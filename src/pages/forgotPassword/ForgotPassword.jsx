import { Card, Form, Input, Button, message } from "antd";
import React, { useRef, useState } from "react";
import { forgotPassword, resetPassword } from "../../services/auth.services";
import { useNavigate } from "react-router-dom";
import OtpRegister from "../../components/auth/OtpRegister";
import SpinnerLoading from "../../components/loading/SpinnerLoading";
import { toast } from "react-toastify";
import { toastError } from "../../utils/helpers";

const ForgotPassword = () => {
  const [form] = Form.useForm();
  const inputsOtpRef = useRef([]);
  const navigate = useNavigate();

  const [isOpenOtpForm, setIsOpenOtpForm] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [errorOtp, setErrorOtp] = useState("");

  const handleFormSubmitEmail = async (values) => {
    setLoadingData(true);
    try {
      const resForgotPassword = await forgotPassword(
        form.getFieldValue("email")
      );

      setIsOpenOtpForm(true);
    } catch (error) {
      console.error("Error change password:", error);
      toast.error("Error change password: " + error.response.data);
    } finally {
      setLoadingData(false);
    }
  };

  const confirmOTP = async () => {
    setLoadingData(true);

    try {
      const otp = [
        inputsOtpRef.current[0].value,
        ...inputsOtpRef.current.slice(1).map((input) => input.value),
      ].join("");

      const dataBody = {
        otp: otp,
        email: form.getFieldValue("email"),
      };

      const resOtp = await resetPassword(dataBody);

      navigate("/");
      setIsOpenOtpForm(false);
      toast.success(`Mật khẩu mới đã được gửi tới email của bạn!`);
    } catch (error) {
      setErrorOtp(error.response.data);
    } finally {
      setLoadingData(false);
    }
  };

  const resendOTP = async () => {
    setErrorOtp("");
    setLoadingData(true);

    try {
      const resSendOtp = await forgotPassword({
        email: form.getFieldValue("email"),
      });

      toast.success("OTP đã được gửi lại, vui lòng kiểm tra!");
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("Có lỗi xảy ra khi gửi OTP. Vui lòng thử lại!");
    } finally {
      setLoadingData(false);
    }
  };

  return (
    <>
      {!isOpenOtpForm ? (
        <div className="container flex justify-center py-10">
          <Card
            title="Reset your password"
            bordered={false}
            className="w-[500px] mx-auto mt-10"
          >
            <p className="text-lg">
              Enter the email you want to retrieve your password:
            </p>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleFormSubmitEmail}
            >
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  {
                    type: "email",
                    message: "Invalid email address!",
                  },
                  {
                    required: true,
                    message: "Please enter email!",
                  },
                ]}
              >
                <Input placeholder="Enter your email" />
              </Form.Item>
              <Form.Item className="flex justify-end">
                <Button type="primary" htmlType="submit">
                  Send
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      ) : (
        <OtpRegister
          email={form.getFieldValue("email")}
          verifyAction={confirmOTP}
          inputsRef={inputsOtpRef}
          error={errorOtp}
          setError={() => setErrorOtp("")}
          resendOtp={resendOTP}
        />
      )}

      {loadingData && <SpinnerLoading />}
    </>
  );
};

export default ForgotPassword;
