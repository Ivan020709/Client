import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import jaxios from '../../utils/jwtUtil';

import './NoticeWrite.css';

function NoticeWrite() {

    const navigate = useNavigate();

    const loginUser = useSelector(state => state.user);

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isFixed, setIsFixed] = useState(false);

    // // 관리자 여부
    // const isAdmin =
    //     loginUser?.role === 'admin' &&
    //     loginUser?.email === 'admin' &&
    //     loginUser?.name === 'admin' &&
    //     loginUser?.nickname === 'admin';


    // // 관리자 확인
    // if (!isAdmin) {
    //     return (
    //         <div className="notice-write-page">

    //             <div className="notice-write-container notice-no-access">

    //                 <h2>접근할 수 없습니다.</h2>

    //                 <p>
    //                     관리자만 공지사항을 작성할 수 있습니다.
    //                 </p>

    //                 <button
    //                     type="button"
    //                     onClick={() => navigate('/noticeList')}
    //                 >
    //                     공지사항으로 돌아가기
    //                 </button>

    //             </div>

    //         </div>
    //     );
    // }


    // 취소
    const handleCancel = () => {
        navigate('/noticeList');
    };


    const handleSubmit = async (e) => {

    e.preventDefault();

    if (!title.trim()) {
        alert('제목을 입력해주세요.');
        return;
    }

    if (!content.trim()) {
        alert('내용을 입력해주세요.');
        return;
    }

    try {

        const noticeData = {
            title: title,
            content: content,
            fixed: isFixed ? 'Y' : 'N'
        };

        await jaxios.post(
            '/api/notice/insertNotice',
            noticeData
        );

        alert('공지사항이 등록되었습니다.');

        navigate('/noticeList');

    } catch (err) {

        console.error('공지사항 등록 실패:', err);

        if (err.response && err.response.data) {
            alert(err.response.data);
        } else {
            alert('공지사항 등록에 실패했습니다.');
        }
    }
};


    return (

        <div className="notice-write-page">

            {/* 페이지 헤더 */}
            <div className="notice-write-header">

                <h1>공지사항 작성</h1>

                <p>
                    서비스의 새로운 소식과 중요한 안내사항을 작성해주세요.
                </p>

            </div>


            {/* 작성 영역 */}
            <form
                className="notice-write-container"
                onSubmit={handleSubmit}
            >

                {/* 고정 여부 */}
                <div className="notice-write-option">

                    <div className="notice-fixed-info">

                        <div className="notice-fixed-title">
                            상단 고정
                        </div>

                        <div className="notice-fixed-description">
                            중요한 공지사항을 게시판 상단에 고정합니다.
                        </div>

                    </div>


                    <label className="notice-fixed-toggle">

                        <input
                            type="checkbox"
                            checked={isFixed}
                            onChange={(e) =>
                                setIsFixed(e.target.checked)
                            }
                        />

                        <span className="notice-toggle"></span>

                        <span className="notice-toggle-text">
                            {isFixed ? '고정' : '일반'}
                        </span>

                    </label>

                </div>


                {/* 제목 */}
                <div className="notice-write-field">

                    <label htmlFor="notice-title">
                        제목
                    </label>

                    <input
                        id="notice-title"
                        type="text"
                        value={title}
                        onChange={(e) =>
                            setTitle(e.target.value)
                        }
                        placeholder="공지사항 제목을 입력해주세요."
                        maxLength={200}
                    />

                    <div className="notice-write-count">
                        {title.length} / 200
                    </div>

                </div>


                {/* 내용 */}
                <div className="notice-write-field notice-content-field">

                    <label htmlFor="notice-content">
                        내용
                    </label>

                    <textarea
                        id="notice-content"
                        value={content}
                        onChange={(e) =>
                            setContent(e.target.value)
                        }
                        placeholder="공지사항 내용을 입력해주세요."
                    />

                    <div className="notice-write-count">
                        {content.length}자
                    </div>

                </div>


                {/* 버튼 */}
                <div className="notice-write-buttons">

                    <button
                        type="submit"
                        className="notice-submit-btn"
                    >
                        공지 등록
                    </button>
                    <button
                        type="button"
                        className="notice-cancel-btn"
                        onClick={handleCancel}
                    >
                        취소
                    </button>



                </div>

            </form>

        </div>
    );
}

export default NoticeWrite;
