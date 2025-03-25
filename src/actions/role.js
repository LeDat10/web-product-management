import { getPermssions } from "../services/accountServices"

export const getRole = () => {
    return async (dispatch) => {
        const result = await getPermssions();
        dispatch({
            type: "SET_ROLE",
            payload: result
        });
    };
};