import React, { useEffect, useState } from 'react';
import './AdminActivityLog.css';
import axios from 'axios';

function AdminActivityLog() {

    const [activityList, setActivityList] = useState([]);

    useEffect(() => {

        axios.get('/api/admin/getAdminActivityLog')
            .than((result) => {

            })
            .catch((err) => {
                console.error(err)
            })

    }, []);


    // 활동 종류별 스타일
    const getActivityActionClass = (action) => {

        if (action === '게시글 삭제') {
            return 'admin-activity-delete';
        }

        if (action === '에러 확인') {
            return 'admin-activity-error';
        }

        if (action === '신고 처리 완료') {
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
                            key={activity.lognum}
                        >

                            <div>
                                {activity.lognum}
                            </div>


                            <div className="admin-activity-admin">

                                <strong>
                                    {activity.adminName}
                                </strong>

                                <span>
                                    {activity.adminId}
                                </span>

                            </div>


                            <div>

                                <span
                                    className={`admin-activity-action ${getActivityActionClass(
                                        activity.action
                                    )}`}
                                >
                                    {activity.action}
                                </span>

                            </div>


                            <div>
                                {activity.target}
                            </div>


                            <div>

                                <span
                                    className={`admin-activity-method ${getActivityMethodClass(
                                        activity.method
                                    )}`}
                                >
                                    {activity.method}
                                </span>

                            </div>


                            <div className="admin-activity-api">
                                {activity.api}
                            </div>


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


                            <div className="admin-activity-date">
                                {activity.indate}
                            </div>

                        </div>

                    ))

                )}

            </div>

        </div>
    );
}

export default AdminActivityLog;