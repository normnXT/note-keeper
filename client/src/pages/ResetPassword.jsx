import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Card, Input, Button } from "@material-tailwind/react";
import { toast } from "react-toastify";
import axios from "axios";

function ResetPassword() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Password matching is verified by the backend route, users are notified if the passwords do not match through toast
    const onSubmitPassword = async (e) => {
        e.preventDefault();

        const data = {
            _id: id,
            newPassword: newPassword,
            confirmPassword: confirmPassword,
        };

        try {
            const res = await axios.post("/api/local/resetPassword", data, {
                withCredentials: true,
            });
            if (res.status === 200) {
                navigate("/");
                toast.success(res.data.success);
            }
        } catch (err) {
            console.log(err);
            const errorMessage =
                err.response?.data?.error || "An error occurred";
            toast.error(errorMessage);
        }
    };

    return (
        <Card
            color="transparent"
            shadow={false}
            className="fixed inset-0 flex items-center justify-center"
        >
            <span className="text-2xl text-sepia-200">Reset Password</span>
            <form onSubmit={onSubmitPassword} className="mb-16 mt-4 w-96">
                <div className="mb-1 flex flex-col gap-4">
                    <span className="-mb-3 text-sepia-200">New Password</span>
                    <Input
                        type="password"
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        size="lg"
                        placeholder="••••••••"
                        className="!border !border-sepia-100 !rounded-lg text-sepia-200 placeholder:text-sepia-200 placeholder:opacity-50 focus:!border-gray-500"
                        labelProps={{
                            className: "before:content-none after:content-none",
                        }}
                    />
                    <span className="-mb-3 text-sepia-200">
                        Confirm New Password
                    </span>
                    <Input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        size="lg"
                        placeholder="••••••••"
                        className="!border !border-sepia-100 !rounded-lg text-sepia-200 placeholder:text-sepia-200 placeholder:opacity-50 focus:!border-gray-500"
                        labelProps={{
                            className: "before:content-none after:content-none",
                        }}
                    />
                </div>
                <Button
                    type="submit"
                    variant="outlined"
                    className="mt-6 border-sepia-100 font-semibold text-sepia-200"
                    fullWidth
                >
                    Submit
                </Button>
            </form>
        </Card>
    );
}

export default ResetPassword;
