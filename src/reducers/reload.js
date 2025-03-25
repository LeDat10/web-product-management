const reloadReducer = (state = false, action) => {
    switch (action.type) {
        case "RELOAD":
            console.log(state);
            return !state;
    
        default:
            return state;
    }
};

export default reloadReducer;