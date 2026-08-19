import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import './Find.css';

function UpdatePwd() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleUpdate = () => {
        if (!password) return alert('새 비밀번호를 입력하세요.');
        if (password !== confirmPassword) return alert('비밀번호가 일치하지 않습니다.');

        axios.post('/api/member/updatePwd', { password })
            .then((result) => {
                // 성공 시 새로운 윈도우 창 띄우기
                const successWindow = window.open('', '_blank', 'width=400,height=300,left=300,top=300');
                if (successWindow) {
                    successWindow.document.write(`
                        <div style="font-family: sans-serif; text-align: center; padding: 40px;">
                            <h2 style="color: #333;">변경 성공!</h2>
                            <p style="color: #666;">비밀번호가 성공적으로 변경되었습니다.</p>
                        </div>
                    `);
                }
                navigate('/Login');
            })
            .catch((err) => {
                console.error(err);
                alert('비밀번호 변경 중 오류가 발생했습니다.');
            });
    };

    return (
        <div className="join-wrapper">
            <h2 className="join-title">새 비밀번호 입력</h2>

            <div className="join-form">
                <div className="join-box">
                    <div className="join-row">
                        <label className="join-label">새 비밀번호</label>
                        <input
                            className="join-input-etc"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.currentTarget.value)}
                            placeholder="새 비밀번호 입력"
                        />
                    </div>

                    <div className="join-row">
                        <label className="join-label">비밀번호 확인</label>
                        <input
                            className="join-input-etc"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.currentTarget.value)}
                            placeholder="비밀번호 재입력"
                        />
                    </div>
                </div>
            </div>

            <div className="find-btn-area">
                <button
                    className="join-btn-join"
                    onClick={handleUpdate}
                >
                    변경 완료
                </button>
                <button
                    className="join-btn-zip_num"
                    onClick={() => navigate('/findPass')}
                >
                    취소
                </button>
            </div>

            <hr />
        </div>
    );
}

export default UpdatePwd;
