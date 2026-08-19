import { Route, Routes } from "react-router-dom";

import Main from './Components/Main/Main'
import UserLayout from './Components/Layout/UserLayout';
import MemberLogin from './Components/Member/MemberLogin';
import Join from './Components/Member/Join';
import BoardList from './Components/Board/BoardList'
import BoardWrite from './Components/Board/BoardWrite'
import BoardView from "./Components/Board/BoardView";
import UpdateBoard from './Components/Board/UpdateBoard';

import SelectAi from "./Components/Ai/SelectAi";

import Info from "./Components/Info/Info";
import Hellow from "./Components/Info/Hellow";

import Find from './Components/Member/Find/Find';
import FindId from './Components/Member/Find/FindId';
import FindPass from './Components/Member/Find/FindPass';

import TalkAI from './Components/Ai/TalkAI'
import DiaryList from './Components/Diary/DiaryList';
import Diary from './Components/Member/Diary';
import SaveKakaoInfo from "./Components/Member/SaveKakaoInfo";
import MyPage from "./Components/MyPage/MyPage";
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
                    <Route path="/savekakaoinfo/:userid" element={<SaveKakaoInfo />} />

                </Route>
            </Routes>
        </div>
    );
}

export default App;
