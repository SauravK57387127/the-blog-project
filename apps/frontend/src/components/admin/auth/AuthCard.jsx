import GoogleOAuthButton from "./GoogleOAutButton";
import GoogleOneTapLogin from "./GoogleOneTapLogin";

export default function AuthCard() {
    return (
        <>
            <GoogleOAuthButton />
            <GoogleOneTapLogin />
        </>
    );
}
