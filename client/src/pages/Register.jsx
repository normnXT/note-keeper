import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Card, Input, Button } from "@material-tailwind/react";
import { toast } from "react-toastify";
import axios from "axios";

function Register() {
    const navigate = useNavigate();
    const [registerName, setRegisterName] = useState("");
    const [registerEmail, setRegisterEmail] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");
    const [confirmRegisterPassword, setConfirmRegisterPassword] = useState("");

    // Passwords must match and emails cannot already exist in the database, this is verified by the backend route
    // Mismatching passwords or the email already being registered returns status 400 and a descriptive message that is toasted
    const onRegister = async (e) => {
        e.preventDefault();

        const user = {
            displayName: registerName,
            email: registerEmail,
            password: registerPassword,
            confirmPassword: confirmRegisterPassword,
        };

        try {
            const res = await axios.post('/api/local/register', user, {
                withCredentials: true,
            });
            if (res.status === 200) {
                navigate("/");
                toast.success(res.data.success);
            }
        } catch (err) {
            console.log(err);
            const errorMessage = err.response?.data?.error || "An error occurred";
            toast.error(errorMessage);
        }
    };

    return (
        <Card
            color="transparent"
            shadow={false}
            className="fixed inset-0 flex items-center justify-center"
        >
            <span className="text-2xl text-sepia-200">Register</span>
            <form onSubmit={onRegister} className="mb-16 mt-4 w-96">
                <div className="mb-1 flex flex-col gap-4">
                    <span className="-mb-3 text-sepia-200">Display Name</span>
                    <Input
                        type="name"
                        id="name"
                        value={registerName}
                        onChange={(e) => setRegisterName(e.target.value)}
                        size="lg"
                        className="!border !border-sepia-100 !text-sepia-200 placeholder:text-sepia-200 placeholder:opacity-50 focus:!border-gray-500"
                        labelProps={{
                            className: "before:content-none after:content-none",
                        }}
                    />
                    <span className="-mb-3 text-sepia-200">Your Email</span>
                    <Input
                        type="email"
                        id="email"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        size="lg"
                        placeholder="name@mail.com"
                        className="!border !border-sepia-100 !text-sepia-200 placeholder:text-sepia-200 placeholder:opacity-50 focus:!border-gray-500"
                        labelProps={{
                            className: "before:content-none after:content-none",
                        }}
                    />
                    <span className="-mb-3 text-sepia-200">Password</span>
                    <Input
                        type="password"
                        id="password"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        size="lg"
                        placeholder="••••••••"
                        className="!border !border-sepia-100 !text-sepia-200 placeholder:text-sepia-200 placeholder:opacity-50 focus:!border-gray-500"
                        labelProps={{
                            className: "before:content-none after:content-none",
                        }}
                    />
                    <span className="-mb-3 text-sepia-200">
                        Confirm Password
                    </span>
                    <Input
                        type="password"
                        id="confirmPassword"
                        value={confirmRegisterPassword}
                        onChange={(e) =>
                            setConfirmRegisterPassword(e.target.value)
                        }
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
                    Sign up
                </Button>
            </form>
        </Card>
    );
}

export default Register;
