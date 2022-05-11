import { PROFILE_REQUEST, PROFILE_SUCCESS, PROFILE_FAILED } from "../type/profileType";

const initState = {
    profile: {},
    error: '',
    loading: false,
}
export const myProfileReducer = (state = initState, action) => {
    const { payload, type } = action;
    if (type === PROFILE_SUCCESS) {
        return {
            ...state,
            profile: payload?.data?.data,
            loading: false
        }
    }
    if (type === PROFILE_FAILED) {
        return {
            ...state,
            error: payload.error,
            loading: false
        }
    }
    if (type === PROFILE_REQUEST) {
        return {
            ...state,
            loading: payload.loading
        }
    }
    return state;
}