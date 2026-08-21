import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import './FindPass.css';

function FindPass() {

    const [userid, setUserid] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');

    const navigate = useNavigate();

    /* =========================================================
       전화번호 자동 하이픈
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
       비밀번호 찾기
    ========================================================= */

    const handleFindPwd = () => {

        /* -----------------------------
           아이디 검사
        ----------------------------- */

        if (!userid) {
            return alert('아이디를 입력하세요.');
        }


        /* -----------------------------
           이름 검사
        ----------------------------- */

        if (!name) {
            return alert('이름을 입력하세요.');
        }


        /* -----------------------------
           전화번호 검사
        ----------------------------- */

        if (!phone) {
            return alert('전화번호를 입력하세요.');
        }


        // 하이픈을 제외하고 숫자만 확인
        const phoneNumber = phone.replace(/[^0-9]/g, '');


        // 전화번호 11자리 확인
        if (phoneNumber.length !== 11) {
            return alert('전화번호 11자리를 정확하게 입력하세요.');
        }


        /* =====================================================
           서버에 회원정보 확인 요청
        ===================================================== */

        axios.post('/api/member/findPwd', {

            userid: userid,
            name: name,
            phone: phone

        })
            .then((result) => {

                /* =============================================
                   회원정보 확인 성공

                   ★ 중요
                   UpdatePwd 페이지로 userid를 전달
                ============================================= */

                if (result.data.msg === 'OK') {

                    navigate('/updatePwd', {
                        state: {
                            userid: userid
                        }
                    });

                } else {

                    alert('일치하는 회원 정보를 찾을 수 없습니다.');

                }

            })
            .catch((err) => {

                console.error(err);

                alert('비밀번호 찾기 중 오류가 발생했습니다.');

            });
    };


    return (

        <div className="find-pass-page">


            {/* =================================================
                제목
            ================================================= */}

            <h2 className="find-pass-title">
                비밀번호 찾기
            </h2>


            {/* =================================================
                입력 영역
            ================================================= */}

            <div className="find-pass-form">

                <div className="find-pass-box">


                    {/* =================================================
                        아이디
                    ================================================= */}

                    <div className="find-pass-row">

                        <label className="find-pass-label">
                            아이디
                        </label>

                        <input
                            className="find-pass-input"
                            type="text"
                            value={userid}
                            onChange={(e) => setUserid(e.currentTarget.value)}
                            placeholder="abc@abc.com"
                        />

                    </div>


                    {/* =================================================
                        이름
                    ================================================= */}

                    <div className="find-pass-row">

                        <label className="find-pass-label">
                            이름
                        </label>

                        <input
                            className="find-pass-input"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.currentTarget.value)}
                            placeholder="이름을 입력하세요."
                        />

                    </div>


                    {/* =================================================
                        전화번호
                    ================================================= */}

                    <div className="find-pass-row">

                        <label className="find-pass-label">
                            전화번호
                        </label>

                        <input
                            className="find-pass-input"
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
                버튼
            ================================================= */}

            <div className="find-pass-button-area">


                {/* 비밀번호 찾기 */}

                <button
                    type="button"
                    className="find-pass-button find-pass-search-button"
                    onClick={handleFindPwd}
                >
                    비밀번호 찾기
                </button>


                {/* 이전으로 */}

                <button
                    type="button"
                    className="find-pass-button find-pass-back-button"
                    onClick={() => navigate('/find')}
                >
                    이전으로
                </button>

            </div>


            {/* =================================================
                구분선
            ================================================= */}

            <hr className="find-pass-divider" />

        </div>
    );
}

export default FindPass;
