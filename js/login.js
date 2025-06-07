import { session_set, session_get, session_check } from './session.js';
import { encrypt_text, decrypt_text } from './crypto.js';
import { generateJWT, checkAuth } from './token.js';

function init(){ // 로그인 폼에 쿠키에서 가져온 아이디 입력
    const emailInput = document.getElementById('typeEmailX');
    const idsave_check = document.getElementById('idSaveCheck');
    let get_id = getCookie("id");
    if(get_id) {
    emailInput.value = get_id;
    idsave_check.checked = true;
    }
    session_check(); // 세션 유무 검사
    }

    document.addEventListener('DOMContentLoaded', () => {
    init();
    const loginBtn = document.getElementById("login_btn");
    if (loginBtn) {
        loginBtn.addEventListener('click', check_input);
    }
});

function init_logined(){
    if(sessionStorage){
    decrypt_text(); // 복호화 함수
    }
    else{
    alert("세션 스토리지 지원 x");
    }
}

    
const check_xss = (input) => {
    // DOMPurify 라이브러리 로드 (CDN 사용)
    const DOMPurify = window.DOMPurify;
    // 입력 값을 DOMPurify로 sanitize
    const sanitizedInput = DOMPurify.sanitize(input);
    // Sanitized된 값과 원본 입력 값 비교
    if (sanitizedInput !== input) {
    // XSS 공격 가능성 발견 시 에러 처리
    alert('XSS 공격 가능성이 있는 입력값을 발견했습니다.');
    return false;
    }
    // Sanitized된 값 반환
    return sanitizedInput;
    };

    function setCookie(name, value, expiredays) {
        var date = new Date();
        date.setDate(date.getDate() + expiredays);
        document.cookie = escape(name) + "=" + escape(value) + "; expires=" + date.toUTCString() + ";path=/" + ";SameSite=None; Secure";     
    }
    function getCookie(name) {
        var cookie = document.cookie;
        console.log("쿠키를 요청합니다.");
        if (cookie != "") {
        var cookie_array = cookie.split("; ");
        for ( var index in cookie_array) {
        var cookie_name = cookie_array[index].split("=");
        if (cookie_name[0] == name) {
        return cookie_name[1];
        }
        }
        }
        return undefined;
        }

// 로그인 카운트 함수
function login_count() {
    let count = getCookie("login_cnt");
    if (count === undefined) {
        count = 0;
    } else {
        count = parseInt(count);
    }
    count++;
    setCookie("login_cnt", count.toString(), 365); // 1년간 저장
    console.log("로그인 횟수:", count);
    return count;
}

// 로그아웃 카운트 함수
function logout_count() {
    let count = getCookie("logout_cnt");
    if (count === undefined) {
        count = 0;
    } else {
        count = parseInt(count);
    }
    count++;
    setCookie("logout_cnt", count.toString(), 365); // 1년간 저장
    console.log("로그아웃 횟수:", count);
    return count;
}

// 로그인 실패 카운트 함수
function login_failed() {
    let failCount = getCookie("login_fail_cnt");
    if (failCount === undefined) {
        failCount = 0;
    } else {
        failCount = parseInt(failCount);
    }
    failCount++;
    setCookie("login_fail_cnt", failCount.toString(), 1); // 1일간 저장
    console.log("로그인 실패 횟수:", failCount);
    
    // 실패 횟수 표시
    const failCountDisplay = document.getElementById('login_fail_count');
    if (failCountDisplay) {
        failCountDisplay.textContent = `로그인 실패 횟수: ${failCount}회`;
    }

    // 3회 이상 실패 시 로그인 제한
    if (failCount >= 3) {
        const loginForm = document.getElementById('login_form');
        const loginBtn = document.getElementById('login_btn');
        if (loginForm) loginForm.style.display = 'none';
        if (loginBtn) loginBtn.style.display = 'none';
        
        const restrictionMsg = document.createElement('div');
        restrictionMsg.id = 'login_restriction';
        restrictionMsg.style.color = 'red';
        restrictionMsg.style.fontWeight = 'bold';
        restrictionMsg.style.margin = '20px 0';
        restrictionMsg.innerHTML = `
            <p>로그인이 제한되었습니다.</p>
            <p>로그인 실패 횟수: ${failCount}회</p>
            <p>24시간 후에 다시 시도해주세요.</p>
        `;
        
        const container = document.querySelector('.container');
        if (container) {
            container.appendChild(restrictionMsg);
        }
    }
    
    return failCount;
}

// 로그인 성공 시 실패 카운트 초기화
function reset_login_fail_count() {
    setCookie("login_fail_cnt", "0", 1);
    const failCountDisplay = document.getElementById('login_fail_count');
    if (failCountDisplay) {
        failCountDisplay.textContent = '로그인 실패 횟수: 0회';
    }
}

