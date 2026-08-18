import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../../style/member/Find.css';

function FindId() {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [foundId, setFoundId] = useState(''); // 성공 시 아이디가 담기는 곳
    const navigate = useNavigate();

    const handleFindId = () => {
        if (!name) return alert('이름을 입력하세요.');
        if (!phone) return alert('전화번호를 입력하세요.');

        axios.post('/api/member/findId', { name: name, phone: phone })
            .then((result) => {
                if (result.data && result.data.userid) {
                    setFoundId(result.data.userid); // 성공 시 데이터 저장 -> 화면에 결과 출력됨
                } else {
                    alert('일치하는 회원 정보를 찾을 수 없습니다.');
                    setFoundId('');
                }
            })
            .catch((err) => {
                console.error(err);
                alert('아이디 찾기 중 오류가 발생했습니다.');
            });
    };

    return (
        <div className="join-wrapper">
            <h2 className="join-title">아이디 찾기</h2>

            <div className="join-form">
                <div className="join-box">
                    <div className="join-row">
                        <label className="join-label">이름</label>
                        <input
                            className="join-input-etc"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.currentTarget.value)}
                            placeholder="이름을 입력하세요."
                        />
                    </div>
                    <div className="join-row">
                        <label className="join-label">전화번호</label>
                        <input
                            className="join-input-etc"
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.currentTarget.value)}
                            placeholder="010-XXXX-XXXX"
                        />
                    </div>
                </div>
            </div>

            {/* 성공했을 때만 나타나는 결과 */}
            {foundId ? (
                <div style={{ margin: '20px auto', padding: '15px', maxWidth: '480px', backgroundColor: '#f9f9f9', border: '1px solid #ddd', textAlign: 'center', boxSizing: 'border-box' }}>
                    <p style={{ margin: 0 }}>회원님의 아이디(이메일)는 다음과 같습니다:</p>
                    <p style={{ fontSize: '18px', color: 'blue', fontWeight: 'bold', marginTop: '10px' }}>{foundId}</p>
                    <button className="join-btn-join" style={{ marginTop: '15px', width: '100%' }} onClick={() => navigate('/Login')}>로그인으로 가기</button>
                </div>
            ) : (
                <div className="find-btn-area">
                    <button className="join-btn-join" onClick={handleFindId}>아이디 찾기</button>
                    <button className="join-btn-zip_num" onClick={() => navigate('/find')}>이전으로</button>
                </div>
            )}
            <hr />
        </div>
    );
}

export default FindId;