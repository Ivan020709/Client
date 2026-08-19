import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DaumPostcode from 'react-daum-postcode';
import Modal from 'react-modal';
import { useSelector } from 'react-redux';
import '../../style/mypage/mypage.css';

function MyPage() {
    const loginUser = useSelector(state => state.user);
    const navigate = useNavigate();

    const [pwd, setPwd] = useState('');
    const [pwdChk, setPwdChk] = useState('');

    const [nickname, setNickname] = useState('');
    const [renickname, setRenickname] = useState('');
    const [nicknameCheckResult, setNicknameCheckResult] = useState('');
    const [nicknameMsgStyle, setNicknameMsgStyle] = useState({});

    const [savefilename, setSavefilename] = useState('');
    const [imgSrc, setImgSrc] = useState('');

    const [phone, setPhone] = useState('');

    const [zip_num, setZip_num] = useState('');
    const [address1, setAddress1] = useState('');
    const [address2, setAddress2] = useState('');
    const [address3, setAddress3] = useState('');

    const [isOpen, setIsOpen] = useState(false);


    useEffect(() => {
        if (!loginUser || !loginUser.email) {
            alert("로그인 후 이용해주세요")
            navigate('/memberLogin');
            return;
        }

        setNickname(loginUser.nickname || '');
        setRenickname(loginUser.nickname || '');
        setSavefilename(loginUser.savefilename || '');

        if (loginUser.savefilename) {
            setImgSrc(
                `http://localhost:8070/images/${loginUser.savefilename}`
            );
        }

        setPhone(loginUser.phone || '');
        setZip_num(loginUser.zip_num || '');
        setAddress1(loginUser.address1 || '');
        setAddress2(loginUser.address2 || '');
        setAddress3(loginUser.address3 || '');

    }, [loginUser, navigate]);


    const completeHandler = (data) => {
        setZip_num(data.zonecode);
        setAddress1(data.address);
        setAddress3(data.buildingName || '');
        setIsOpen(false);
    };


    function nicknameCheck() {

        if (!nickname.trim()) {
            alert('닉네임을 입력하세요.');
            return;
        }

        if (nickname === loginUser.nickname) {
            setNicknameCheckResult('※ 현재 사용 중인 닉네임입니다.');
            setNicknameMsgStyle({
                color: 'red',
                fontWeight: 'bold'
            });
            setRenickname(nickname);
            return;
        }

        axios.post('/api/member/nicknameCheck', null, { params: { nickname } })
            .then((result) => {
                if (result.data.msg === 'OK') {
                    setNicknameCheckResult(
                        '※ 사용 가능한 닉네임입니다.'
                    );
                    setNicknameMsgStyle({
                        color: 'blue',
                        fontWeight: 'bold'
                    });

                    setRenickname(nickname);

                } else {

                    setNicknameCheckResult(
                        '※ 중복되는 닉네임입니다.'
                    );

                    setNicknameMsgStyle({
                        color: 'red',
                        fontWeight: 'bold'
                    });

                    setRenickname('');
                }
            })
            .catch((err) => {
                console.error(err);
                alert('닉네임 중복확인 중 오류가 발생했습니다.');
            });
    }

    function fileup(e) {

        const file = e.target.files[0];

        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('이미지 파일만 선택할 수 있습니다.');
            e.target.value = '';
            return;
        }

        const formData = new FormData();
        formData.append('image', file);

        axios.post('/api/member/fileupload', formData)
            .then((result) => {

                setSavefilename(result.data.savefilename);

                setImgSrc(
                    `http://localhost:8070/images/${result.data.savefilename}`
                );

            })
            .catch((err) => {

                console.error(err);

                alert(
                    '프로필 사진 업로드 중 오류가 발생했습니다.'
                );
            });
    }


    function onSubmit() {

        if (!nickname.trim()) {
            alert('닉네임을 입력하세요.');
            return;
        }

        if (renickname !== nickname) {
            alert('닉네임 중복확인을 해주세요.');
            return;
        }
        if (!loginUser.snsid) {

            if (!pwd) {
                return alert('비밀번호를 입력하세요.');
            }

            if (pwd !== pwdChk) {
                return alert('비밀번호 체크가 일치하지 않습니다.');
            }

        }

        if (!phone.trim()) {
            alert('전화번호를 입력하세요.');
            return;
        }

        if (!zip_num) {
            alert('우편번호를 입력하세요.');
            return;
        }

        if (!address1) {
            alert('주소를 입력하세요.');
            return;
        }

        const member = {
            email: loginUser.email,
            nickname: nickname,
            phone: phone,
            zip_num: zip_num,
            address1: address1,
            address2: address2,
            address3: address3,
            savefilename: savefilename
        };

        if (!loginUser.snsid) {
            member.pwd = pwd;
        }

        axios.post('/api/member/updateMember', member)
            .then(() => {
                alert('회원정보가 수정되었습니다.');
                navigate('/');
            })
            .catch((err) => {
                console.error(err);
                alert('회원정보 수정 중 오류가 발생했습니다.');
            });
    }


    return (
        <div className="mypage-wrapper">

            {/* =========================
                제목
            ========================= */}
            <h2 className="mypage-title">
                회원정보 수정
            </h2>


            {/* =========================
                프로필
            ========================= */}
            <div className="mypage-profile-area">

                <div className="mypage-profile-preview">

                    {imgSrc ? (
                        <img
                            src={imgSrc}
                            alt="프로필"
                        />
                    ) : (
                        <span>사진</span>
                    )}

                    <label
                        htmlFor="mypage-profile-image"
                        className="mypage-profile-camera"
                    >
                        📷
                    </label>

                </div>

                <input
                    id="mypage-profile-image"
                    type="file"
                    accept="image/*"
                    onChange={fileup}
                    style={{ display: 'none' }}
                />

            </div>


            {/* =========================
                회원정보
            ========================= */}
            <div className="mypage-form">

                <div className="mypage-box">


                    {/* 닉네임 */}
                    <div className="mypage-row">

                        <label className="mypage-label">
                            닉네임
                        </label>

                        <input
                            className="mypage-input"
                            type="text"
                            value={nickname}
                            onChange={(e) => {
                                setNickname(e.target.value);
                                setRenickname('');
                                setNicknameCheckResult('');
                            }}
                            placeholder="닉네임을 입력하세요."
                        />

                        <button
                            className="mypage-check-btn"
                            onClick={nicknameCheck}
                        >
                            중복확인
                        </button>

                    </div>

                    {/* 닉네임 확인 메시지 */}
                    <div className="mypage-check-message">
                        <span style={nicknameMsgStyle}>
                            {nicknameCheckResult}
                        </span>
                    </div>

                    {/* 비번 */}
                    {/* 일반 회원만 비밀번호 표시 */}
                    {!loginUser.snsid && (
                        <>
                            {/* 비번 */}
                            <div className="mypage-row">

                                <label className="mypage-label">
                                    비밀번호
                                </label>

                                <input
                                    className="mypage-input"
                                    type="password"
                                    value={pwd}
                                    onChange={(e) =>
                                        setPwd(e.target.value)
                                    }
                                    placeholder="비밀번호를 입력하세요"
                                />

                            </div>

                            {/* 비번체크 */}
                            <div className="mypage-row">

                                <label className="mypage-label">
                                    비밀번호 체크
                                </label>

                                <input
                                    className="mypage-input"
                                    type="password"
                                    value={pwdChk}
                                    onChange={(e) =>
                                        setPwdChk(e.target.value)
                                    }
                                    placeholder="비밀번호를 다시 입력하세요"
                                />

                            </div>
                        </>
                    )}
                    {/* 전화번호 */}
                    <div className="mypage-row">

                        <label className="mypage-label">
                            전화번호
                        </label>

                        <input
                            className="mypage-input"
                            type="text"
                            value={phone}
                            onChange={(e) =>
                                setPhone(e.target.value)
                            }
                            placeholder="010-XXXX-XXXX"
                        />

                    </div>


                    {/* 주소 검색 Modal */}
                    <Modal
                        style={{
                            overlay: {
                                backgroundColor:
                                    'rgba(0, 0, 0, 0.5)'
                            },
                            content: {
                                left: '0',
                                right: '0',
                                top: '50%',
                                bottom: 'auto',
                                margin: 'auto',
                                width: '500px',
                                height: '420px',
                                padding: '0',
                                overflow: 'hidden',
                                transform:
                                    'translateY(-50%)'
                            }
                        }}
                        isOpen={isOpen}
                        onRequestClose={() =>
                            setIsOpen(false)
                        }
                    >

                        <DaumPostcode
                            onComplete={completeHandler}
                        />

                        <button
                            onClick={() =>
                                setIsOpen(false)
                            }
                        >
                            CLOSE
                        </button>

                    </Modal>


                    {/* 우편번호 */}
                    <div className="mypage-row">

                        <label className="mypage-label">
                            우편번호
                        </label>

                        <input
                            className="mypage-input"
                            type="text"
                            value={loginUser.zip_num}
                            readOnly
                        />

                        <button
                            className="mypage-check-btn"
                            onClick={() =>
                                setIsOpen(true)
                            }
                        >
                            우편번호검색
                        </button>

                    </div>


                    {/* 주소1 */}
                    <div className="mypage-row">

                        <label className="mypage-label">
                            주소1
                        </label>

                        <input
                            className="mypage-input"
                            type="text"
                            value={loginUser.address1}
                            readOnly
                        />

                    </div>


                    {/* 주소2 */}
                    <div className="mypage-row">

                        <label className="mypage-label">
                            주소2
                        </label>

                        <input
                            className="mypage-input"
                            type="text"
                            value={loginUser.address2}
                            onChange={(e) =>
                                setAddress2(e.target.value)
                            }
                            placeholder="상세주소를 입력하세요."
                        />

                    </div>


                    {/* 주소3 */}
                    <div className="mypage-row">

                        <label className="mypage-label">
                            주소3
                        </label>

                        <input
                            className="mypage-input"
                            type="text"
                            value={loginUser.address3}
                            readOnly
                        />

                    </div>

                </div>

            </div>


            {/* =========================
                안내
            ========================= */}
            {/* <div className="mypage-msg">
                ※ 프로필 사진과 닉네임, 연락처 및 주소를 수정할 수 있습니다.
            </div> */}


            {/* =========================
                버튼
            ========================= */}
            <div className="mypage-btn-group">

                <button
                    className="mypage-btn-save"
                    onClick={onSubmit}
                >
                    수정하기
                </button>

                <button
                    className="mypage-btn-cancel"
                    onClick={() => navigate('/')}
                >
                    취소
                </button>

            </div>

        </div>
    );
}

export default MyPage;