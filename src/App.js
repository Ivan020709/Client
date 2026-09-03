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
import G from "./Components/Ai/G";
import Lo from "./Components/Ai/Lo";
import Feel from "./Components/Ai/Feel";

import Info from "./Components/Info/Info";
import Hellow from "./Components/Info/Hellow";
import Map from "./Components/Info/Map";

import Find from './Components/Member/Find/Find';
import FindId from './Components/Member/Find/FindId';
import FindPass from './Components/Member/Find/FindPass';

import Diary from './Components/Calendar/Diary';
import SaveKakaoInfo from "./Components/Member/SaveKakaoInfo";
import MyPage from "./Components/MyPage/MyPage";
import Feelog from './Components/Intro/Feelog';

import NoticeList from "./Components/Notice/NoticeList";
import NoticeWrite from "./Components/Notice/NoticeWrite";
import NoticeView from "./Components/Notice/NoticeView";

import InquiryList from './Components/Board/InquiryList'
import InquiryView from './Components/Board/InquiryView'
import InquiryWrite from './Components/Board/InquiryWrite'
import UpdateInquiry from './Components/Board/UpdateInquiry'

import AdminPage from './Components/MyPage/AdminPage'
import ErrorLog from './Components/MyPage/ErrorLog'
import AdminActivityLog from './Components/MyPage/AdminActivityLog'

import UpdatePwd from './Components/Member/Find/UpdatePwd';

import ProtectedRoute from './Components/Auth/ProtectedRoute';
import Role from './Components/Admin/Role';
import SharedDiary from './Components/Calendar/SharedDiary';
import ItemShop from './Components/Item/ItemShop';
import ItemPayment from './Components/Item/ItemPayment';
import PaymentResult from './Components/Item/PaymentResult';
import PaymentHistory from './Components/MyPage/PaymentHistory';
import Ranking from './Components/Ranking/Ranking';

function App() {
    return (
        <div>
            <Routes>
                <Route element={<UserLayout />}>
                    <Route path="/" element={<Main />} />

                    {/* 로그인 회원가입 */}
                    <Route path='/memberLogin' element={<MemberLogin />} />
                    <Route path='/Join' element={<Join />} />
                    <Route path="/savekakaoinfo/:userid" element={<SaveKakaoInfo />} />

                    {/* 자유 게시판 */}
                    <Route path='/boardList' element={<BoardList />} />
                    <Route path='/boardView/:boardnum' element={<BoardView />} />

                    {/*이용안내*/}
                    <Route path='/info' element={<Info />} />
                    <Route path='/hellow' element={<Hellow />} />
                    <Route path='/map' element={<Map />} />
                    <Route path='/feelog' element={<Feelog />} />

                    {/* 관리자 */}
                    <Route path='/adminPage' element={<AdminPage />} />
                    <Route path='/errorLog' element={<ErrorLog />} />
                    <Route path='/adminActivityLog' element={<AdminActivityLog />} />

                    {/* 아이디 비밀번호 찾기 */}
                    <Route path='/find' element={<Find />} />
                    <Route path='/findId' element={<FindId />} />
                    <Route path='/findPass' element={<FindPass />} />
                    <Route path='/updatePwd' element={<UpdatePwd />} />

                    {/* 공지사항 */}
                    <Route path="/noticeList" element={<NoticeList />} />
                    <Route path="/noticeView/:noticenum" element={<NoticeView />} />

                    {/* 문의사항 목록과 상세는 비회원도 조회 가능 */}
                    <Route path="/inquiryList" element={<InquiryList />} />
                    <Route path="/inquiryView/:inquirynum" element={<InquiryView />} />

                    {/* 아이템 상점과 친밀도 랭킹은 비회원도 구경할 수 있습니다. */}
                    <Route path="/itemShop" element={<ItemShop />} />
                    <Route path="/ranking" element={<Ranking />} />

                    {/* 로그인 사용자만 이용 가능 */}
                    <Route element={<ProtectedRoute />}>

                        {/* ai대화 */}
                        <Route path='/selectAi' element={<SelectAi />} />
                        <Route path='/g' element={<G />} />
                        <Route path='/lo' element={<Lo />} />
                        <Route path='/feel' element={<Feel />} />

                        {/* 다이어리 */}
                        <Route path='/Diary' element={<Diary />} />
                        <Route path='/SharedDiary' element={<SharedDiary />} />

                        {/* 마이페이지 */}
                        <Route path='/myPage' element={<MyPage />} />
                        <Route path='/paymentHistory' element={<PaymentHistory />} />

                        {/* 결제 요청과 결과 확인은 로그인 사용자만 가능합니다. */}
                        <Route path='/itemPayment/:itemId' element={<ItemPayment />} />
                        <Route path='/paymentResult' element={<PaymentResult />} />

                        {/* 자유 게시판 */}
                        <Route path='/boardWrite' element={<BoardWrite />} />
                        <Route path="/updateBoard/:boardnum" element={<UpdateBoard />} />

                        {/* 문의 사항 */}
                        <Route path="/inquiryWrite" element={<InquiryWrite />} />
                        <Route path="/updateInquiry/:inquirynum" element={<UpdateInquiry />} />

                        {/* 공지사항 작성은 로그인 및 관리자 확인 필요 */}
                        <Route path="/noticeWrite" element={<NoticeWrite />} />

                        <Route path="/role" element={<Role />} />

                    </Route>

                </Route>
            </Routes>
        </div>
    );
}

export default App;
