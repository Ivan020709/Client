import { Route, Routes } from "react-router-dom";

import Main from './Component/Main'
import UserLayout from './Component/UserLayout';
import MemberLogin from './Component/member/MemberLogin';
import Join from './Component/member/Join';
import BoardList from './Component/board/BoardList'
import BoardWrite from './Component/board/BoardWrite'
// import Find from "./Component/member/Find";
// import FindPwd from "./Component/member/FindPwd";
// import FindId from "./Component/member/FindId";
import BoardView from "./Component/board/BoardView";

import SelectAi from "./Component/ai/SelectAi";

import Info from "./Component/info/Info";
import Hellow from "./Component/info/Hellow";

function App() {
    return (
        <div>
            <Routes>
                <Route element={<UserLayout />}>
                    <Route path="/" element={<Main />} />

                    {/* 로그인 회원가입 */}
                    <Route path='/memberLogin' element={<MemberLogin />} />
                    <Route path='/Join' element={<Join />} />
                    <Route path='/boardList' element={<BoardList />} />
                    <Route path='/boardWrite' element={<BoardWrite />} />
                    {/* <Route path='/find' element={<Find />} /> */}
                    {/* <Route path='/findId' element={<FindId />}/>
                    <Route path='/findPwd' element={<FindPwd />}/> */}
                    <Route path='/boardView/:num' element={<BoardView />} />
                    {/*ai대화 */}
                    <Route path='/selectAi' element={<SelectAi />} />
                    {/*이용안내*/}
                    <Route path='/info' element={<Info />} />
                    <Route path='/hellow' element={<Hellow />} />
                </Route>
            </Routes>
        </div>
    );
}

export default App;