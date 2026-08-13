import { Route, Routes } from "react-router-dom";
import Main from './Component/Main'
import UserLayout from './Component/UserLayout';
import MemberLogin from './Component/member/MemberLogin';
import Join from './Component/member/Join';
import BoardList from './Component/board/BoardList'
import BoardWrite from './Component/board/BoardWrite'

function App() {
    return (
        <div>
            <Routes>
                <Route element={<UserLayout />}>
                    <Route path="/" element={<Main />} />

                    {/* 로그인 회원가입 */}
                    <Route path='/memberLogin' element={<MemberLogin />} />
                    <Route path='/Join' element={<Join />} />
                    <Route path='/boardList' element={<BoardList />}/>
                    <Route path='/boardWrite' element={<BoardWrite />} />
                </Route>
            </Routes>
        </div>
    );
}

export default App;