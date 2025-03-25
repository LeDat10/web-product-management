const roleReducer = (state = {permissions: []}, action) => {
    switch (action.type) {
        case "SET_ROLE":
            return ({
                permissions: action.payload.permissions
            });
    
        default:
            return state;

    }
};

export default roleReducer;