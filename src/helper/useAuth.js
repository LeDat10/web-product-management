import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRole } from "../actions/role";

const useAuth = () => {
    const dispatch = useDispatch();
    const role = useSelector(state => state.roleReducer);
    const reload = useSelector(state => state.reloadReducer);
    
    useEffect(() => {
        dispatch(getRole());
    }, [reload]);

    return role.permissions;
};

export default useAuth;