import '../styles/Login.css';


function Login() {
    const handleGoogleLogin = () => {
        window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
        
    };

    return (
        <>
        <div className="login-container">
            <h1>Todo App</h1>
            <button onClick={handleGoogleLogin} className = "login-button">
                Login with Google
            </button>
        </div>
        </>
    );
}

export default Login;