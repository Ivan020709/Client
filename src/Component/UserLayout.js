import { Outlet } from "react-router-dom";

import Header from "./Header";
import SubMenu from "./SubMenu";
import Footer from "./Footer";

function UserLayout() {
    return (
        <div>
            <Header />
            <SubMenu />
            <Outlet />
            <Footer />
        </div>
    );
}

export default UserLayout;