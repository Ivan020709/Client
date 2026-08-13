import React, { useState } from 'react';
import '../../style/info/Info.css';

function Info() {
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(false);

    const findCenter = () => {
        if (!navigator.geolocation) {
            alert('현재 브라우저에서는 위치 정보를 사용할 수 없습니다.');
            return;
        }

        setLoading(true);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setLocation({ latitude, longitude });
                setLoading(false);
            },
            () => {
                setLoading(false);
                alert('위치 정보를 가져올 수 없습니다. 위치 권한을 허용해주세요.');
            }
        );
    };

    return (
        <div className="nearby-center">
            <h2>가까운 심리상담센터</h2>
            <p className="nearby-center-desc">현재 위치를 기준으로 가까운 심리상담센터를 찾아보세요.</p>

            <div className="nearby-center-box">
                <div className="nearby-center-icon">🌱</div>
                <h3>내 주변 상담센터 찾기</h3>
                <p>위치 정보를 허용하면 현재 위치 주변의<br />심리상담센터를 찾아볼 수 있습니다.</p>

                <button className="nearby-center-btn" onClick={findCenter} disabled={loading}>
                    {loading ? '위치 확인 중...' : '🌱 가까운 상담센터 찾기'}
                </button>
            </div>

            {location && (
                <div className="center-result">
                    <h3>내 주변 심리상담센터</h3>
                    <p className="center-result-desc">현재 위치를 기준으로 주변 상담센터를 확인해보세요.</p>

                    <div className="map-box">
                        <iframe
                            title="주변 심리상담센터"
                            src={`https://www.google.com/maps?q=심리상담센터&ll=${location.latitude},${location.longitude}&z=14&output=embed`}
                            width="100%"
                            height="450"
                            style={{ border: 0 }}
                            loading="lazy"
                            allowFullScreen
                        ></iframe>
                    </div>

                    <button
                        className="google-map-btn"
                        onClick={() => window.open(`https://www.google.com/maps/search/심리상담센터/@${location.latitude},${location.longitude},14z`, '_blank')}
                    >
                        Google 지도에서 자세히 보기
                    </button>
                </div>
            )}
        </div>
    );
}

export default Info;