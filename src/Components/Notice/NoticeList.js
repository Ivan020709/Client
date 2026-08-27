import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import jaxios from '../../utils/jwtUtil';

import './NoticeList.css';

function NoticeList() {

    const navigate = useNavigate();

    // Redux 로그인 정보
    const loginUser = useSelector(state => state.user);

    // 게시글 목록
    const [noticeList, setNoticeList] = useState([]);
    const [paging, setPaging] = useState({})
    const [pages, setPages] = useState([])
    const [key, setKey] = useState('')
    const [isAdmin, setIsAdmin] = useState(false);

    const [searchType, setSearchType] = useState('title');

    const ROWS_PER_PAGE = 10;

    useEffect(
        () => {
            axios.get('/api/notice/getNoticeList', { params: { page: 1, key, searchType } })
                .then((result) => {
                    setNoticeList([...result.data.noticeList])
                    setPaging(result.data.paging)
                    let arr = [];
                    for (let i = result.data.paging.beginPage; i <= result.data.paging.endPage; i++) {
                        arr.push(i);
                    }
                    setPages([...arr])
                })
                .catch((err) => { console.error(err) })
        }, []
    )

    function onPageMove(p) {

        axios.get('/api/notice/getNoticeList', {
            params: {
                page: p,
                key,
                searchType
            }
        })
            .then((result) => {

                setNoticeList([...result.data.noticeList]);
                setPaging(result.data.paging);

                let arr = [];

                for (
                    let i = result.data.paging.beginPage;
                    i <= result.data.paging.endPage;
                    i++
                ) {
                    arr.push(i);
                }

                setPages([...arr]);
            })
            .catch((err) => {
                console.error(err);
            });
    }

    // useEffect(() => {
    //     onPageMove(1);
    // }, []);

    // 관리자 여부
    useEffect(() => {

        // 로그인하지 않은 사용자는 관리자 조회 요청을 보내지 않는다.
        if (!loginUser?.email) {
            setIsAdmin(false);
            return;
        }

        jaxios.get('/api/admin/getAdmin', {
            params: {
                email: loginUser.email
            }
        })
            .then((result) => {

                console.log('관리자 권한:', result.data.role);

                if (result.data.role === 'ADMIN') {
                    setIsAdmin(true);
                } else {
                    setIsAdmin(false);
                }

            })
            .catch((err) => {
                console.error('role 조회 실패:', err);
                setIsAdmin(false);
            });

    }, [loginUser?.email]);

    // 페이지가 변경될 때마다 공지사항 조회
    // useEffect(() => {
    //     getNoticeList(page);
    // }, [page]);

    // 공지사항 목록 조회
    // const getNoticeList = (page) => {

    //     axios.get(`/api/notice/getNoticeList/${page}`)
    //         .then((result) => {

    //             setPosts(result.data.noticeList);
    //             setPaging(result.data.paging);

    //         })
    //         .catch((err) => {
    //             console.error('공지사항 목록 조회 실패:', err);
    //         });
    // };

    //검색
    const handleSearch = (e) => {

        e.preventDefault();

        if (!key.trim()) {
            return;
        }
        console.log(searchType, key);
    };

    //공지사항 작성
    const handleWrite = () => {
        if (!loginUser?.userid) {
            alert('로그인이 필요합니다.');
            navigate('/memberLogin');
            return;
        }

        if (!isAdmin) {
            alert('관리자만 공지사항을 작성할 수 있습니다.');
            return;
        }

        navigate('/noticeWrite');
    };

    //게시글 클릭
    const handlePostClick = (boardnum) => {

        axios.post('/api/notice/plusCount', null, {
            params: { boardnum }
        })
            .then(() => {
                navigate(`/noticeView/${boardnum}`);
            })
            .catch((err) => {
                console.error(err);
            });
    };

    // 전체 페이지 수
    const totalPages = Math.ceil(
        (paging?.totalCount ?? 0) / ROWS_PER_PAGE
    );

    // 페이지 이동
    const handlePage = (pageNumber) => {

        if (pageNumber < 1 || pageNumber > totalPages) {
            return;
        }

        setPages(pageNumber);
    };

    return (
        <div className="notice-list-page">

            {/* 페이지 헤더 */}
            <div className="notice-header">

                <div>
                    <h1>공지사항</h1>
                    <p>
                        서비스의 새로운 소식과 중요한 안내사항을 확인해주세요.
                    </p>
                </div>

            </div>


            {/* 게시글 영역 */}
            <div className="notice-container">

                {/* 게시글 수 / 글쓰기 */}
                <div className="notice-top">

                    <span>
                        전체 공지사항
                        <strong>
                            {paging?.totalCount ?? 0}
                        </strong>
                    </span>

                    {/* 관리자만 공지 작성 가능 */}
                    {isAdmin && (
                        <button
                            className="notice-write-btn"
                            onClick={handleWrite}
                        >
                            공지 작성
                        </button>
                    )}

                </div>


                {/* 공지사항 목록 */}
                <div className="notice-table">

                    {/* 테이블 헤더 */}
                    <div className="notice-table-header">

                        {/* 고정 표시 공간 */}
                        <div className="notice-fixed-space"></div>

                        <div className="notice-number">
                            번호
                        </div>

                        <div className="notice-title">
                            제목
                        </div>

                        <div className="notice-date">
                            작성일
                        </div>

                        <div className="notice-view">
                            조회
                        </div>

                    </div>


                    {/* 게시글 */}
                    {noticeList.length > 0 ? (

                        noticeList.map((notice, index) => (

                            <div
                                className={`notice-row ${notice.fixed === 'Y'
                                    ? 'notice-fixed'
                                    : ''
                                    }`}
                                key={notice.noticenum}
                                onClick={() =>
                                    handlePostClick(notice.noticenum)
                                }
                            >

                                {/* 번호 */}
                                <div className="notice-number">
                                    {notice.fixed === 'Y' ? (
                                        <span className="notice-pin">📌</span>
                                    ) : (
                                        paging.totalCount -
                                        (
                                            (pages - 1) *
                                            ROWS_PER_PAGE +
                                            index
                                        )
                                    )}
                                </div>


                                {/* 제목 */}
                                <div className="notice-title">

                                    {notice.title}

                                </div>


                                {/* 작성일 */}
                                <div className="notice-date">

                                    {notice.indate
                                        ? notice.indate.substring(0, 10)
                                        : ''
                                    }

                                </div>


                                {/* 조회수 */}
                                <div className="notice-view">

                                    {notice.viewcount}

                                </div>

                            </div>

                        ))

                    ) : (

                        <div className="notice-empty">
                            공지사항이 없습니다.
                        </div>

                    )}

                </div>


                {/* 검색 */}
                <form
                    className="notice-search"
                    onSubmit={handleSearch}
                >

                    <select
                        value={searchType}
                        onChange={(e) =>
                            setSearchType(e.target.value)
                        }
                    >
                        <option value="title">
                            제목
                        </option>

                        <option value="content">
                            내용
                        </option>
                    </select>


                    <input
                        type="text"
                        placeholder="검색어를 입력해주세요."
                        value={key}
                        onChange={(e) =>
                            setKey(e.target.value)
                        }
                    />
                    <button onClick={() => { onPageMove(1) }}>
                        검색
                    </button>

                </form>


                {/* 페이지네이션 */}
                {totalPages > 1 && (

                    <div className="notice-pagination">

                        {/* 이전 */}
                        {pages > 1 && (

                            <button
                                className="notice-page-arrow"
                                onClick={() =>
                                    handlePage(pages - 1)
                                }
                            >
                                &lt;
                            </button>

                        )}


                        {/* 페이지 번호 */}
                        {Array.from(
                            { length: totalPages },
                            (_, index) => index + 1
                        ).map((pageNumber) => (

                            <button
                                key={pageNumber}
                                className={`notice-page ${pages === pageNumber
                                    ? 'active'
                                    : ''
                                    }`}
                                onClick={() =>
                                    handlePage(pageNumber)
                                }
                            >
                                {pageNumber}
                            </button>

                        ))}


                        {/* 다음 */}
                        {pages < totalPages && (

                            <button
                                className="notice-page-arrow"
                                onClick={() =>
                                    handlePage(pages + 1)
                                }
                            >
                                &gt;
                            </button>

                        )}

                    </div>

                )}

            </div>

        </div>
    );
}

export default NoticeList;
