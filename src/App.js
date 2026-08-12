import { Route, Routes } from "react-router-dom";
import Main from './Component/Main'
import MemberLogin from "./Component/member/MemberLogin";
import BoardList from "./Component/board/BoardList";


function App() {
    return (
        <div>
            <Routes>
                <Route path='/' element={<Main />}/>
                <Route path='/memberLogin' element={<MemberLogin />}/>
                <Route path='/boardList' element={<BoardList />}/>
            </Routes>
        </div>
    );
}

export default App;
