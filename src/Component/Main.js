import React from 'react'

function Main() {
    return (
        <div style={{border:'1px solid red', width:'1918px', height:'917px', display:'flex', flexDirection:'column'}}>
            <div style={{border:'3px solid blue', flex:'1', display:'flex'}}>
                <div style={{border:'1px solid green', flex:'5'}}>헤더</div>
                <div style={{border:'1px solid green', flex:'1'}}>로그인</div>
            </div>
            <div style={{border:'3px solid black', flex:'3', display:'flex'}}>
                <div style={{border:'1px solid blue', flex:'1'}}>배너</div>
            </div>
            <div style={{border:'3px solid yellow', flex:'4', display:'flex'}}>
                <div style={{border:'1px solid orange', flex:'1'}}>content1</div>
                <div style={{border:'1px solid orange', flex:'1'}}>content2</div>
                <div style={{border:'1px solid orange', flex:'1'}}>content3</div>
            </div>
        </div>
    )
}

export default Main