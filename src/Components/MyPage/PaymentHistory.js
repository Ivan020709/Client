import React,{useEffect,useState} from 'react';
import {useSelector} from 'react-redux';
import jaxios from '../../utils/jwtUtil';
import './PaymentHistory.css';
function PaymentHistory(){const loginUser=useSelector(s=>s.user);const [payments,setPayments]=useState([]);useEffect(()=>{if(loginUser?.userid)jaxios.get('/api/payment/myList',{params:{userId:loginUser.userid}}).then(r=>setPayments(r.data.payments||[])).catch(e=>console.error(e));},[loginUser?.userid]);return <main className="payment-history"><h1>결제 내역</h1>{payments.length===0?<p>결제 내역이 없습니다.</p>:<div className="payment-history-list">{payments.map(p=><article key={p.paymentId}><div><b>{p.items?.map(i=>`${i.itemName} ${i.quantity}개`).join(', ')}</b><small>{p.merchantUid}</small></div><strong>{p.totalPrice.toLocaleString()}원</strong><span className={`payment-status ${p.paymentStatus}`}>{p.paymentStatus}</span><time>{p.paidAt||p.createdAt}</time></article>)}</div>}</main>}export default PaymentHistory;
