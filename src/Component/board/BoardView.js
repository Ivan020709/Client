import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import '../../style/board/BoardView.css';

function BoardView() {

    const navigate = useNavigate();
    const { boardnum } = useParams();

    // 현재 로그인한 사용자
    const loginUser = useSelector(state => state.user);

    // 게시글
    const [post, setPost] = useState(null);

    // 댓글
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');

    // 게시글 조회
    useEffect(() => {

        axios.get(`/api/board/getBoard/${boardnum}`)
            .then((result) => {
                // console.log('게시글 조회:', result.data);

                setPost(result.data.board);
            })
            .catch((err) => {
                // console.error('게시글 조회 실패:', err);
                // alert('게시글을 불러오지 못했습니다.');
                navigate('/boardList');
            });

    }, [boardnum, navigate]);


    // 목록
    const handleList = () => {
        navigate('/boardList');
    };


    // 수정
    const handleUpdate = () => {
        navigate(`/updateBoard/${boardnum}`);
    };


    // 삭제
    const handleDelete = () => {

        if (!window.confirm('게시글을 삭제하시겠습니까?')) {
            return;
        }

        axios.delete(`/api/board/deleteBoard/${boardnum}`)
            .then(() => {
                alert('게시글이 삭제되었습니다.');
                navigate('/boardList');
            })
            .catch((err) => {
                console.error('게시글 삭제 실패:', err);
                // alert('게시글 삭제에 실패했습니다.');
            });
    };


    // 댓글 등록
    const handleCommentSubmit = (e) => {

        e.preventDefault();

        if (!comment.trim()) {
            alert('댓글을 입력해주세요.');
            return;
        }

        // 댓글 API 연결 예정
        console.log('댓글 등록:', {
            boardnum: boardnum,
            content: comment
        });

        setComment('');
    };


    // 게시글 로딩 전
    if (!post) {
        return (
            <div className="board-view-page">
                <div className="board-view-container">
                    <div className="board-loading">
                        게시글을 불러오는 중입니다...
                    </div>
                </div>
            </div>
        );
    }


    // 현재 로그인한 사용자가 게시글 작성자인지 확인
    const isWriter =
        loginUser &&
        Number(loginUser.userid) === Number(post.userid);


    return (
        <div className="board-view-page">

            {/* 상단 */}
            <div className="board-view-header">

                <button
                    className="board-back-btn"
                    onClick={handleList}
                >
                    ←
                </button>

                <h1>고민 게시판</h1>

            </div>


            <div className="board-view-container">

                {/* 게시글 */}
                <div className="board-view-post">

                    {/* 카테고리 */}
                    {post.category && (
                        <div className="board-view-category">
                            {post.category}
                        </div>
                    )}


                    {/* 제목 */}
                    <h2 className="board-view-title">
                        {post.title}
                    </h2>


                    {/* 작성자 정보 */}
                    <div className="board-view-info">

                        <span>
                            작성자 <strong>{post.userid}</strong>
                        </span>

                        <span>
                            작성일{' '}
                            {post.indate
                                ? post.indate.substring(0, 10)
                                : ''}
                        </span>

                        <span>
                            조회 {post.viewcount}
                        </span>

                    </div>


                    {/* 내용 */}
                    <div className="board-view-content">
                        {post.content}
                    </div>


                    {/* 게시글 버튼 */}
                    <div className="board-view-buttons">

                        <button
                            className="board-list-btn"
                            onClick={handleList}
                        >
                            목록
                        </button>


                        {/* 작성자 본인에게만 표시 */}
                        {isWriter && (
                            <div className="board-owner-buttons">

                                <button
                                    className="board-update-btn"
                                    onClick={handleUpdate}
                                >
                                    수정
                                </button>

                                <button
                                    className="board-delete-btn"
                                    onClick={handleDelete}
                                >
                                    삭제
                                </button>

                            </div>
                        )}

                    </div>

                </div>


                {/* 댓글 */}
                <div className="board-comment-section">

                    <div className="board-comment-title">
                        댓글 <strong>{comments.length}</strong>
                    </div>


                    {/* 댓글 목록 */}
                    <div className="board-comment-list">

                        {comments.length > 0 ? (

                            comments.map((item) => (

                                <div
                                    className="board-comment"
                                    key={item.id}
                                >

                                    <div className="board-comment-info">

                                        <strong>
                                            {item.user_id}
                                        </strong>

                                        <span>
                                            {item.created_at}
                                        </span>

                                    </div>

                                    <div className="board-comment-content">
                                        {item.content}
                                    </div>

                                </div>

                            ))

                        ) : (

                            <div className="board-no-comment">
                                아직 댓글이 없습니다.
                            </div>

                        )}

                    </div>


                    {/* 댓글 작성 */}
                    <form
                        className="board-comment-form"
                        onSubmit={handleCommentSubmit}
                    >

                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="댓글을 입력해주세요."
                        />

                        <button type="submit">
                            댓글 등록
                        </button>

                    </form>

                </div>

            </div>

        </div>
    );
}

export default BoardView;