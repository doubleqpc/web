/*
function session_set() { //세션 저장
    let session_id = document.querySelector("#typeEmailX");
    if (sessionStorage) {
    sessionStorage.setItem("Session_Storage_test", session_id.value);
    } else {
    alert("로컬 스토리지 지원 x");
    }
    }
*/

import { encrypt_text, decrypt_text } from './crypto.js';

export function session_set(){ //세션 저장(객체)
    let id = document.querySelector("#typeEmailX");
    let password = document.querySelector("#typePasswordX");
    let random = new Date(); // 랜덤 타임스탬프
    const obj = { // 객체 선언
        id : id.value,
        otp : random
    }
    if (sessionStorage) {
        let en_text = encrypt_text(password.value);
        sessionStorage.setItem("Session_Storage_id", obj.id);
        sessionStorage.setItem("Session_Storage_pass", en_text);
        sessionStorage.setItem("Session_Storage_otp", obj.otp);
    } else {
        alert("로컬 스토리지 지원 x");
    }
}

// export function session_set() { //세션 저장
//     let session_id = document.querySelector("#typeEmailX"); // DOM 트리에서 ID 검색
//     let session_pass = document.querySelector("#typePasswordX"); // DOM 트리에서 pass 검색
//     if (sessionStorage) {
//     let en_text = encrypt_text(session_pass.value);
//     sessionStorage.setItem("Session_Storage_id", session_id.value);
//     sessionStorage.setItem("Session_Storage_pass", en_text);
//     } else {
//     alert("로컬 스토리지 지원 x");
//     }
// }


// function session_get() { //세션 읽기
//     if (sessionStorage) {
//     return sessionStorage.getItem("Session_Storage_test");
//     } else {
//     alert("세션 스토리지 지원 x");
//     }
//     }

export function session_get() { //세션 읽기
    if (sessionStorage) {
    return sessionStorage.getItem("Session_Storage_pass");
    } else {
    alert("세션 스토리지 지원 x");
    }
}
    
// function session_check() { //세션 검사
//     if (sessionStorage.getItem("Session_Storage_test")) {
//     alert("이미 로그인 되었습니다.");
//     location.href='../login/index_login.html'; // 로그인된 페이지로 이동
//     }
//     }

export function session_check() { //세션 검사
    // 오직 로그인 페이지에서만 동작
    if (window.location.pathname.endsWith('/login/login.html')) {
        if (sessionStorage.getItem("Session_Storage_id")) {
            alert("이미 로그인 되었습니다.");
            location.href = '/login/index_login.html'; // 로그인된 페이지로 이동
        }
    }
}
