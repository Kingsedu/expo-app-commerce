import { SignIn } from "@clerk/clerk-react";
import React from "react";

function LoginPage() {
  return (
    <div>
      This is the Login Page
      <SignIn />
    </div>
  );
}

export default LoginPage;
