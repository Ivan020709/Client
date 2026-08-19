import { Route, Routes } from "react-router-dom";

import Main from './Component/Main'
import UserLayout from './Component/UserLayout';
import MemberLogin from './Component/member/MemberLogin';
import Join from './Component/member/Join';
import BoardList from './Component/board/BoardList'
import BoardWrite from './Component/board/BoardWrite'
import BoardView from "./Component/board/BoardView";
import UpdateBoard from './Component/board/UpdateBoard';

import SelectAi from "./Component/ai/SelectAi";

import Info from "./Component/info/Info";
import Hellow from "./Component/info/Hellow";

import Find from './Component/member/find/Find';
import FindId from './Component/member/find/Findid';
import FindPass from './Component/member/find/Findpass';

import TalkAI from './Component/ai/TalkAI'
import DiaryList from './Component/diary/DiaryList';
import Diary from './Component/member/Diary';
import Savekakaoinfo from "./Component/member/Savekakaoinfo";
import MyPage from "./Component/mypage/MyPage";
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

                    <Route path='/boardView/:boardnum' element={<BoardView />} />
                    <Route path="/updateBoard/:boardnum" element={<UpdateBoard />} />

                    {/*ai대화 */}
                    <Route path='/selectAi' element={<SelectAi />} />
                    <Route path='/talkAI' element={<TalkAI />} />
                    {/*이용안내*/}
                    <Route path='/info' element={<Info />} />
                    <Route path='/hellow' element={<Hellow />} />

                    {/* 마이페이지 */}
                    <Route path='/myPage' element={<MyPage />} />

                    {/* 아이디 비밀번호 찾기 */}
                    <Route path='/find' element={<Find />} />
                    <Route path='/findId' element={<FindId />} />
                    <Route path='/findPass' element={<FindPass />} />

                    <Route path='/diaryList' element={<DiaryList />} />
                    <Route path='/Diary' element={<Diary />} />
                    <Route path="/savekakaoinfo/:userid" element={<Savekakaoinfo />} />

                </Route>
            </Routes>
        </div>
    );
}

export default App;