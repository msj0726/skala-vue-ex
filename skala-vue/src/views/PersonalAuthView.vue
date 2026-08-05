<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MlbNav from '@/components/mlb/MlbNav.vue'
import { useAuth } from '@/services/auth'

const route = useRoute()
const router = useRouter()
const { signUp, login } = useAuth()
const mode = computed(() => route.name === 'PersonalSignup' ? 'signup' : 'login')
const form = ref({ name: '', email: '', password: '', passwordConfirm: '' })
const error = ref('')
const loading = ref(false)

const submit = async () => {
  error.value = ''
  if (mode.value === 'signup' && form.value.password !== form.value.passwordConfirm) { error.value = '비밀번호가 서로 일치하지 않습니다.'; return }
  if (form.value.password.length < 6) { error.value = '비밀번호는 6자 이상 입력해주세요.'; return }
  loading.value = true
  try {
    if (mode.value === 'signup') await signUp(form.value)
    else await login(form.value)
    router.push('/personal/')
  } catch (reason) { error.value = reason.message }
  finally { loading.value = false }
}
</script>

<template>
  <div class="auth-page">
    <MlbNav />
    <main class="auth-shell">
      <section class="auth-story"><p>MLB WEATHER MEMBER</p><h1>Your team.<br><em>Your game day.</em></h1><span>로그인하고 즐겨찾는 팀과 구장 날씨를 나만의 대시보드에서 확인하세요.</span></section>
      <section class="auth-card">
        <p class="auth-kicker">{{ mode === 'signup' ? 'CREATE ACCOUNT' : 'WELCOME BACK' }}</p>
        <h2>{{ mode === 'signup' ? '회원가입' : '로그인' }}</h2>
        <p class="auth-description">{{ mode === 'signup' ? '나만의 MLB 경기 대시보드를 시작하세요.' : '저장한 팀과 오늘의 경기를 확인하세요.' }}</p>
        <form @submit.prevent="submit">
          <label v-if="mode === 'signup'">이름<input v-model.trim="form.name" required autocomplete="name" placeholder="이름을 입력하세요"></label>
          <label>이메일<input v-model.trim="form.email" required type="email" autocomplete="email" placeholder="you@example.com"></label>
          <label>비밀번호<input v-model="form.password" required type="password" :autocomplete="mode === 'signup' ? 'new-password' : 'current-password'" placeholder="6자 이상 입력하세요"></label>
          <label v-if="mode === 'signup'">비밀번호 확인<input v-model="form.passwordConfirm" required type="password" autocomplete="new-password" placeholder="비밀번호를 다시 입력하세요"></label>
          <p v-if="error" class="auth-error">{{ error }}</p>
          <button :disabled="loading">{{ loading ? '처리 중...' : mode === 'signup' ? '회원가입 완료' : '로그인' }}</button>
        </form>
        <p class="auth-switch"><template v-if="mode === 'signup'">이미 계정이 있나요? <RouterLink to="/personal/login">로그인</RouterLink></template><template v-else>아직 계정이 없나요? <RouterLink to="/personal/signup">회원가입</RouterLink></template></p>
        <small>데모 버전: 계정 정보는 현재 브라우저에만 저장됩니다.</small>
      </section>
    </main>
  </div>
</template>

<style scoped>
.auth-page{min-height:100vh;background:#08121c;color:#fff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}.auth-shell{min-height:100vh;display:grid;grid-template-columns:1.1fr .9fr;padding-top:68px;background:radial-gradient(circle at 20% 50%,rgba(30,100,83,.38),transparent 32%),linear-gradient(120deg,#08111a 0%,#10212a 55%,#eef0eb 55%)}.auth-story{display:flex;flex-direction:column;justify-content:center;padding:8vw}.auth-story p,.auth-kicker{color:#e34a40;font-size:10px;font-weight:900;letter-spacing:.18em}.auth-story h1{margin:18px 0 28px;font-size:clamp(52px,6vw,88px);line-height:.95}.auth-story h1 em{color:#dfddd4;font-weight:300;font-style:normal}.auth-story span{max-width:470px;color:rgba(255,255,255,.58);font-size:15px;line-height:1.8}.auth-card{width:min(440px,calc(100% - 36px));align-self:center;justify-self:center;padding:42px;background:#fff;color:#17232a;border-radius:6px;box-shadow:0 25px 70px rgba(0,0,0,.2)}.auth-card h2{margin:8px 0 7px;font-size:34px}.auth-description{margin:0 0 28px;color:#7f898d;font-size:13px}.auth-card form{display:grid;gap:15px}.auth-card label{display:grid;gap:7px;color:#4d585c;font-size:11px;font-weight:800}.auth-card input{width:100%;height:45px;padding:0 13px;border:1px solid #dce0dc;border-radius:3px;font:inherit;outline:none}.auth-card input:focus{border-color:#263a43;box-shadow:0 0 0 3px rgba(38,58,67,.08)}.auth-card form button{height:48px;margin-top:6px;border:0;border-radius:3px;background:#d9473f;color:#fff;font-weight:900;cursor:pointer}.auth-card form button:disabled{opacity:.55}.auth-error{margin:0;padding:10px;background:#fff0ef;color:#b52f29;font-size:11px}.auth-switch{margin:22px 0 12px;color:#788286;font-size:12px;text-align:center}.auth-switch a{color:#d9473f;font-weight:800}.auth-card small{display:block;color:#a2a8aa;font-size:9px;text-align:center}@media(max-width:800px){.auth-shell{grid-template-columns:1fr;padding:92px 0 40px;background:linear-gradient(160deg,#0b1822 0%,#132a30 34%,#eef0eb 34%)}.auth-story{padding:30px 24px 60px}.auth-story h1{font-size:48px}.auth-card{padding:30px 24px}}
</style>
