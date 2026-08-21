import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import './FindId.css';

function FindId() {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [foundId, setFoundId] = useState('');

    const navigate = useNavigate();


    /* =========================================================
       전화번호 입력       
       숫자만 입력 가능
       최대 11자리
       자동으로 - 추가
    ========================================================= */

    const handlePhoneChange = (e) => {
        // 숫자만 남기기
        let value = e.target.value.replace(/[^0-9]/g, '');
        // 최대 11자리
        value = value.substring(0, 11);
        // 하이픈 자동 추가
        if (value.length <= 3) {
            // 010
            value = value;
        } else if (value.length <= 7) {
            // 010-1234
            value =
                value.substring(0, 3) +
                '-' +
                value.substring(3);
        } else {
            // 010-1234-5678
            value =
                value.substring(0, 3) +
                '-' +
                value.substring(3, 7) +
                '-' +
                value.substring(7);
        }

        setPhone(value);
    };


    /* =========================================================
       아이디 찾기
    ========================================================= */

    const handleFindId = () => {
        if (!name) {
            return alert('이름을 입력하세요.');
        }

        if (!phone) {
            return alert('전화번호를 입력하세요.');
        }


        // 하이픈을 제외한 실제 숫자 확인
        const phoneNumber = phone.replace(/[^0-9]/g, '');

        // 전화번호 11자리 확인
        if (phoneNumber.length !== 11) {
            return alert('전화번호 11자리를 정확하게 입력하세요.');
        }


        axios.post('/api/member/findId', {
            name: name,
            phone: phone
        })
            .then((result) => {

                if (result.data && result.data.userid) {

                    setFoundId(result.data.userid);

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
        <div className="find-id-page">


            {/* =================================================
                제목
            ================================================= */}

            <h2 className="find-id-title">
                아이디 찾기
            </h2>


            {/* =================================================
                입력 영역
            ================================================= */}

            <div className="find-id-form">

                <div className="find-id-box">


                    {/* =================================================
                        이름
                    ================================================= */}

                    <div className="find-id-row">

                        <label className="find-id-label">
                            이름
                        </label>

                        <input
                            className="find-id-input"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.currentTarget.value)}
                            placeholder="이름을 입력하세요."
                        />

                    </div>


                    {/* =================================================
                        전화번호
                    ================================================= */}

                    <div className="find-id-row">

                        <label className="find-id-label">
                            전화번호
                        </label>

                        <input
                            className="find-id-input"
                            type="tel"
                            value={phone}
                            onChange={handlePhoneChange}
                            placeholder="010-XXXX-XXXX"
                            inputMode="numeric"
                            maxLength={13}
                        />

                    </div>

                </div>

            </div>


            {/* =================================================
                아이디 찾기 결과
            ================================================= */}

            {foundId ? (

                <div className="find-id-result">

                    <p className="find-id-result-message">
                        회원님의 아이디(이메일)는 다음과 같습니다.
                    </p>

                    <p className="find-id-result-value">
                        {foundId}
                    </p>

                    <button
                        type="button"
                        className="find-id-result-button"
                        onClick={() => navigate('/memberLogin')}
                    >
                        로그인으로 가기
                    </button>

                </div>

            ) : (

                /* =================================================
                   버튼 영역
                ================================================= */

                <div className="find-id-button-area">

                    <button
                        type="button"
                        className="find-id-button find-id-search-button"
                        onClick={handleFindId}
                    >
                        아이디 찾기
                    </button>

                    <button
                        type="button"
                        className="find-id-button find-id-back-button"
                        onClick={() => navigate('/find')}
                    >
                        이전으로
                    </button>

                </div>

            )}


            <hr className="find-id-divider" />

        </div>
    );
}

export default FindId;