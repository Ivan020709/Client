import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import './Role.css';
import axios from 'axios';
import jaxios from '../../utils/jwtUtil'

function Role() {

    const loginUser = useSelector(state => state.user);

    const [code, setCode] = useState('');

    function onSubmit() {

        console.log('===== 관리자 권한 인증 시작 =====');
        console.log('loginUser:', loginUser);
        console.log('userid:', loginUser.userid);
        console.log('code:', code);

        jaxios.post(
            '/api/admin/addRole',
            null,
            {
                params: {
                    userid: loginUser.userid,
                    code: code
                }
            }
        )
            .then((result) => {

                console.log('===== 관리자 권한 인증 결과 =====');
                console.log('result:', result);
                console.log('result.data:', result.data);

                if (result.data.msg === 'OK') {

                    alert('관리자 권한이 부여되었습니다.');

                } else {

                    alert('관리자 인증 코드가 올바르지 않습니다.');

                }

            })
            .catch((err) => {

                console.error('===== 관리자 권한 인증 실패 =====');
                console.error(err);

            });
    }

    return (
        <div className="role-page">

            <div className="role-container">

                <div className="role-icon">
                    🔐
                </div>

                <div className="role-title">

                    <span>ADMIN ACCESS</span>

                    <h1>
                        관리자 권한 인증
                    </h1>

                    <p>
                        관리자 권한을 부여받으려면<br />
                        전달받은 인증 코드를 입력해주세요.
                    </p>

                </div>

                <div className="role-card">

                    <label>
                        관리자 인증 코드
                    </label>

                    <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="XXXX-XXXX-XXXX-XXXX"
                    />

                    <button onClick={onSubmit}>
                        관리자 권한 확인
                    </button>

                    <p className="role-notice">
                        인증 코드가 일치하면 해당 계정에<br />
                        관리자 권한이 부여됩니다.
                    </p>

                </div>

            </div>

        </div>
    );
}

export default Role;