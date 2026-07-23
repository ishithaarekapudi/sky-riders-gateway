"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon, PageShell } from "../ui";

const interests = [["plane","I love flying"],["wrench","I like building and fixing"],["code","I enjoy technology"],["people","I want to help people"],["path","I’m still exploring"]];
const stages = [["school","Middle School"],["cap","High School"],["school","College"],["path","Other"]];

export default function ExplorePage(){
  const router = useRouter();
  const [interest,setInterest]=useState(""); const [stage,setStage]=useState("");
  function buildRoadmap(){if(!interest||!stage)return; localStorage.setItem("sky-riders-roadmap",JSON.stringify({interest,stage})); router.push("/careers");}
  return <PageShell active="explore"><section className="sub-hero explore-hero"><div><h1>Explore Your Path<br/>in Aviation</h1><p>Tell us what inspires you,<br/>and we’ll help you find a direction.</p><div className="progress"><b>Step 1 of 3</b><span><i/></span></div></div></section><section className="question-layout"><div className="question-panel"><h2>What interests you most?</h2><p>Choose one that feels most like you.</p><div className="choice-grid five">{interests.map(([icon,label])=><button className={interest===label?"selected":""} onClick={()=>setInterest(label)} key={label}><Icon name={icon}/><b>{label}</b></button>)}</div><hr/><h2>What best describes your current stage?</h2><p>This helps us personalize your recommendations.</p><div className="choice-grid four">{stages.map(([icon,label])=><button className={stage===label?"selected":""} onClick={()=>setStage(label)} key={label}><Icon name={icon}/><b>{label}</b></button>)}</div></div><aside className="roadmap-card"><h2>Your Gateway Roadmap</h2><p>We’ll build a personalized plan with opportunities and next steps just for you.</p>{[["search","Discover","Explore your interests and aviation pathways."],["document","Prepare","Build skills, find resources, and get guidance."],["plane","Launch","Access opportunities and take off toward your future."]].map(([i,t,p])=><div className="roadmap-step" key={t}><Icon name={i}/><div><h3>{t}</h3><p>{p}</p></div></div>)}<div className="locked">{interest&&stage?"✓":"🔒"} <span><b>Personalized recommendations</b><br/>{interest&&stage?`${interest} · ${stage}`:"Complete the questions to unlock your custom roadmap."}</span></div><button className="primary-button wide" disabled={!interest||!stage} onClick={buildRoadmap}>Build My Roadmap →</button></aside></section></PageShell>
}
