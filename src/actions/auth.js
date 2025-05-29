export const loginAccountSuccess = (token) => ({
    type: "LOGIN_ACCOUNT_SUCCESS",
    payload: { token }
});

export const logoutAccount = () => ({
    type: "LOGOUT_ACCOUNT"
});

export const tokenExpiredAccount = () => ({
    type: "TOKEN_EXPIRED_ACCOUNT"
});