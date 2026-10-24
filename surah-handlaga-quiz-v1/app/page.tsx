"use client";

import { useEffect, useMemo, useState } from "react";

type Mode = "CE" | "RO" | "AC" | "AE";
type RankedAnswer = { text: string; mode: Mode };
type Question = { prompt: string; answers: RankedAnswer[]; contextual?: boolean };
type Profile = {
  mode: Mode;
  name: string;
  en: string;
  summary: string;
  strengths: string;
  watch: string;
  recommendation: string;
};

const modeNames: Record<Mode, string> = {
  CE: "Эрэлхийлэгч (CE)",
  RO: "Эргэцүүлэгч (RO)",
  AC: "Онолч (AC)",
  AE: "Идэвхтэн (AE)",
};

const questions: Question[] = [
  { prompt: "Шинэ сэдвийг сурах шаардлагатай үед та эхлээд…", answers: [
    { text: "Өөрийн эсвэл бусдын бодит жишээг санана.", mode: "CE" }, { text: "Яаралгүй ажиглаж, юу болохыг тунгаана.", mode: "RO" }, { text: "Үндсэн зарчим, логикийг нь ойлгоно.", mode: "AC" }, { text: "Шууд хийж үзэх жижиг алхам сонгоно.", mode: "AE" },
  ] },
  { prompt: "Танихгүй багт ороход танд хамгийн их тус болдог зүйл нь…", answers: [
    { text: "Хүмүүсийн өмнөх туршлага, түүхийг сонсох.", mode: "CE" }, { text: "Багийн харилцаа, хэмнэлийг эхлээд ажиглах.", mode: "RO" }, { text: "Үүрэг, зорилго, ажлын бүтцийг ойлгох.", mode: "AC" }, { text: "Нэг бодит үүрэг аваад хамтарч эхлэх.", mode: "AE" },
  ] },
  { prompt: "Алдаа гаргасныхаа дараа та ихэвчлэн…", answers: [
    { text: "Тухайн нөхцөлд хүмүүс юу мэдэрснийг эргэн санана.", mode: "CE" }, { text: "Юу болсон талаар тэмдэглэж, дүгнэнэ.", mode: "RO" }, { text: "Шалтгаан, давтагдах хэв шинжийг задлана.", mode: "AC" }, { text: "Дараагийн удаа өөрөөр туршиж үзнэ.", mode: "AE" },
  ] },
  { prompt: "Сургалтын дараах хамгийн үнэ цэнтэй хэсэг танд…", answers: [
    { text: "Өөрийн амьдрал, ажилтай холбосон жишээ.", mode: "CE" }, { text: "Сонссон зүйлээ тайван эргэцүүлэх хугацаа.", mode: "RO" }, { text: "Ойлголтууд хоорондын холбоог тайлбарлах нь.", mode: "AC" }, { text: "Даалгавар эсвэл дадлага хийж үзэх нь.", mode: "AE" },
  ] },
  { prompt: "Төвөгтэй асуудал тулгарвал та эхлээд…", answers: [
    { text: "Нөхцөл байдалд оролцож буй хүмүүсийн байр суурийг сонсоно.", mode: "CE" }, { text: "Баримтуудыг цуглуулж, шууд шийдэхээс түр азнана.", mode: "RO" }, { text: "Асуудлыг хэсэглэн задлаад таамаглал гаргана.", mode: "AC" }, { text: "Боломжит шийдлийг туршилтаар шалгана.", mode: "AE" },
  ] },
  { prompt: "Шинэ арга барил сонгохдоо та…", answers: [
    { text: "Өмнө нь хэрэглэсэн хүний бодит туршлагыг харна.", mode: "CE" }, { text: "Давуу, сул талыг нь ажиглаж харьцуулна.", mode: "RO" }, { text: "Яагаад ажиллах ёстойг нь логикоор нягтална.", mode: "AC" }, { text: "Бага хүрээнд шууд туршиж үзнэ.", mode: "AE" },
  ] },
  { prompt: "Хамт олны хэлэлцүүлэгт та ихэвчлэн…", answers: [
    { text: "Тодорхой жишээ, амьд түүх оруулна.", mode: "CE" }, { text: "Бусдын санааг сонсож, эргэцүүлэн нэгтгэнэ.", mode: "RO" }, { text: "Санаануудын логик, үндэслэлийг тодруулна.", mode: "AC" }, { text: "Дараагийн хийх алхмыг санал болгоно.", mode: "AE" },
  ] },
  { prompt: "Та ямар үед “би үнэхээр ойлголоо” гэж мэдэрдэг вэ?", answers: [
    { text: "Өөрийн туулсан явдалтайгаа холбож чадвал.", mode: "CE" }, { text: "Сайн бодож, өөрийн үгээр дүгнэж чадвал.", mode: "RO" }, { text: "Учир шалтгаан, ерөнхий зарчмыг нь олбол.", mode: "AC" }, { text: "Түүнийг бодит ажил дээр ашиглаж чадвал.", mode: "AE" },
  ] },
  { prompt: "Төлөвлөгөө тань хүссэнээр болохгүй бол та…", answers: [
    { text: "Тухайн нөхцөлд оролцсон хүмүүстэй ярилцана.", mode: "CE" }, { text: "Зогсоод, гарсан өөрчлөлтийг анзаарна.", mode: "RO" }, { text: "Таамаглал, зарчмаа дахин шалгана.", mode: "AC" }, { text: "Өөр хувилбарыг хурдан туршиж эхэлнэ.", mode: "AE" },
  ] },
  { prompt: "Шинэ ур чадвар эзэмшихдээ та…", answers: [
    { text: "Туршлагатай хүнтэй хамт хийж сурна.", mode: "CE" }, { text: "Эхлээд бусдыг ажиглаж, дарааллыг тогтооно.", mode: "RO" }, { text: "Дүрэм, ойлголтыг нь судалж байж эхэлнэ.", mode: "AC" }, { text: "Дадлага хийж, давтан сайжруулна.", mode: "AE" },
  ] },
  { prompt: "Та нэг шийдвэрийг үнэлэхдээ…", answers: [
    { text: "Хэнд, ямар бодит нөлөө үзүүлэхийг нь мэдэрнэ.", mode: "CE" }, { text: "Хэсэг хугацаанд олон өнцгөөс нь харна.", mode: "RO" }, { text: "Нотолгоо, шалгуур, эрсдэлийг нь тооцно.", mode: "AC" }, { text: "Хийж үзээд үр дүнгээр нь хэмжинэ.", mode: "AE" },
  ] },
  { prompt: "Таны хамгийн дуртай суралцах хэмнэл бол…", answers: [
    { text: "Хүмүүстэй харилцаж, бодит туршлагаа хуваалцах.", mode: "CE" }, { text: "Түр завсарлаж, ойлгосноо цэгцлэх.", mode: "RO" }, { text: "Онолыг задлан шинжилж, холбох.", mode: "AC" }, { text: "Сурсан зүйлээрээ шууд ямар нэгэн зүйл хийх.", mode: "AE" },
  ] },
  { contextual: true, prompt: "Ажил дээр шинэ систем нэвтрэхэд та…", answers: [
    { text: "Хэрэглэгч, хамт олны бодит хэрэгцээг сонсоно.", mode: "CE" }, { text: "Одоогийн ажлын урсгалыг эхлээд ажиглана.", mode: "RO" }, { text: "Системийн бүтэц, зааврыг судална.", mode: "AC" }, { text: "Туршилтын хувилбараар ажиллуулж үзнэ.", mode: "AE" },
  ] },
  { contextual: true, prompt: "Чухал уулзалтын өмнө та…", answers: [
    { text: "Оролцогчдын өмнөх харилцаа, хүлээлтийг бодно.", mode: "CE" }, { text: "Болзошгүй өрнөлийг төсөөлж, сонсох орон зай гаргана.", mode: "RO" }, { text: "Гол санаа, баримтаа бүтэцлэн бэлдэнэ.", mode: "AC" }, { text: "Ярилцлагын эхний алхам, саналуудаа туршиж бэлдэнэ.", mode: "AE" },
  ] },
  { contextual: true, prompt: "Та багийн зөрчлийг шийдэхэд…", answers: [
    { text: "Хүн бүрийн туршлага, мэдрэмжийг сонсоно.", mode: "CE" }, { text: "Шийдэхээсээ өмнө харилцан яриаг анхааралтай ажиглана.", mode: "RO" }, { text: "Асуудлын шалтгаан, дүрэм, сонголтыг тодруулна.", mode: "AC" }, { text: "Тохиролцооны нэг алхмыг шууд хэрэгжүүлнэ.", mode: "AE" },
  ] },
  { contextual: true, prompt: "Богино хугацаанд шийдэл гаргах хэрэгтэй үед…", answers: [
    { text: "Тухайн нөхцөлд хамгийн их нөлөөлөх хүнийг бодно.", mode: "CE" }, { text: "Түр азнаж, гол дохиог ялгаж харна.", mode: "RO" }, { text: "Шалгуур тогтоож, хувилбаруудыг харьцуулна.", mode: "AC" }, { text: "Хамгийн боломжит хувилбараар эхэлж, тохируулна.", mode: "AE" },
  ] },
  { contextual: true, prompt: "Төслийн эхний үр дүн тааруу байвал…", answers: [
    { text: "Хэрэглэгчдийн бодит сэтгэгдлийг цуглуулна.", mode: "CE" }, { text: "Өгөгдөл, явцыг дуугүй ажиглан тэмдэглэнэ.", mode: "RO" }, { text: "Анхны төсөөлөл хаана алдагдсаныг шинжилнэ.", mode: "AC" }, { text: "Нэг өөрчлөлт оруулаад дахин туршина.", mode: "AE" },
  ] },
  { contextual: true, prompt: "Шинэ санаагаа бусдад танилцуулахдаа…", answers: [
    { text: "Амьдралд ойр түүх, жишээнээс эхэлнэ.", mode: "CE" }, { text: "Асуулт асууж, хүмүүсийн хариуг сонсоно.", mode: "RO" }, { text: "Санааны үндэслэл, загварыг тайлбарлана.", mode: "AC" }, { text: "Богино туршилт, үзүүлэнгээр харуулна.", mode: "AE" },
  ] },
  { contextual: true, prompt: "Өөрийн хөгжлийн дараагийн алхмыг сонгохдоо…", answers: [
    { text: "Өмнөх туршлагаас надад юу чухал байсныг харна.", mode: "CE" }, { text: "Тайван эргэцүүлж, давтагдах хандлагаа анзаарна.", mode: "RO" }, { text: "Зорилго, чадварын цоорхойгоо тодорхойлно.", mode: "AC" }, { text: "Нэг шинэ дадлыг энэ долоо хоногт эхлүүлнэ.", mode: "AE" },
  ] },
  { contextual: true, prompt: "Танд тохирсон хөгжлийн ажилбар бол…", answers: [
    { text: "Хүнтэй ярилцаж, бодит туршлага солилцох.", mode: "CE" }, { text: "Өдрийн тэмдэглэл хөтөлж, эргэцүүлэх.", mode: "RO" }, { text: "Ном, загвар, кейс задлан судлах.", mode: "AC" }, { text: "Шинэ арга хэрэглээд үр дүнг нь шалгах.", mode: "AE" },
  ] },
];

