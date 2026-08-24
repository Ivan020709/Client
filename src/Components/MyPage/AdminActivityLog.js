import React, { useEffect, useState } from 'react';
import './AdminActivityLog.css';
import axios from 'axios';

function AdminActivityLog() {

    const [activityList, setActivityList] = useState([]);

    useEffect(() => {

        axios.get('/api/admin/getAdminActivityLog')
            .then((result) => {

                console.log("조회 성공");
                console.log("result:", result);
                console.log("result.data:", result.data);
                console.log("배열인가?", Array.isArray(result.data));

                setActivityList(result.data);

            })
            .catch((err) => {

                console.error("조회 실패:", err);

            });

    }, []);


    // 날짜 형식 변경
    const formatDate = (date) => {

        if (!date) {
            return '';
        }

        const d = new Date(date);

        return d.toLocaleString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
    };


    // 활동 종류별 스타일
    const getActivityActionClass = (activity) => {

        if (activity === '게시글 삭제') {
            return 'admin-activity-delete';
        }

        if (activity === '에러 확인') {
            return 'admin-activity-error';
        }

        if (activity === '신고 처리 완료') {
            return 'admin-activity-report';
        }

        return '';
    };


    // HTTP Method별 스타일
    const getActivityMethodClass = (method) => {

        if (method === 'DELETE') {
            return 'admin-method-delete';
        }

        if (method === 'PATCH') {
            return 'admin-method-patch';
        }

        if (method === 'POST') {
            return 'admin-method-post';
        }

        if (method === 'GET') {
            return 'admin-method-get';
        }

        return '';
    };


    return (

        <div className="admin-activity-log">

            {/* =========================
                헤더
            ========================= */}

            <div className="admin-activity-header">

                <div>

                    <h2 className="admin-activity-title">
                        관리자 활동 로그
                    </h2>

                    <p className="admin-activity-description">
                        관리자들이 수행한 주요 활동 내역을 확인합니다.
                    </p>

                </div>

                <div className="admin-activity-count">
                    총 <strong>{activityList.length}</strong>건
                </div>

            </div>


            {/* =========================
                게시판
            ========================= */}

            <div className="admin-activity-board">

                <div className="admin-activity-board-header">

                    <div>번호</div>
                    <div>관리자</div>
                    <div>활동</div>
                    <div>대상</div>
                    <div>HTTP</div>
                    <div>API</div>
                    <div>결과</div>
                    <div>활동일시</div>

                </div>


                {activityList.length === 0 ? (

                    <div className="admin-activity-empty">
                        관리자 활동 내역이 없습니다.
                    </div>

                ) : (

                    activityList.map((activity) => (

                        <div
                            className="admin-activity-board-row"
                            key={activity.id}
                        >

                            {/* 번호 */}
                            <div>
                                {activity.id}
                            </div>


                            {/* 관리자 */}
                            <div className="admin-activity-admin">

                                <strong>
                                    {activity.adminname}
                                </strong>

                                <span>
                                    {activity.adminid}
                                </span>

                            </div>


                            {/* 활동 */}
                            <div>

                                <span
                                    className={`admin-activity-action ${getActivityActionClass(
                                        activity.activity
                                    )}`}
                                >
                                    {activity.activity}
                                </span>

                            </div>


                            {/* 대상 */}
                            <div>
                                {activity.target}
                            </div>


                            {/* HTTP */}
                            <div>

                                <span
                                    className={`admin-activity-method ${getActivityMethodClass(
                                        activity.method
                                    )}`}
                                >
                                    {activity.method}
                                </span>

                            </div>


                            {/* API */}
                            <div className="admin-activity-api">
                                {activity.api}
                            </div>


                            {/* 결과 */}
                            <div>

                                {activity.result === 'SUCCESS' ? (

                                    <span className="admin-activity-success">
                                        성공
                                    </span>

                                ) : (

                                    <span className="admin-activity-fail">
                                        실패
                                    </span>

                                )}

                            </div>


                            {/* 활동일시 */}
                            <div className="admin-activity-date">
                                {formatDate(activity.indate)}
                            </div>

                        </div>

                    ))

                )}

            </div>

        </div>
    );
}

export default AdminActivityLog;