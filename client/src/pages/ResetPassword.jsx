import { Card, Input, Button } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function ResetPassword() {
    const navigate = useNavigate()
    const [email, setEmail] = useState("")

    return (
        <Card
            color="transparent"
            shadow={false}
            className="fixed inset-0 flex items-center justify-center"
        >
            <span className="text-2xl text-sepia-200">Reset Password</span>
            <form className="mb-16 mt-4 w-96">
                <div className="mb-1 flex flex-col gap-4">
                    <span className="-mb-3 text-sepia-200">Your Email</span>
                    <Input
                        type="email"
                        id="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        size="lg"
                        placeholder="name@mail.com"
                        className="!border !border-sepia-100 !text-sepia-200 placeholder:text-sepia-200 placeholder:opacity-50 focus:!border-gray-500"
                        labelProps={{
                            className: "before:content-none after:content-none",
                        }}
                    />
                </div>
                <Button
                    variant="outlined"
                    className="mt-6 !border-sepia-100 text-sepia-200"
                    fullWidth
                >
                    Submit
                </Button>
            </form>
        </Card>
    );
}

export default ResetPassword;