const profiles: Profile[] = [
  { mode: "CE", name: "Эрэлхийлэгч", en: "Experiencing", summary: "Та бодит туршлага, хүмүүс, орчноо мэдэрч, шинэ зүйлийг эрэлхийлж байж суралцах утга учрыг олдог.", strengths: "Хүмүүстэй холбогдох, нөхцөлийн өнгө аясыг мэдрэх, шинэ туршлагад нээлттэй байх.", watch: "Тухайн мөчийн сэтгэгдэлд хэт түшиглэж, дүгнэлт хийх алхмыг алгасаж болзошгүй.", recommendation: "Туршлага бүрийн дараа “ямар зарчим энд ажиллав?” гэж асуугаарай." },
  { mode: "RO", name: "Эргэцүүлэгч", en: "Reflecting", summary: "Та ажиглаж, мэдээллийг тайван тунгаан, олон өнцгөөс харж утга учрыг нь аажмаар бүтээдэг.", strengths: "Анзаарах, сонсох, олон эх сурвалжийг нэгтгэн дүгнэх.", watch: "Бэлэн болохыг хүлээсээр эхлэх мөчийг алдах эрсдэлтэй.", recommendation: "Эргэцүүлснийхээ дараа дараагийн нэг тодорхой алхмыг товлоорой." },
  { mode: "AC", name: "Онолч", en: "Thinking", summary: "Та мэдээллийг бүтэц, учир шалтгаанаар нь ойлгож, логик загвар, баттай дүгнэлтэд хүрэхийг эрхэмлэдэг.", strengths: "Задлан шинжлэх, загварчлах, асуудлыг тодорхойлж чиглэл тогтоох.", watch: "Хэт төгс тайлбар эрэхдээ бодит туршлага, турших алхмаас холдож болзошгүй.", recommendation: "Санаагаа бодит жишээ эсвэл 30 минутын жижиг туршилтаар шалгаж хэвшээрэй." },
  { mode: "AE", name: "Идэвхтэн", en: "Acting", summary: "Та мэдлэгээ шууд хийж үзэж, туршилт, хэрэгжүүлэлтээр дамжуулан суралцахыг илүүд үздэг.", strengths: "Ажлыг эхлүүлж урагшлуулах, боломжийг туршиж үзэх, үр дүнд хүргэх.", watch: "Хэт хурдан эхэлбэл мэдээлэл, эрсдэлийг дутуу тооцож, үр дүнгээ эргэцүүлэх үе шат орхигдож болзошгүй.", recommendation: "Нэг ажил дууссаны дараа амжилт, өөрчлөх зүйлээ дүгнэх цаг гаргаарай." },
];

