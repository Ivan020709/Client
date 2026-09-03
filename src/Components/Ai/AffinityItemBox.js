import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import jaxios from '../../utils/jwtUtil';
import './AffinityItemBox.css';

/** 세 AI 대화 화면에서 함께 사용하는 친밀도·아이템 영역입니다. */
function AffinityItemBox({ character }) {
    const loginUser = useSelector(state => state.user);
    const [info, setInfo] = useState(null);

    const loadInfo = useCallback(() => {
        if (!loginUser?.userid) return;
        jaxios.get('/api/affinity/myInfo', {
            params: { userId: loginUser.userid, character: character }
        })
            .then(result => setInfo(result.data))
            .catch(error => console.error('친밀도 조회 실패:', error));
    }, [loginUser?.userid, character]);

    useEffect(loadInfo, [loadInfo]);

    // AI 대화 경험치가 지급되면 페이지 새로고침 없이 최신 값을 다시 조회합니다.
    useEffect(() => {
        const reload = () => loadInfo();
        window.addEventListener('affinityUpdated', reload);
        return () => window.removeEventListener('affinityUpdated', reload);
    }, [loadInfo]);

    const handleUseItem = (itemId) => {
        // 실수로 아이템을 사용하는 것을 막기 위해 먼저 확인합니다.
        if (!window.confirm(`${character}에게 이 아이템을 사용하시겠습니까?`)) return;

        jaxios.post('/api/affinity/useItem', {
            userId: loginUser.userid,
            itemId: itemId,
            character: character
        })
            .then(result => {
                setInfo(result.data);
                alert(`${result.data.usedItemName} 사용! 친밀도 경험치가 ${result.data.addedExp} 올랐습니다.`);
            })
            .catch(error => alert(error.response?.data?.message || '아이템을 사용하지 못했습니다.'));
    };

    if (!info) return null;
    const levelStart = info.currentLevelExp || 0;
    const percent = Math.min(100,
        ((info.exp - levelStart) / (info.nextLevelExp - levelStart)) * 100);

    return (
        <section className="affinity-box">
            <div className="affinity-summary">
                <strong>{character} 친밀도 Lv.{info.level} · {info.levelName}</strong>
                <span>{info.exp} / {info.nextLevelExp} EXP</span>
            </div>
            <div className="affinity-progress"><span style={{ width: `${percent}%` }} /></div>
            <div className="affinity-items">
                {info.items.length === 0 ? (
                    <span className="affinity-empty">보유 아이템이 없습니다. 상점에서 구매해 주세요.</span>
                ) : info.items.map(item => (
                    <button key={item.itemId} type="button" disabled={item.quantity < 1}
                            onClick={() => handleUseItem(item.itemId)}>
                        {item.itemImage && <img src={item.itemImage} alt="" />}
                        <span>{item.itemName} × {item.quantity}</span>
                        <small>사용 +{item.expValue} EXP</small>
                    </button>
                ))}
            </div>
        </section>
    );
}
export default AffinityItemBox;
