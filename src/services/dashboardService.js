import { get } from "../utils/request";

export const getDashboard = async () => {
    const result = await get(`dashboard`);
    return result;
}