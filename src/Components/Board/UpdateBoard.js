import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './UpdateBoard.css';

function UpdateBoard() {

    const navigate = useNavigate();
    const { boardnum } = useParams();

    // 게시글
    const [post, setPost] = useState(null);

    // 수정할 제목 / 내용
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    // 게시글 조회
    useEffect(() => {

        axios.get(`/api/board/getBoard/${boardnum}`)
            .then((result) => {

                const board = result.data.board;

                setPost(board);
                setTitle(board.title || '');
                setContent(board.content || '');

            })
            .catch((err) => {

                console.error('게시글 조회 실패:', err);
                alert('게시글을 불러오지 못했습니다.');
                navigate('/boardList');

            });

    }, [boardnum, navigate]);


    // 취소
    const handleCancel = () => {
        navigate(`/boardView/${boardnum}`);
    };


    // 수정
    const handleSubmit = (e) => {

        e.preventDefault();

        // 제목 검사
        if (!title.trim()) {
            alert('제목을 입력해주세요.');
            return;
        }

        // 내용 검사
        if (!content.trim()) {
            alert('내용을 입력해주세요.');
            return;
        }

        const boardData = {
            boardnum: Number(boardnum),
            email: post.email,
            title: title,
            content: content
        };

        axios.post('/api/board/updateBoard', boardData)
            .then(() => {

                alert('게시글이 수정되었습니다.');

                navigate(`/boardView/${boardnum}`);

            })
            .catch((err) => {

                console.error('게시글 수정 실패:', err);
                alert('게시글 수정에 실패했습니다.');

            });
    };


    // 로딩
    if (!post) {
        return (
            <div className="update-board-page">
                <div className="update-board-loading">
                    게시글을 불러오는 중입니다...
                </div>
            </div>
        );
    }


    return (
        <div className="update-board-page">

            {/* 페이지 헤더 */}
            <div className="update-board-header">

                <h1>게시글 수정</h1>

                <p>
                    작성한 고민 게시글을 수정해주세요.
                </p>

            </div>


            {/* 수정 폼 */}
            <form
                className="update-board-container"
                onSubmit={handleSubmit}
            >

                {/* 제목 */}
                <div className="update-board-field">

                    <label htmlFor="update-title">
                        제목
                    </label>

                    <input
                        id="update-title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="제목을 입력해주세요."
                        maxLength={200}
                    />

                    <div className="update-board-count">
                        {title.length} / 200
                    </div>

                </div>


                {/* 내용 */}
                <div className="update-board-field content-field">

                    <label htmlFor="update-content">
                        내용
                    </label>

                    <textarea
                        id="update-content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="내용을 입력해주세요."
                    />

                    <div className="update-board-count">
                        {content.length}자
                    </div>

                </div>


                {/* 버튼 */}
                <div className="update-board-buttons">

                    <button
                        type="button"
                        className="update-board-cancel-btn"
                        onClick={handleCancel}
                    >
                        취소
                    </button>

                    <button
                        type="submit"
                        className="update-board-submit-btn"
                    >
                        수정 완료
                    </button>

                </div>

            </form>

        </div>
    );
}

export default UpdateBoard;
