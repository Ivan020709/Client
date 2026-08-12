import { Route, Routes } from "react-router-dom";
import Main from './Component/Main';
import UserLayout from './Component/UserLayout';
import MemberLogin from './Component/member/MemberLogin';
import Join from './Component/member/Join';

function App() {
    return (
        <div>
            <Routes>
                <Route element={<UserLayout />}>
                    <Route path="/" element={<Main />} />

                    {/* 로그인 회원가입 */}
                    <Route path='/memberLogin' element={<MemberLogin />} />
                    <Route path='/Join' element={<Join />} />
                </Route>
            </Routes>
        </div>
    );
}

export default App;