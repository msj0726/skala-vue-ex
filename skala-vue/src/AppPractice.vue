<script setup>
// 1. 학습환경 구성
import SampleOne from './components/practice/SampleOne.vue'
import SampleTwo from './components/practice/SampleTwo.vue'

// 2. Vue Directive
import VueHtml from './components/practice/VueHtml.vue'
import VueHtmlXss from './components/practice/VueHtmlXss.vue'
import VueBind from './components/practice/VueBind.vue'
import VueBindClass from './components/practice/VueBindClass.vue'
import VueBindStyle from './components/practice/VueBindStyle.vue'
import VueBindShorthand from './components/practice/VueBindShorthand.vue'
import VueIf from './components/practice/VueIf.vue'
import VueShow from './components/practice/VueShow.vue'
import VueFor from './components/practice/VueFor.vue'
import VuePre from './components/practice/VuePre.vue'
import VueCloak from './components/practice/VueCloak.vue'
import VueOnce from './components/practice/VueOnce.vue'
import VueMemo from './components/practice/VueMemo.vue'

// 3. Vue Event Handling
import EventBasic from './components/practice/EventBasic.vue'
import EventObject from './components/practice/EventObject.vue'
import EventModifier from './components/practice/EventModifier.vue'

// 4. Vue Form Handling
import ModelBasic from './components/practice/ModelBasic.vue'
import ModelForm from './components/practice/ModelForm.vue'
import ModelModifier from './components/practice/ModelModifier.vue'

// 5. Vue Style Handling
import StyleScoped from './components/practice/StyleScoped.vue'
</script>

<template>
  <div class="practice-container">
    <h1>1. 학습환경구성</h1>
    <hr />
    <SampleOne />
    <SampleTwo />
    <h1>2. Vue Directive</h1>
    <hr />
    <VueHtml />
    <VueHtmlXss />
    <VueBind />
    <VueBindClass />
    <VueBindStyle />
    <VueBindShorthand />
    <VueIf />
    <VueShow />
    <VueFor />
    <VuePre />
    <VueCloak />
    <VueOnce />
    <VueMemo />
    <h1>3. Vue Event Handling</h1>
    <hr />
    <EventBasic />
    <EventObject />
    <EventModifier />
    <h1>4. Vue Form Handling</h1>
    <hr />
    <ModelBasic />
    <ModelForm />
    <ModelModifier />
    <h1>5. Vue Style Handling</h1>
    <hr />
    <StyleScoped />
  </div>
</template>

<style>
/* ⚠️ 외부 스타일 파일(예: 버튼 디자인 뭉치)을 이 방 안으로 쏙 가리켜 가져옵니다 */
@import '@/assets/practice.css';
</style>
