"use client";

import { useEffect, useMemo, useState } from "react";
import { chapters, totalScenarios, type Chapter, type Scenario } from "./course-data";

type Mode = "learn" | "practice";

function normalize(value: string) {
  return value.replaceAll("'", '"').replace(/\s+/g, " ").toLowerCase();
}

export default function Home() {
  const [chapterId, setChapterId] = useState(chapters[0].id);
  const [mode, setMode] = useState<Mode>("learn");
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [code, setCode] = useState(chapters[0].scenarios[0].starter);
  const [output, setOutput] = useState("Ready. Complete the scenario, then run your solution.");
  const [completed, setCompleted] = useState<string[]>([]);
  const [openUnit, setOpenUnit] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [running, setRunning] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const chapter = chapters.find((item) => item.id === chapterId) ?? chapters[0];
  const scenario = chapter.scenarios[scenarioIndex] ?? chapter.scenarios[0];
  const scenarioKey = `${chapter.id}:${scenario.id}`;

  useEffect(() => {
    const saved = window.localStorage.getItem("pytrail-scenario-progress");
    if (saved) {
      try {
        setCompleted(JSON.parse(saved));
      } catch {
        setCompleted([]);
      }
    }
  }, []);

  const chapterCompleted = useMemo(
    () => completed.filter((key) => key.startsWith(`${chapter.id}:`)).length,
    [chapter.id, completed],
  );

  const overallPercent = Math.round((completed.length / totalScenarios) * 100);

  function openChapter(nextChapter: Chapter) {
    setChapterId(nextChapter.id);
    setMode("learn");
    setScenarioIndex(0);
    setOpenUnit(0);
    setCode(nextChapter.scenarios[0].starter);
    setOutput("Ready. Complete the scenario, then run your solution.");
    setShowHint(false);
    setShowSolution(false);
    setSidebarOpen(false);
  }

  function openScenario(index: number) {
    const bounded = Math.max(0, Math.min(index, chapter.scenarios.length - 1));
    const next = chapter.scenarios[bounded];
    setScenarioIndex(bounded);
    setCode(next.starter);
    setOutput("Ready. Complete the scenario, then run your solution.");
    setShowHint(false);
    setShowSolution(false);
    setMode("practice");
  }

  function runChallenge() {
    setRunning(true);
    setOutput("Running checks in the safe practice console…");
    window.setTimeout(() => {
      const source = normalize(code);
      const missing = scenario.checks.filter(
        (check) => !source.includes(normalize(check)),
      );

      if (missing.length === 0) {
        setOutput(`✓ All checks passed\n\n${scenario.output}`);
        const next = Array.from(new Set([...completed, scenarioKey]));
        setCompleted(next);
        window.localStorage.setItem(
          "pytrail-scenario-progress",
          JSON.stringify(next),
        );
      } else {
        setOutput(
          `Not quite yet — ${missing.length} requirement${missing.length === 1 ? "" : "s"} still need attention.\n\nReview the scenario, use the hint, and try again. No real machine or cloud account was changed.`,
        );
      }
      setRunning(false);
    }, 420);
  }

  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (
        mode === "practice" &&
        (event.metaKey || event.ctrlKey) &&
        event.key === "Enter"
      ) {
        event.preventDefault();
        runChallenge();
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  return (
    <main className="shell">
      <header className="topbar">
        <button
          className="mobile-menu"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Open course navigation"
        >
          ☰
        </button>
        <a className="brand" href="#top" aria-label="PyTrail home">
          <span className="brand-mark">P_</span>
          <span>PyTrail</span>
        </a>
        <div className="topbar-center">
          <span className="status-dot" />
          No login · progress stays on this device
        </div>
        <div className="progress-pill" title={`${overallPercent}% complete`}>
          <span>{completed.length}/{totalScenarios} scenarios</span>
          <span className="mini-progress">
            <i style={{ width: `${overallPercent}%` }} />
          </span>
        </div>
      </header>

      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-intro">
          <p className="eyebrow">ZERO TO AUTOMATION ENGINEER</p>
          <h2>6 chapters · 300 scenarios</h2>
          <p>Learn the concept. Study the practical. Solve the incident.</p>
        </div>

        <nav className="chapter-list" aria-label="Course chapters">
          {chapters.map((item) => {
            const done = completed.filter((key) =>
              key.startsWith(`${item.id}:`),
            ).length;
            return (
              <button
                key={item.id}
                className={`chapter-link ${chapter.id === item.id ? "active" : ""}`}
                onClick={() => openChapter(item)}
              >
                <span className="chapter-number">{item.number}</span>
                <span className="chapter-copy">
                  <b>{item.title}</b>
                  <small>{item.track} · {done}/50 complete</small>
                  <span className="chapter-progress">
                    <i style={{ width: `${done * 2}%` }} />
                  </span>
                </span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-note">
          <span>⌁</span>
          <p>
            <b>Safe by design</b>
            AWS uses boto3 patterns with mock responses. Credentials are never
            requested or stored.
          </p>
        </div>
      </aside>

      {sidebarOpen && (
        <button
          className="backdrop"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close navigation"
        />
      )}

      <section className="workspace" id="top">
        <div className="chapter-hero">
          <div>
            <p className="crumb">
              CHAPTER {chapter.number} / {chapter.track.toUpperCase()}
            </p>
            <h1>{chapter.title}</h1>
            <p>{chapter.description}</p>
            <div className="tool-row">
              {chapter.tools.map((tool) => (
                <span key={tool}>{tool}</span>
              ))}
            </div>
          </div>
          <div className="chapter-score">
            <strong>{chapterCompleted}</strong>
            <span>of 50 scenarios</span>
            <div><i style={{ width: `${chapterCompleted * 2}%` }} /></div>
          </div>
        </div>

        <div className="mode-switch" role="tablist" aria-label="Chapter sections">
          <button
            role="tab"
            aria-selected={mode === "learn"}
            className={mode === "learn" ? "active" : ""}
            onClick={() => setMode("learn")}
          >
            <span>01</span> Learn & practise
          </button>
          <button
            role="tab"
            aria-selected={mode === "practice"}
            className={mode === "practice" ? "active" : ""}
            onClick={() => setMode("practice")}
          >
            <span>02</span> Scenario bank <b>50</b>
          </button>
        </div>

        {mode === "learn" ? (
          <LearnView
            chapter={chapter}
            openUnit={openUnit}
            setOpenUnit={setOpenUnit}
            begin={() => openScenario(0)}
          />
        ) : (
          <PracticeView
            chapter={chapter}
            scenario={scenario}
            scenarioIndex={scenarioIndex}
            scenarioKey={scenarioKey}
            completed={completed}
            code={code}
            setCode={setCode}
            output={output}
            running={running}
            showHint={showHint}
            setShowHint={setShowHint}
            showSolution={showSolution}
            setShowSolution={setShowSolution}
            runChallenge={runChallenge}
            openScenario={openScenario}
          />
        )}
      </section>
    </main>
  );
}

function LearnView({
  chapter,
  openUnit,
  setOpenUnit,
  begin,
}: {
  chapter: Chapter;
  openUnit: number;
  setOpenUnit: (index: number) => void;
  begin: () => void;
}) {
  return (
    <div className="learn-layout">
      <section className="learning-intro">
        <p className="eyebrow">GUIDED CURRICULUM</p>
        <h2>
          {chapter.id === "python-mastery"
            ? "Start at zero. Finish with production Python."
            : "Understand the tools before solving incidents."}
        </h2>
        <p>
          Work through these practical units in order. Each concept includes a
          small implementation pattern you can reuse in the scenario bank.
        </p>
        <div className="level-key">
          <span><i className="basic" /> Basic</span>
          <span><i className="intermediate" /> Intermediate</span>
          <span><i className="advanced" /> Advanced</span>
        </div>
        <button className="primary-cta" onClick={begin}>
          Start 50 scenarios <span>→</span>
        </button>
      </section>

      <div className="unit-list">
        {chapter.units.map((unit, index) => (
          <article
            key={unit.title}
            className={`unit-card ${openUnit === index ? "open" : ""}`}
          >
            <button onClick={() => setOpenUnit(index)}>
              <span className={`unit-index ${unit.level.toLowerCase()}`}>
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>
                <small>{unit.level}</small>
                <b>{unit.title}</b>
              </span>
              <span className="unit-toggle">{openUnit === index ? "−" : "+"}</span>
            </button>
            {openUnit === index && (
              <div className="unit-detail">
                <p>{unit.concept}</p>
                <div className="practical-label">PRACTICAL PATTERN</div>
                <pre>{unit.practical}</pre>
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}

function PracticeView({
  chapter,
  scenario,
  scenarioIndex,
  scenarioKey,
  completed,
  code,
  setCode,
  output,
  running,
  showHint,
  setShowHint,
  showSolution,
  setShowSolution,
  runChallenge,
  openScenario,
}: {
  chapter: Chapter;
  scenario: Scenario;
  scenarioIndex: number;
  scenarioKey: string;
  completed: string[];
  code: string;
  setCode: (value: string) => void;
  output: string;
  running: boolean;
  showHint: boolean;
  setShowHint: (value: boolean) => void;
  showSolution: boolean;
  setShowSolution: (value: boolean) => void;
  runChallenge: () => void;
  openScenario: (index: number) => void;
}) {
  const isComplete = completed.includes(scenarioKey);

  return (
    <div className="practice-shell">
      <aside className="question-map">
        <div>
          <p className="eyebrow">QUESTION MAP</p>
          <b>Select a scenario</b>
        </div>
        <div className="question-grid">
          {chapter.scenarios.map((item, index) => {
            const done = completed.includes(`${chapter.id}:${item.id}`);
            return (
              <button
                key={item.id}
                className={`${index === scenarioIndex ? "active" : ""} ${done ? "done" : ""}`}
                onClick={() => openScenario(index)}
                aria-label={`Open scenario ${index + 1}`}
              >
                {done ? "✓" : index + 1}
              </button>
            );
          })}
        </div>
        <div className="question-legend">
          <span><i className="current" /> Current</span>
          <span><i className="finished" /> Passed</span>
        </div>
      </aside>

      <div className="challenge-area">
        <div className="scenario-nav">
          <button
            onClick={() => openScenario(scenarioIndex - 1)}
            disabled={scenarioIndex === 0}
          >
            ← Previous
          </button>
          <span>Scenario {scenarioIndex + 1} of 50</span>
          <button
            onClick={() => openScenario(scenarioIndex + 1)}
            disabled={scenarioIndex === 49}
          >
            Next →
          </button>
        </div>

        <div className="challenge-grid">
          <article className="brief">
            <div className="scenario-level">
              <span className={scenario.level.toLowerCase()}>{scenario.level}</span>
              <span>{chapter.track}</span>
              {isComplete && <span className="passed">✓ Passed</span>}
            </div>
            <h2>{scenario.title}</h2>
            <section className="situation-card">
              <p className="eyebrow">THE SITUATION</p>
              <p>{scenario.situation}</p>
            </section>
            <section className="task-card">
              <p className="eyebrow">YOUR TASK</p>
              <h3>{scenario.task}</h3>
              <ul>
                <li>Implement the requested production pattern</li>
                <li>Run the checks and study the feedback</li>
                <li>Compare with the reference after trying</li>
              </ul>
            </section>
            <div className="help-row">
              <button onClick={() => setShowHint(!showHint)}>
                ◎ {showHint ? "Hide hint" : "Give me a hint"}
              </button>
              <button onClick={() => setShowSolution(!showSolution)}>
                ◫ {showSolution ? "Hide solution" : "Reference solution"}
              </button>
            </div>
            {showHint && (
              <div className="reveal hint">
                <b>Hint</b>
                {scenario.hint}
              </div>
            )}
            {showSolution && (
              <div className="reveal solution">
                <b>Reference solution</b>
                <pre>{scenario.solution}</pre>
                <button
                  onClick={() => {
                    setCode(scenario.solution);
                    setShowSolution(false);
                  }}
                >
                  Use this code
                </button>
              </div>
            )}
          </article>

          <section className="playground" aria-label="Python playground">
            <div className="panel-bar">
              <div className="window-dots"><i /><i /><i /></div>
              <span>
                {chapter.id === "aws-boto3" ? "boto3_lab" : "scenario"}_
                {String(scenarioIndex + 1).padStart(2, "0")}.py
              </span>
              <span className="python-badge">PYTHON 3</span>
            </div>
            <div className="editor-wrap">
              <div className="line-rail" aria-hidden="true">
                {Array.from(
                  { length: Math.max(15, code.split("\n").length) },
                  (_, index) => <span key={index}>{index + 1}</span>,
                )}
              </div>
              <textarea
                aria-label="Python code editor"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                spellCheck={false}
              />
            </div>
            <div className="run-bar">
              <span>⌘/Ctrl + Enter to run</span>
              <button onClick={runChallenge} disabled={running}>
                <span>▶</span> {running ? "Running…" : "Run checks"}
              </button>
            </div>
            <div className="console">
              <div className="console-title">
                <span>SAFE PRACTICE CONSOLE</span>
              </div>
              <pre>{output}</pre>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
