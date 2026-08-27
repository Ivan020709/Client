import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import jaxios from '../../utils/jwtUtil';

import './UpdateInquiry.css';

function UpdateInquiry() {

    const navigate = useNavigate();
    const { inquirynum } = useParams();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');


    /* =========================================================
       기존 문의 내용 불러오기
    ========================================================= */

    useEffect(() => {

        jaxios.get(`/api/inquiry/getInquiry/${inquirynum}`)
            .then((result) => {

                const inquiry = result.data.inquiry;

                setTitle(inquiry.title || '');
                setContent(inquiry.content || '');

            })
            .catch((err) => {

                console.error(err);

                alert('문의 내용을 불러오지 못했습니다.');

                navigate('/InquiryList');

            });

    }, [inquirynum, navigate]);


    /* =========================================================
       문의 수정
    ========================================================= */

    const handleUpdate = (e) => {

        e.preventDefault();

        if (!title.trim()) {
            alert('제목을 입력하세요.');
            return;
        }

        if (!content.trim()) {
            alert('문의 내용을 입력하세요.');
            return;
        }


        jaxios.post('/api/inquiry/updateInquiry', {
            inquirynum,
            title,
            content
        })
            .then(() => {

                alert('문의가 수정되었습니다.');

                navigate(`/InquiryView/${inquirynum}`);

            })
            .catch((err) => {

                console.error(err);

                alert('문의 수정에 실패했습니다.');

            });

    };


    return (

        <div className="update-inquiry-page">

            {/* =================================================
                제목
            ================================================= */}

            <div className="update-inquiry-header">

                <h1 className="update-inquiry-heading">
                    문의 수정
                </h1>

                <p className="update-inquiry-description">
                    문의 내용을 수정해주세요.
                </p>

            </div>


            {/* =================================================
                수정 폼
            ================================================= */}

            <form
                className="update-inquiry-form"
                onSubmit={handleUpdate}
            >

                {/* 제목 */}

                <div className="update-inquiry-field">

                    <label
                        htmlFor="update-inquiry-title"
                        className="update-inquiry-label"
                    >
                        제목
                    </label>

                    <input
                        id="update-inquiry-title"
                        type="text"
                        className="update-inquiry-title-input"
                        value={title}
                        onChange={(e) =>
                            setTitle(e.target.value)
                        }
                        placeholder="제목을 입력하세요"
                        maxLength={100}
                        required
                    />

                </div>


                {/* 내용 */}

                <div className="update-inquiry-field">

                    <label
                        htmlFor="update-inquiry-content"
                        className="update-inquiry-label"
                    >
                        문의 내용
                    </label>

                    <textarea
                        id="update-inquiry-content"
                        className="update-inquiry-content-input"
                        value={content}
                        onChange={(e) =>
                            setContent(e.target.value)
                        }
                        placeholder="문의 내용을 입력하세요"
                        required
                    />

                </div>


                {/* =================================================
                    버튼
                ================================================= */}

                <div className="update-inquiry-actions">

                    <button
                        type="button"
                        className="update-inquiry-cancel-btn"
                        onClick={() =>
                            navigate(`/InquiryView/${inquirynum}`)
                        }
                    >
                        취소
                    </button>

                    <button
                        type="submit"
                        className="update-inquiry-submit-btn"
                    >
                        수정 완료
                    </button>

                </div>

            </form>

        </div>

    );
}

export default UpdateInquiry;
