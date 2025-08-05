const API_BASE_URL = 'http://localhost:5000';

export const API = {
    post: {
        login: `${API_BASE_URL}/api/auth/login`,
        signup: `${API_BASE_URL}/api/auth/register`,
        refresh: `${API_BASE_URL}/api/auth/refresh`,
        logout: `${API_BASE_URL}/api/auth/logout`,
        acceptFriend: `${API_BASE_URL}/api/users/accept-friend`,
        cancelRequest: `${API_BASE_URL}/api/users/cancel-request`,
        unfriend: `${API_BASE_URL}/api/users/unfriend`,
        friendRequest: `${API_BASE_URL}/api/users/friend-request`,
        blockUser: `${API_BASE_URL}/api/users/block`
    },
    get: {
        users: `${API_BASE_URL}/api/users`,
        me: `${API_BASE_URL}/api/users/me`
    }
}