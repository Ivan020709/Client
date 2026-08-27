import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import jaxios from '../../utils/jwtUtil';

import './NoticeView.css';

function NoticeView() {

    const navigate = useNavigate();
    const { noticenum } = useParams();

    // 현재 로그인한 사용자
    const loginUser = useSelector(state => state.user);

    // 공지사항
    const [notice, setNotice] = useState(null);


    // 관리자 여부
    const isAdmin =
        loginUser?.role === 'admin' &&
        loginUser?.email === 'admin' &&
        loginUser?.name === 'admin' &&
        loginUser?.nickname === 'admin';


    // 공지사항 조회
    useEffect(() => {

        axios.get(`/api/notice/getNotice/${noticenum}`)
            .then((result) => {

                setNotice(result.data.notice);

            })
            .catch((err) => {

                console.error('공지사항 조회 실패:', err);

                alert('공지사항을 불러오지 못했습니다.');

                navigate('/noticeList');

            });

    }, [noticenum, navigate]);


    // 목록
    const handleList = () => {
        navigate('/noticeList');
    };


    // 수정
    const handleUpdate = () => {

        if (!isAdmin) {
            alert('관리자만 공지사항을 수정할 수 있습니다.');
            return;
        }

        navigate(`/updateNotice/${noticenum}`);
    };


    // 삭제
    const handleDelete = () => {

        if (!isAdmin) {
            alert('관리자만 공지사항을 삭제할 수 있습니다.');
            return;
        }


        if (!window.confirm('공지사항을 삭제하시겠습니까?')) {
            return;
        }


        jaxios.delete(`/api/notice/deleteNotice/${noticenum}`)
            .then(() => {

                alert('공지사항이 삭제되었습니다.');

                navigate('/noticeList');

            })
            .catch((err) => {

                console.error(
                    '공지사항 삭제 실패:',
                    err
                );

                alert('공지사항 삭제에 실패했습니다.');

            });
    };


    // 게시글 로딩 전
    if (!notice) {

        return (
            <div className="notice-view-page">

                <div className="notice-view-container">

                    <div className="notice-loading">
                        공지사항을 불러오는 중입니다...
                    </div>

                </div>

            </div>
        );
    }


    // 고정 공지 여부
    const isFixed = notice.fixed === 'Y';


    return (

        <div className="notice-view-page">

            {/* 상단 */}
            <div className="notice-view-header">

                <button
                    className="notice-back-btn"
                    onClick={handleList}
                >
                    ←
                </button>

                <h1>공지사항</h1>

            </div>


            <div className="notice-view-container">

                {/* 공지사항 */}
                <div
                    className={`notice-view-post ${isFixed ? 'notice-view-fixed' : ''
                        }`}
                >

                    {/* 고정 공지 표시 */}
                    {isFixed && (

                        <div className="notice-view-fixed-badge">
                            📢 중요 공지
                        </div>

                    )}


                    {/* 제목 */}
                    <h2 className="notice-view-title">
                        {notice.title}
                    </h2>


                    {/* 공지 정보 */}
                    <div className="notice-view-info">

                        <span>
                            작성일{' '}
                            <strong>
                                {notice.indate
                                    ? notice.indate.substring(0, 10)
                                    : ''}
                            </strong>
                        </span>

                        <span>
                            조회 <strong>{notice.viewcount}</strong>
                        </span>

                    </div>


                    {/* 내용 */}
                    <div className="notice-view-content">
                        {notice.content}
                    </div>


                    {/* 버튼 */}
                    <div className="notice-view-buttons">

                        {/* 목록 */}
                        <button
                            className="notice-list-btn"
                            onClick={handleList}
                        >
                            목록
                        </button>


                        {/* 관리자만 표시 */}
                        {isAdmin && (

                            <div className="notice-admin-buttons">

                                <button
                                    className="notice-update-btn"
                                    onClick={handleUpdate}
                                >
                                    수정
                                </button>

                                <button
                                    className="notice-delete-btn"
                                    onClick={handleDelete}
                                >
                                    삭제
                                </button>

                            </div>

                        )}

                    </div>

                </div>

            </div>

        </div>
    );
}

export default NoticeView;
