import { Route, Routes } from "react-router-dom";
import Main from './Component/Main'
import Login from './Component/member/Login'


function App() {
    return (
        <div>
            <Routes>
                <Route path='/' element={<Main />}/>
                <Route path="/memberLogin" element={<Login />}/>
            </Routes>
        </div>
    );
}

export default App;
