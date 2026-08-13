import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DaumPostcode from 'react-daum-postcode';
//import Modal from 'react-modal';
import { useSelector } from 'react-redux';
import '../../style/member/Join.css';

function Join() {
    const loginUser = useSelector(state => state.user);

    // 회원정보
    const [userid, setUserid] = useState('');
    const [reid, setReid] = useState('');
    const [idCheckResult, setIdCheckResult] = useState('');
    const [msgStyle, setMsgStyle] = useState({ flex: '1' });

    const [pwd, setPwd] = useState('');
    const [pwdChk, setPwdChk] = useState('');

    const [name, setName] = useState('');

    // 생년월일
    const [year, setYear] = useState('');
    const [month, setMonth] = useState('');
    const [day, setDay] = useState('');

    const [phone, setPhone] = useState('');

    // 주소
    const [zip_num, setZip_num] = useState('');
    const [add1, setAdd1] = useState('');
    const [add2, setAdd2] = useState('');
    const [add3, setAdd3] = useState('');

    // 주소 검색 모달
    const [isOpen, setIsOpen] = useState(false);

    const navigate = useNavigate();

    // 주소 검색 모달 스타일
    const modalStyle = {
        overlay: {backgroundColor: 'rgba(0, 0, 0, 0.5)',},
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
            transform: 'translateY(-50%)',
        },
    };

    // 로그인 상태라면 회원가입 페이지 접근 방지
    useEffect(() => {
        if (loginUser && loginUser.userid) {
            navigate('/');
        }
    }, [loginUser, navigate]);

    // 다음 주소검색 완료
    const completeHandler = (data) => {
        setZip_num(data.zonecode);
        setAdd1(data.address);
        setAdd3(data.buildingName);

        setIsOpen(false);
    };

    // 아이디 중복 확인
    function idCheck() {
        if (!userid) {return alert('아이디를 입력하세요.');}
        axios.post('/api/member/idCheck', null, { params:{userid: userid,},})
            .then((result) => {
                if (result.data.msg === 'OK') {
                    setIdCheckResult('※ 사용 가능한 아이디입니다.');
                    setMsgStyle({color: 'blue',flex: '1',fontWeight: 'bold',});
                    // 중복확인한 아이디 저장
                    setReid(userid);
                } else {
                    setIdCheckResult('※ 중복되는 아이디입니다.');
                    setMsgStyle({color: 'red',flex: '1',fontWeight: 'bold',});
                    setReid('');
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }
    // 회원가입
    function onSubmit() {
        // 아이디
        if (!userid) {return alert('아이디를 입력하세요.');}
        // 아이디 중복확인
        if (reid !== userid) {return alert('아이디 중복을 확인해주세요.');}
        // 비밀번호
        if (!pwd) {return alert('비밀번호를 입력하세요.');}
        // 비밀번호 확인
        if (pwd !== pwdChk) {return alert('비밀번호 체크가 일치하지 않습니다.');}
        // 이름
        if (!name) {return alert('이름을 입력하세요.');}
        // 생년월일
        if (!year || !month || !day) {return alert('생년월일을 입력하세요.');}
        // 생년월일 숫자 및 범위 확인
        if (
            isNaN(year) ||
            isNaN(month) ||
            isNaN(day) ||
            Number(year) < 1901 ||
            Number(year) > 2026 ||
            Number(month) < 1 ||
            Number(month) > 12 ||
            Number(day) < 1 ||
            Number(day) > 31
        ) {
            return alert('올바른 생년월일을 입력하세요.');
        }
        // 실제 존재하는 날짜인지 확인
        const date = new Date(
            Number(year),
            Number(month) - 1,
            Number(day)
        );
        if (
            date.getFullYear() !== Number(year) ||
            date.getMonth() !== Number(month) - 1 ||
            date.getDate() !== Number(day)
        ) {
            return alert('존재하지 않는 날짜입니다.');
        }
        // 전화번호
        if (!phone) {return alert('번호를 입력하세요.');}
        // 주소
        if (!zip_num) {return alert('우편번호를 입력하세요.');}
        if (!add1) {return alert('주소를 입력하세요.');}
        // 생년월일 조합
        const birth =`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        // 서버에 회원가입 요청
        axios.post('/api/member/insertMember', {
                userid: userid,
                pwd: pwd,
                name: name,
                birth: birth,
                phone: phone,
                zip_num: zip_num,
                add1: add1,
                add2: add2,
                add3: add3,
                provider: 'LOCAL',
            })
            .then((result) => {
                alert('회원 가입이 완료되었습니다.');
                navigate('/memberLogin');
            })
            .catch((err) => {
                console.error(err);
                alert('회원가입 중 오류가 발생했습니다.');
            });
    }
    return (
        <div className="join-wrapper">
            <h2 className="join-title">회원 가입</h2>
            <div className="join-form">
                <div className="join-box">
                    {/* 아이디 */}
                    <div className="join-row">
                        <label className="join-label">아이디</label>
                        <input className="join-input-id"type="text"value={userid}onChange={(e) => {setUserid(e.currentTarget.value);
                        setReid('');
                        setIdCheckResult('');}}
                            placeholder="이메일 형식(예: abc@abc.com)"
                        />
                        <button className="join-btn-zip_num" onClick={idCheck}>중복확인</button>
                    </div>
                    {/* 아이디 중복확인 결과 */}
                    <div>
                        <label style={msgStyle}>{idCheckResult}</label>
                    </div>
                    {/* 비밀번호 */}
                    <div className="join-row">
                        <label className="join-label">비밀번호</label>
                        <input className="join-input-etc"type="password"value={pwd}onChange={(e) =>{setPwd(e.currentTarget.value);}}
                            placeholder="비밀번호를 입력하세요."
                        />
                    </div>
                    {/* 비밀번호 확인 */}
                    <div className="join-row">
                        <label className="join-label">비밀번호 체크</label>
                        <input className="join-input-etc"type="password"value={pwdChk}onChange={(e) => {setPwdChk(e.currentTarget.value);}}
                            placeholder="비밀번호를 다시 입력하세요."
                        />
                    </div>
                    {/* 이름 */}
                    <div className="join-row">
                        <label className="join-label">이름</label>
                        <input className="join-input-etc"type="text" value={name}onChange={(e) =>{setName(e.currentTarget.value);
                            }}
                            placeholder="이름을 입력하세요."
                        />
                    </div>
                    {/* 생년월일 */}
                    <div className="join-row">
                        <label className="join-label">생년월일</label>
                        <input className="join-input-four"type="text"placeholder="YYYY"maxLength="4"value={year}onChange={(e) => {setYear(e.currentTarget.value); }}/>
                        <label className="join-label-birth">년</label>
                        &nbsp;&nbsp;
                        <input className="join-input-two"type="text"placeholder="MM"maxLength="2"value={month}
                            onChange={(e) => {setMonth(e.currentTarget.value);}}/>
                        <label className="join-label-birth">월</label>
                        &nbsp;&nbsp;
                        <input className="join-input-two"type="text"placeholder="DD"maxLength="2"value={day}
                            onChange={(e) => {setDay(e.currentTarget.value);}}/>
                        <label className="join-label-birth">일</label>
                    </div>
                    {/* 전화번호 */}
                    <div className="join-row">
                        <label className="join-label">전화번호</label>
                        <input className="join-input-etc"type="text"value={phone}
                            onChange={(e) => {setPhone(e.currentTarget.value);}}
                            placeholder="010-XXXX-XXXX"
                        />
                    </div>
                    {/* 주소 검색 모달 */}
{/*                     <Modal style={modalStyle}isOpen={isOpen}onRequestClose={() => setIsOpen(false)}>
                        <DaumPostcode onComplete={completeHandler}/>
                        <button onClick={() => {setIsOpen(false);}}>CLOSE</button>
                    </Modal> */}
                    {/* 우편번호 */}
                    <div className="join-field">
                        <div className="join-row">
                            <label className="join-label">우편번호</label>
                            <input className="join-input" type="text"value={zip_num}readOnly/>
                            <button className="join-btn-zip_num"onClick={() =>{setIsOpen(true);}}>우편번호검색</button>
                        </div>
                    </div>
                    {/* 주소1 */}
                    <div className="join-field">
                        <div className="join-row">
                            <label className="join-label">주소1</label>
                            <input className="join-input-etc"type="text"value={add1}readOnly/>
                        </div>
                    </div>
                    {/* 주소2 */}
                    <div className="join-field">
                        <div className="join-row">
                            <label className="join-label">주소2</label>
                            <input className="join-input-etc"type="text"value={add2}onChange={(e) =>{setAdd2(e.currentTarget.value);}}placeholder="상세주소를 입력하세요."/>
                        </div>
                    </div>
                    {/* 주소3 */}
                    <div className="join-field">
                        <div className="join-row">
                            <label className="join-label">주소3</label>
                            <input className="join-input-etc"type="text"value={add3}readOnly/>
                        </div>
                    </div>
                </div>
            </div>
            {/* 안내 문구 */}
            <div className="join_msg"> ※ 가입 후 아이디 변경 불가 </div>
            {/* 가입 버튼 */}
            <div>
                <button className="join-btn-join"onClick={onSubmit}>확인</button>
            </div>
            <hr />
        </div>
    );
}

export default Join;