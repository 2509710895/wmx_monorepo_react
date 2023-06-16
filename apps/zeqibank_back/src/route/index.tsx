import { FC } from "react";
import { useRoutes } from "react-router-dom";
import { RouteConfig } from "./config";

const Routes: FC = () => {

    const routes = useRoutes(RouteConfig)

    return (
        routes
    )
}

export default Routes;