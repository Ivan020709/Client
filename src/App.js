import { Route, Routes } from "react-router-dom";
import Main from './Component/Main'
import MemberLogin from "./Component/member/MemberLogin";


function App() {
    return (
        <div>
            <Routes>
                <Route path='/' element={<Main />}/>
                <Route path='/memberLogin' element={<MemberLogin />}/>
            </Routes>
        </div>
    );
}

export default App;
