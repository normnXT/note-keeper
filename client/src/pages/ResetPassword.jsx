import { Card, Input, Button } from "@material-tailwind/react";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

function ResetPassword() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const onSubmitPassword = async (e) => {
        e.preventDefault();

        const data = {
            _id: id,
            newPassword: newPassword,
            confirmPassword: confirmPassword,
        };

        try {
            const res = await axios.post("/local/resetPassword", data, {
                withCredentials: true,
            });
            if (res.status === 400) {
                toast.error(res.data);
            } else {
                navigate("/");
                toast.success(res.data);
            }
        } catch (err) {
            console.log(err);
            toast.error(err.response.data);
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
                        className="!border !border-sepia-100 !text-sepia-200 placeholder:text-sepia-200 placeholder:opacity-50 focus:!border-gray-500"
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
                        className="!border !border-sepia-100 !text-sepia-200 placeholder:text-sepia-200 placeholder:opacity-50 focus:!border-gray-500"
                        labelProps={{
                            className: "before:content-none after:content-none",
                        }}
                    />
                </div>
                <Button
                    type="submit"
                    variant="outlined"
                    className="mt-6 !border-sepia-100 !font-semibold text-sepia-200"
                    fullWidth
                >
                    Submit
                </Button>
            </form>
        </Card>
    );
}

export default ResetPassword;
