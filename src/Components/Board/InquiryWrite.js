import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

import './InquiryWrite.css';

function InquiryWrite() {

    const navigate = useNavigate();
    const loginUser = useSelector(state => state.user);

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');


    const handleSubmit = (e) => {

        e.preventDefault();

        axios.post('/api/inquiry/insertInquiry', {
            title,
            content,
            userid: loginUser.userid
        })
            .then(() => {

                alert('문의가 등록되었습니다.');

                navigate('/InquiryList');

            })
            .catch((err) => {

                console.error(err);

                alert('등록에 실패했습니다.');

            });
    };


    return (

        <div className="inquiry-write-page">

            {/* =========================
                상단 제목
            ========================= */}

            <div className="inquiry-write-header">

                <h1 className="inquiry-write-heading">
                    문의하기
                </h1>

            </div>


            {/* =========================
                문의 작성
            ========================= */}

            <form
                className="inquiry-write-form"
                onSubmit={handleSubmit}
            >

                {/* 제목 */}

                <div className="inquiry-write-title-area">

                    <label
                        htmlFor="inquiry-write-title"
                        className="inquiry-write-label"
                    >
                        제목
                    </label>

                    <input
                        id="inquiry-write-title"
                        type="text"
                        className="inquiry-write-title-input"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="제목을 입력하세요"
                        required
                    />

                </div>


                {/* 내용 */}

                <div className="inquiry-write-content-area">

                    <label
                        htmlFor="inquiry-write-content"
                        className="inquiry-write-label"
                    >
                        문의 내용
                    </label>

                    <textarea
                        id="inquiry-write-content"
                        className="inquiry-write-content-input"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="문의 내용을 입력하세요"
                        required
                    />

                </div>


                {/* =========================
                    버튼
                ========================= */}

                <div className="inquiry-write-actions">

                    <button
                        type="button"
                        className="inquiry-write-list-btn"
                        onClick={() => navigate('/InquiryList')}
                    >
                        목록으로
                    </button>

                    <button
                        type="submit"
                        className="inquiry-write-submit-btn"
                    >
                        등록하기
                    </button>

                </div>

            </form>

        </div>

    );
}

export default InquiryWrite;
