import { useMemo } from "react"

const authObj = {
    isAuthenticated:true,
    token: "",
    setToken: (token: string) => {
        authObj.token = token
    },
    permissions : [
        "user",
    ],
}

export default function useAuth(){
    const auth = useMemo(() => authObj, [])

    return auth
}