import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import jaxios from '../../utils/jwtUtil';
import './ItemShop.css';

// 수업시간에 사용한 결제위젯 테스트 클라이언트 키입니다.
// 클라이언트 키는 브라우저에서 사용하는 공개 키이므로 .env에 넣지 않아도 됩니다.
const CLIENT_KEY = 'test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm';

// 별도 npm 설치 없이 수업 예제와 같은 토스 SDK v2를 불러옵니다.
const loadTossPayments = () => new Promise((resolve, reject) => {
    if (window.TossPayments) {
        resolve(window.TossPayments);
        return;
    }
    const script = document.createElement('script');
    script.src = 'https://js.tosspayments.com/v2/standard';
    script.onload = () => resolve(window.TossPayments);
    script.onerror = () => reject(new Error('토스 결제 모듈을 불러오지 못했습니다.'));
    document.head.appendChild(script);
});

function ItemPayment() {
    const { itemId } = useParams();
    const loginUser = useSelector((state) => state.user);
    const widgetsRef = useRef(null);
    const [item, setItem] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [order, setOrder] = useState(null);
    const [preparing, setPreparing] = useState(false);

    useEffect(() => {
        axios.get(`/api/item/view/${itemId}`)
            .then((result) => setItem(result.data.item))
            .catch(() => alert('상품을 불러오지 못했습니다.'));
    }, [itemId]);

    // 서버가 DB 가격으로 주문번호와 결제금액을 만든 후 결제위젯을 표시합니다.
    const preparePayment = async () => {
        if (preparing) return;
        setPreparing(true);

        try {
            const result = await jaxios.post('/api/payment/ready', {
                userId: loginUser.userid,
                itemId: Number(itemId),
                quantity: quantity
            });
            const readyOrder = result.data;
            const TossPayments = await loadTossPayments();
            const tossPayments = TossPayments(CLIENT_KEY);
            const widgets = tossPayments.widgets({
                customerKey: `FEELOG_USER_${loginUser.userid}`
            });

            await widgets.setAmount({
                currency: 'KRW',
                value: readyOrder.totalPrice
            });
            await Promise.all([
                widgets.renderPaymentMethods({ selector: '#payment-method', variantKey: 'DEFAULT' }),
                widgets.renderAgreement({ selector: '#agreement', variantKey: 'AGREEMENT' })
            ]);

            widgetsRef.current = widgets;
            setOrder(readyOrder);
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || error.message || '결제를 준비하지 못했습니다.');
        } finally {
            setPreparing(false);
        }
    };

    // 결제가 끝나면 토스가 paymentResult 주소로 이동시킵니다.
    const requestPayment = async () => {
        if (!widgetsRef.current || !order) return;
        try {
            await widgetsRef.current.requestPayment({
                orderId: order.orderId,
                orderName: order.itemName,
                successUrl: `${window.location.origin}/paymentResult`,
                failUrl: `${window.location.origin}/paymentResult?failed=true`,
                customerEmail: order.buyerEmail,
                customerName: loginUser.name || loginUser.nickname
            });
        } catch (error) {
            console.error(error);
            if (error.code !== 'USER_CANCEL') alert(error.message || '결제를 요청하지 못했습니다.');
        }
    };

    if (!item) return <main className="item-shop">상품을 불러오는 중입니다.</main>;

    return (
        <main className="item-shop">
            <article className="item-card payment-card">
                <h1>{item.itemName}</h1>
                <p>{item.itemDescription}</p>
                <label>
                    수량
                    <input type="number" min="1" max="99" value={quantity}
                        disabled={order !== null}
                        onChange={(event) => setQuantity(Math.max(1, Number(event.target.value)))} />
                </label>
                <b>총 {(item.price * quantity).toLocaleString()}원</b>

                {!order && <button onClick={preparePayment} disabled={preparing}>
                    {preparing ? '결제수단을 불러오는 중...' : '결제수단 불러오기'}
                </button>}

                {/* 토스페이먼츠가 결제수단과 약관을 아래 영역에 표시합니다. */}
                <div id="payment-method" />
                <div id="agreement" />
                {order && <button onClick={requestPayment}>결제하기</button>}
            </article>
        </main>
    );
}

export default ItemPayment;
