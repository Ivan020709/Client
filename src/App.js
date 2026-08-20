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
import Map from "./Components/Info/Map";

import Find from './Components/Member/Find/Find';
import FindId from './Components/Member/Find/FindId';
import FindPass from './Components/Member/Find/FindPass';

import TalkAI from './Components/Ai/TalkAI'
import DiaryList from './Components/Diary/DiaryList';
import Diary from './Components/Calendar/Diary';
import SaveKakaoInfo from "./Components/Member/SaveKakaoInfo";
import MyPage from "./Components/MyPage/MyPage";
import Feelog from './Components/Intro/Feelog';

import EmotionDiary from "./Components/Calendar/EmotionDiary";
import EmotionCalendar from "./Components/Calendar/EmotionCalendar";
import NoticeList from "./Components/Notice/NoticeList";
import NoticeWrite from "./Components/Notice/NoticeWrite";
import NoticeView from "./Components/Notice/NoticeView";

import InquiryList from './Components/Board/InquiryList'
import InquiryView from './Components/Board/InquiryView'
import InquiryWrite from './Components/Board/InquiryWrite'
import UpdateInquiry from './Components/Board/UpdateInquiry'

import AdminPage from './Components/MyPage/AdminPage'
import ErrorLog from './Components/MyPage/ErrorLog'

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
                    <Route path='/feelog' element={<Feelog />} />

                    {/*ai대화 */}
                    <Route path='/selectAi' element={<SelectAi />} />
                    <Route path='/talkAI' element={<TalkAI />} />

                    {/*이용안내*/}
                    <Route path='/info' element={<Info />} />
                    <Route path='/hellow' element={<Hellow />} />
                    <Route path='/map' element={<Map />} />

                    {/* 마이페이지 */}
                    <Route path='/myPage' element={<MyPage />} />
                    <Route path='/adminPage' element={<AdminPage />} />
                    <Route path='/errorLog' element={<ErrorLog />} />

                    {/* 다이어리 */}
                    <Route path='/emotionDiary' element={<EmotionDiary />} />
                    <Route path='/emotionCalendar' element={<EmotionCalendar />} />

                    {/* 아이디 비밀번호 찾기 */}
                    <Route path='/find' element={<Find />} />
                    <Route path='/findId' element={<FindId />} />
                    <Route path='/findPass' element={<FindPass />} />

                    <Route path='/diaryList' element={<DiaryList />} />
                    <Route path='/Diary' element={<Diary />} />
                    <Route path="/savekakaoinfo/:userid" element={<SaveKakaoInfo />} />

                    {/* 공지사항 */}
                    <Route path="/noticeList" element={<NoticeList />} />
                    <Route path="/noticeWrite" element={<NoticeWrite />} />
                    <Route path="/noticeView/:noticenum" element={<NoticeView />} />

                    <Route path="/inquiryList" element={<InquiryList />} />
                    <Route path="/inquiryView" element={<InquiryView />} />
                    <Route path="/inquiryWrite" element={<InquiryWrite />} />
                    <Route path="/updateInquiry" element={<UpdateInquiry />} />

                </Route>
            </Routes>
        </div>
    );
}

export default App;