const emptyRanks = () => questions.map(() => [1, 2, 3, 4]);
const scoreRanks = (ranks: number[][], indices: number[]) => {
  const scores: Record<Mode, number> = { CE: 0, RO: 0, AC: 0, AE: 0 };
  indices.forEach((qIndex) => questions[qIndex].answers.forEach((answer, aIndex) => { scores[answer.mode] += 5 - ranks[qIndex][aIndex]; }));
  return scores;
};
// The style is the process with the highest core score; ties go to the earlier mode in CE → RO → AC → AE order.
const dominantMode = (scores: Record<Mode, number>) => (["CE", "RO", "AC", "AE"] as Mode[]).reduce((best, mode) => scores[mode] > scores[best] ? mode : best);

export default function Home() {
  const [screen, setScreen] = useState<"intro" | "quiz" | "result">("intro");
  const [current, setCurrent] = useState(0);
  const [ranks, setRanks] = useState<number[][]>(emptyRanks);
  const [restored, setRestored] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("surah-handle-v1");
      if (saved) {
        const data = JSON.parse(saved) as { screen?: "quiz"; current?: number; ranks?: number[][] };
        if (data.ranks?.length === questions.length) { setRanks(data.ranks); setCurrent(data.current || 0); setScreen(data.screen || "intro"); }
      }
    } catch { /* local storage can be unavailable */ }
    setRestored(true);
  }, []);
  useEffect(() => { if (restored && screen !== "result") localStorage.setItem("surah-handle-v1", JSON.stringify({ screen, current, ranks })); }, [screen, current, ranks, restored]);

  const core = useMemo(() => scoreRanks(ranks, Array.from({ length: 12 }, (_, i) => i)), [ranks]);
  const contextual = useMemo(() => scoreRanks(ranks, Array.from({ length: 8 }, (_, i) => i + 12)), [ranks]);
  const allScores = useMemo(() => scoreRanks(ranks, Array.from({ length: 20 }, (_, i) => i)), [ranks]);
  const profile = profiles.find((p) => p.mode === dominantMode(core)) || profiles[0];
  const q = questions[current];

  const setRank = (answerIndex: number, value: number) => setRanks((old) => old.map((row, qi) => {
    if (qi !== current) return row;
    const swap = row.indexOf(value);
    const next = [...row];
    next[swap] = row[answerIndex]; next[answerIndex] = value;
    return next;
  }));
  const start = () => setScreen("quiz");
  const finish = () => { localStorage.removeItem("surah-handle-v1"); setScreen("result"); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const retake = () => { setRanks(emptyRanks()); setCurrent(0); setScreen("intro"); localStorage.removeItem("surah-handle-v1"); window.scrollTo({ top: 0, behavior: "smooth" }); };

  async function shareResult() {
    const canvas = document.createElement("canvas"); canvas.width = 1200; canvas.height = 630;
    const c = canvas.getContext("2d"); if (!c) return;
    const g = c.createLinearGradient(0, 0, 1200, 630); g.addColorStop(0, "#172554"); g.addColorStop(.55, "#4f46e5"); g.addColorStop(1, "#db2777"); c.fillStyle = g; c.fillRect(0, 0, 1200, 630);
    c.fillStyle = "rgba(255,255,255,.13)"; c.beginPath(); c.arc(1060, 100, 240, 0, Math.PI * 2); c.fill(); c.beginPath(); c.arc(130, 620, 260, 0, Math.PI * 2); c.fill();
    c.fillStyle = "#c7d2fe"; c.font = "600 30px Arial"; c.fillText("ТУРШЛАГААР ДАМЖУУЛАН СУРАЛЦАХ", 82, 100);
    c.fillStyle = "white"; c.font = "700 68px Arial"; c.fillText(profile.name, 82, 205); c.font = "400 30px Arial";
    wrap(c, profile.summary, 82, 270, 900, 44);
    c.fillStyle = "#fef08a"; c.font = "700 30px Arial"; c.fillText(`Хамгийн өндөр оноо: ${profile.mode} · ${core[profile.mode]} / 48`, 82, 500);
    c.fillStyle = "rgba(255,255,255,.75)"; c.font = "400 25px Arial"; c.fillText("Энэ нь v1-ийн өөрийгөө эргэцүүлэх сорилын үр дүн юм.", 82, 555);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png")); if (!blob) return;
    const file = new File([blob], "surah-handlaga.png", { type: "image/png" });
    if (navigator.share && navigator.canShare?.({ files: [file] })) await navigator.share({ title: "Миний суралцах хандлага", files: [file] });
    else { const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "surah-handlaga.png"; a.click(); URL.revokeObjectURL(a.href); }
  }

  if (screen === "intro") return <main className="site-shell"><header className="topbar"><span className="brand-mark">С</span><span>Суралцах хандлага</span><span className="v1">v1.0</span></header><section className="hero"><div className="eyebrow">ӨӨРИЙГӨӨ ТАНЬЖ МЭДЭХ БОГИНО СОРИЛ</div><h1>Та шинэ зүйлтэй<br/><em>яаж</em> ажилладаг вэ?</h1><p>Туршлагаар дамжуулан суралцах дөрвөн үйл явцын аль нь танд илүү ойр байдгийг эргэцүүлж үзээрэй.</p><div className="hero-grid"><div><b>20</b><span>асуулт</span></div><div><b>8–10</b><span>минут</span></div><div><b>4</b><span>суралцах үйл явц</span></div></div><button className="primary" onClick={start}>Сорилыг эхлүүлэх <span>→</span></button><p className="fine">Оношлогоо биш, таны одоогийн хандлагыг эргэцүүлэх анхны хувилбар.</p></section><section className="intro-card"><div className="number">01</div><div><h2>Хэрхэн бөглөх вэ?</h2><p>Асуулт бүр дэх дөрвөн өгүүлбэрийг таны хувьд <b>хамгийн ойр (1)</b>-оос <b>хамгийн хол (4)</b> хүртэл эрэмбэлнэ. Сонголт бүр давхардахгүй.</p></div><div className="number">02</div><div><h2>Үр дүнгээ унших нь</h2><p>Эхний 12 асуулт таны үндсэн чиглэлийг, сүүлийн 8 асуулт бодит нөхцөл дэх хандлагыг харьцуулж өгнө.</p></div></section><footer>Колбын үзэл санаанаас сэдэвлэсэн, албан ёсны KELP үнэлгээ биш.</footer></main>;

  if (screen === "quiz") return <main className="site-shell quiz-shell"><header className="topbar"><button className="text-button" onClick={() => setScreen("intro")}>← Гарах</button><span>Суралцах хандлага</span><span>{current + 1} / 20</span></header><div className="progress"><i style={{ width: `${((current + 1) / questions.length) * 100}%` }} /></div><section className="question-wrap"><p className="section-tag">{q.contextual ? "НӨХЦӨЛ БАЙДЛЫН АСУУЛТ" : "ҮНДСЭН ХАНДЛАГА"}</p><h1>{q.prompt}</h1><p className="helper">Өгүүлбэр бүрт 1–4 гэсэн давхцахгүй эрэмбэ сонгоно уу.</p><div className="rank-list">{q.answers.map((answer, i) => <div className="answer-card" key={answer.text}><p>{answer.text}</p><div className="rank-controls" aria-label={`${i + 1}-р өгүүлбэрийн эрэмбэ`}>{[1, 2, 3, 4].map((n) => <button key={n} className={ranks[current][i] === n ? "chosen" : ""} onClick={() => setRank(i, n)} aria-label={`${n}-р эрэмбэ`}>{n}</button>)}</div></div>)}</div><div className="navigation"><button className="secondary" disabled={current === 0} onClick={() => setCurrent((n) => n - 1)}>← Өмнөх</button>{current === 19 ? <button className="primary" onClick={finish}>Үр дүнг харах →</button> : <button className="primary" onClick={() => { setCurrent((n) => n + 1); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Дараах →</button>}</div><p className="saved">✓ Хариулт тань энэ төхөөрөмжид автоматаар хадгалагдана.</p></section></main>;

  const coreRows: Mode[] = ["CE", "RO", "AC", "AE"];
  return <main className="site-shell results"><header className="topbar"><span className="brand-mark">С</span><span>Таны үр дүн</span><span className="v1">v1.0</span></header><section className="result-hero"><p className="eyebrow">ТАНЫ СУРАЛЦАХ ХАНДЛАГА</p><h1>{profile.name}</h1><p className="english">{profile.en}</p><p>{profile.summary}</p><button className="share-button" onClick={shareResult}>↗ Үр дүнгийн зураг хадгалах / хуваалцах</button></section><section className="result-section"><div className="profile-layout"><div className="matrix"><p className="matrix-title">Таны байрлал</p><div className="matrix-grid">{(["CE", "RO", "AE", "AC"] as Mode[]).map(mode => { const p = profiles.find(item => item.mode === mode)!; return <MatrixCell key={p.mode} p={p} active={p.mode === profile.mode}/>; })}</div><p className="axis-vertical">Суралцах мөчлөг: Эрэлхийлэгч → Эргэцүүлэгч → Онолч → Идэвхтэн</p></div><div className="profile-copy"><h2>Танд ажиглагдсан хандлага</h2><p><b>Давуу тал:</b> {profile.strengths}</p><p><b>Анхаарах зүйл:</b> {profile.watch}</p><p><b>Хөгжүүлэх санаа:</b> {profile.recommendation}</p></div></div></section><section className="result-section score-section"><div><p className="section-tag">20 АСУУЛТЫН НИЙТ ОНОО</p><h2>Дөрвөн үйл явцын зураглал</h2>{coreRows.map(mode => <ScoreBar key={mode} label={modeNames[mode]} value={allScores[mode]} max={80} />)}</div><div className="score-note"><p className="section-tag">ҮНДСЭН 12 АСУУЛТ</p><h2>Хэв маягийг тооцсон оноо</h2>{coreRows.map(mode => <div className="direction" key={mode}><span>{modeNames[mode]}</span><b>{core[mode]}</b></div>)}<p>Эхний 12 асуултад хамгийн өндөр оноо авсан үйл явц таны суралцах хэв маягийг тодорхойлно. Үйл явц бүрийн дээд оноо 48.</p></div></section><section className="result-section context-section"><p className="section-tag">СҮҮЛИЙН 8 АСУУЛТ</p><h2>Нөхцөл байдал дахь харьцуулалт</h2><p className="context-intro">Та бодит ажил, баг, шийдвэрийн жишээ дээр хэрхэн ханддагаа эндээс харж болно. Энэ нь үндсэн профайлыг солихгүй, харин түүнийг баяжуулна.</p><div className="context-grid">{coreRows.map(mode => <div className="compare" key={mode}><span>{mode}</span><b>{contextual[mode]}</b><small>{modeNames[mode].replace(/ \(.+/, "")}</small></div>)}</div></section><section className="disclaimer"><h2>Үр дүнгээ хэрхэн ашиглах вэ?</h2><p>Энэ үр дүн нь таны чадвар, оюуны түвшин, ирээдүйн амжилтыг хэмжихгүй. Хүн бүр нөхцөлөөсөө шалтгаалан дөрвөн үйл явцыг ашиглаж, туршлагаар дамжуулан суралцах арга барилаа тэлэх боломжтой.</p><button className="secondary" onClick={retake}>↻ Дахин бөглөх</button></section><footer>Колбын үзэл санаанаас сэдэвлэсэн анхны, өөрийгөө эргэцүүлэх сорил. Албан ёсны KELP үнэлгээ биш.</footer></main>;
}

function MatrixCell({ p, active }: { p: Profile; active: boolean }) { return <div className={`matrix-cell ${active ? "active" : ""}`}><span>{p.name}</span><small>{p.mode}</small>{active && <b>● Та энд</b>}</div>; }
function ScoreBar({ label, value, max }: { label: string; value: number; max: number }) { return <div className="score-row"><div><span>{label}</span><b>{value}</b></div><div className="bar"><i style={{ width: `${(value / max) * 100}%` }} /></div></div>; }
function wrap(c: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) { let line = ""; let yy = y; text.split(" ").forEach(word => { const test = `${line}${word} `; if (c.measureText(test).width > maxWidth && line) { c.fillText(line, x, yy); line = `${word} `; yy += lineHeight; } else line = test; }); c.fillText(line, x, yy); }