const check_input = () => { 
    // 로그인 제한 상태 확인
    const failCount = getCookie("login_fail_cnt");
    if (failCount !== undefined && parseInt(failCount) >= 3) {
        alert('로그인이 제한되었습니다. 24시간 후에 다시 시도해주세요.');
        return false;
    }

    const loginForm = document.getElementById('login_form');
    const emailInput = document.getElementById('typeEmailX');
    const passwordInput = document.getElementById('typePasswordX');
    const idsave_check = document.getElementById('idSaveCheck');
    const emailValue = emailInput.value.trim();
    const passwordValue = passwordInput.value.trim();
    const payload = {
        id: emailValue,
        exp: Math.floor(Date.now() / 1000) + 3600 // 1시간 (3600초)
    };
    const jwtToken = generateJWT(payload);
    const c = '아이디, 패스워드를 체크합니다';
    alert(c);
    
    const sanitizedPassword = check_xss(passwordValue);
    const sanitizedEmail = check_xss(emailValue);

    if (emailValue === '') {
        alert('이메일을 입력하세요.');
        login_failed(); // 로그인 실패 카운트 증가
        return false;
    }
    if (passwordValue === '') {
        alert('비밀번호를 입력하세요.');
        login_failed(); // 로그인 실패 카운트 증가
        return false;
    }
    if (emailValue.length < 5) {
        alert('아이디는 최소 5글자 이상 입력해야 합니다.');
        login_failed(); // 로그인 실패 카운트 증가
        return false;
    }
    if (passwordValue.length < 12) {
        alert('비밀번호는 반드시 12글자 이상 입력해야 합니다.');
        login_failed(); // 로그인 실패 카운트 증가
        return false;
    }
    const hasSpecialChar = passwordValue.match(/[!,@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/) !== null;
    if (!hasSpecialChar) {
        alert('패스워드는 특수문자를 1개 이상 포함해야 합니다.');
        login_failed(); // 로그인 실패 카운트 증가
        return false;
    }
    const hasUpperCase = passwordValue.match(/[A-Z]+/) !== null;
    const hasLowerCase = passwordValue.match(/[a-z]+/) !== null;
    if (!hasUpperCase || !hasLowerCase) {
        alert('패스워드는 대소문자를 1개 이상 포함해야 합니다.');
        login_failed(); // 로그인 실패 카운트 증가
        return false;
    }

    if (!sanitizedEmail) {
        // Sanitize된 비밀번호 사용
        login_failed(); // 로그인 실패 카운트 증가
        return false;
    }
    if (!sanitizedPassword) {
        // Sanitize된 비밀번호 사용
        login_failed(); // 로그인 실패 카운트 증가
        return false;
    }

    if(idsave_check.checked == true) {
        alert("쿠키를 저장합니다.", emailValue);
        setCookie("id", emailValue, 1);
        alert("쿠키 값 :" + emailValue);
    } else {
        setCookie("id", emailValue.value, 0);
    }

    // 로그인 성공 시 실패 카운트 초기화
    reset_login_fail_count();
    // 로그인 성공 시 로그인 카운트 증가
    login_count();

    console.log('이메일:', emailValue);
    console.log('비밀번호:', passwordValue);
    
    session_set();
    localStorage.setItem('jwt_token', jwtToken);
    if (loginForm) {
        location.href = '/login/index_login.html';
    }
};

// 세션 삭제 함수
function session_del() {
    if (sessionStorage) {
        sessionStorage.removeItem("Session_Storage_test");
        alert('로그아웃 버튼 클릭 확인 : 세션 스토리지를 삭제합니다.');
        // 로그아웃 카운트 증가
        logout_count();
    } else {
        alert("세션 스토리지 지원 x");
    }
}

// 로그아웃 함수
function logout() {
    session_del(); // 세션 삭제
    // JWT 토큰도 삭제
    localStorage.removeItem('jwt_token');
    location.href = '../index.html';
}

// 페이지 로드 시 실패 횟수 표시
document.addEventListener('DOMContentLoaded', () => {
    init();
    const loginBtn = document.getElementById("login_btn");
    if (loginBtn) {
        loginBtn.addEventListener('click', check_input);
    }

    // 실패 횟수 표시 요소 추가
    const failCountDisplay = document.createElement('div');
    failCountDisplay.id = 'login_fail_count';
    failCountDisplay.style.margin = '10px 0';
    failCountDisplay.style.color = '#666';
    
    const failCount = getCookie("login_fail_cnt");
    if (failCount !== undefined) {
        failCountDisplay.textContent = `로그인 실패 횟수: ${failCount}회`;
        if (parseInt(failCount) >= 3) {
            failCountDisplay.style.color = 'red';
            failCountDisplay.style.fontWeight = 'bold';
        }
    } else {
        failCountDisplay.textContent = '로그인 실패 횟수: 0회';
    }

    const loginForm = document.getElementById('login_form');
    if (loginForm) {
        loginForm.parentNode.insertBefore(failCountDisplay, loginForm);
    }
});