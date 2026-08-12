import React from 'react'
import '../../style/member/MemberLogin.css';

function MemberLogin() {
    return (
        <div>
            <div>
                <div>
                    <div>아이디</div>
                    <div>
                        <input type='text'/>
                    </div>
                </div>
                <div>
                    <div>비밀번호</div>
                    <div>
                        <input type='password'/>
                    </div>
                </div>
            </div>
            <div>
                <div>
                    <div>
                        <button>로그인</button>
                    </div>
                </div>
                <div style={{display:'flex'}}>
                    <div>아이디 찾기</div>|
                    <div>비밀번호 찾기</div>
                </div>
                <div>
                    <div>----------또는----------</div>
                </div>
                <div>
                    <div>카카오 로그인</div>
                </div>
                <div>
                    <div>아직 회원이 아니신가요?</div>
                    <div>회원가입</div>
                </div>
            </div>
        </div>
    )
}

export default MemberLogin