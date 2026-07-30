"use client";

import {
  useEffect,
  useMemo,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import {
  chapters,
  totalCapstones,
  totalScenarios,
  type Chapter,
  type Scenario,
} from "./course-data";

type Mode = "learn" | "practice" | "capstone";

function normalize(value: string) {
  return value.replaceAll("'", '"').replace(/\s+/g, " ").toLowerCase();
}

type FunctionNote = { name: string; description: string };

const functionGlossary: Array<FunctionNote & { patterns: string[] }> = [
  { name: "print()", patterns: ["print("], description: "Writes a value to the terminal so a person, log collector, or pipeline can see the result." },
  { name: "int()", patterns: ["int("], description: "Converts a compatible string or number into an integer; invalid text raises ValueError." },
  { name: "dict.get()", patterns: ["counts.get(", "page.get("], description: "Reads a dictionary key and returns a safe default when that key is absent." },
  { name: "next()", patterns: ["next("], description: "Takes the next matching item from an iterator; its optional default prevents StopIteration." },
  { name: "Path()", patterns: ["path("], description: "Creates an object-oriented filesystem path that works consistently across operating systems." },
  { name: "Path.glob()/rglob()", patterns: [".glob(", ".rglob("], description: "Finds files whose names match a pattern; rglob also searches nested directories." },
  { name: "Path.mkdir()", patterns: [".mkdir("], description: "Creates a directory; parents=True creates missing parents and exist_ok=True makes repeated runs safe." },
  { name: "Path.stat()", patterns: [".stat()"], description: "Returns filesystem metadata such as size, permissions, and modification time." },
  { name: "Path.write_text()", patterns: [".write_text("], description: "Writes text to a file with an explicit encoding in one clear operation." },
  { name: "Path.exists()", patterns: [".exists()"], description: "Checks whether a path is present before code reads, changes, or removes it." },
  { name: "Path.unlink()", patterns: [".unlink()"], description: "Removes a file; guarding it with exists() makes cleanup repeatable." },
  { name: "Path.rename()", patterns: [".rename("], description: "Moves or renames the path to the supplied destination." },
  { name: "open()", patterns: ["with open("], description: "Opens a file as a context manager so Python closes it automatically, including after errors." },
  { name: "shutil.copy2()", patterns: ["shutil.copy2("], description: "Copies a file while preserving useful metadata such as modification times." },
  { name: "shutil.disk_usage()", patterns: ["shutil.disk_usage("], description: "Returns total, used, and free bytes for a filesystem path." },
  { name: "json.load()/loads()", patterns: ["json.load(", "json.loads("], description: "Parses JSON data into Python dictionaries, lists, strings, and numbers." },
  { name: "json.dumps()", patterns: ["json.dumps("], description: "Serializes Python data into a JSON string suitable for logs or APIs." },
  { name: "csv.DictWriter()", patterns: ["csv.dictwriter("], description: "Writes dictionaries as CSV rows using named columns." },
  { name: "ZipFile()", patterns: ["zipfile(", "zipfile("], description: "Opens or creates a ZIP archive as a context manager." },
  { name: "hashlib.sha256()", patterns: ["hashlib.sha256("], description: "Creates a SHA-256 hash object used to verify that bytes have not changed." },
  { name: "os.replace()", patterns: ["os.replace("], description: "Atomically replaces the destination with a completed temporary file, avoiding partial writes." },
  { name: "os.environ.get()", patterns: ["os.environ.get("], description: "Reads configuration from the environment without embedding it in source code." },
  { name: "os.kill()", patterns: ["os.kill("], description: "Sends a Unix signal to a process by PID." },
  { name: "subprocess.run()", patterns: ["subprocess.run("], description: "Runs a command and waits for it to finish; argument lists avoid shell-string injection." },
  { name: "subprocess.Popen()", patterns: ["subprocess.popen("], description: "Starts a process without waiting immediately, allowing output to be streamed while it runs." },
  { name: "asyncio.gather()", patterns: ["asyncio.gather("], description: "Schedules multiple awaitable operations together and collects their results in order." },
  { name: "asyncio.run()", patterns: ["asyncio.run("], description: "Creates an event loop, runs the top-level coroutine, and closes the loop cleanly." },
  { name: "yield", patterns: ["yield "], description: "Produces one item at a time from a generator, avoiding a large in-memory result list." },
  { name: "@contextmanager", patterns: ["@contextmanager"], description: "Turns a generator with setup, yield, and cleanup logic into a with-statement context manager." },
  { name: "@dataclass", patterns: ["@dataclass"], description: "Generates common class methods automatically for a typed data record." },
  { name: "ArgumentParser()", patterns: ["argparse.argumentparser("], description: "Defines a command-line interface and its accepted options." },
  { name: "parse_args()", patterns: [".parse_args("], description: "Reads command-line input and returns the validated argument values." },
  { name: "logging.getLogger()", patterns: ["getlogger("], description: "Creates or retrieves a named logger so messages have a consistent source." },
  { name: "time.sleep()", patterns: ["time.sleep("], description: "Pauses before another attempt; an exponential expression increases the delay after repeated failures." },
  { name: "ThreadPoolExecutor()", patterns: ["threadpoolexecutor("], description: "Runs a bounded number of blocking operations concurrently using worker threads." },
  { name: "unittest.mock.patch()", patterns: ["with patch("], description: "Temporarily replaces a dependency so tests do not call real systems." },
  { name: "sys.exit()", patterns: ["sys.exit("], description: "Ends the program with a meaningful status code that shells and CI systems can interpret." },
  { name: "boto3.client()", patterns: ["boto3.client("], description: "Creates a low-level AWS service client using the active profile, role, or environment credential chain." },
  { name: "boto3.Session()", patterns: ["boto3.session("], description: "Creates an isolated AWS SDK session, commonly from a profile or temporary assumed-role credentials." },
  { name: "get_paginator()", patterns: ["get_paginator("], description: "Creates a boto3 paginator so every page of a large AWS API result is processed." },
  { name: "paginate()", patterns: [".paginate("], description: "Requests successive AWS result pages without manually managing continuation tokens." },
  { name: "describe_instances()", patterns: ["describe_instances("], description: "Calls the EC2 API to retrieve instance inventory, optionally narrowed with server-side filters." },
  { name: "put_metric_data()", patterns: ["put_metric_data("], description: "Publishes custom metric values to an Amazon CloudWatch namespace." },
  { name: "get_caller_identity()", patterns: ["get_caller_identity("], description: "Uses AWS STS to report the account and ARN for the active execution identity." },
  { name: "upload_file()", patterns: [".upload_file("], description: "Uploads a local file to S3 and supports transfer options such as server-side encryption." },
  { name: "get_waiter()/wait()", patterns: ["get_waiter("], description: "Uses boto3's built-in polling rules to wait until an AWS resource reaches a target state." },
  { name: "assume_role()", patterns: ["assume_role("], description: "Requests temporary STS credentials for an approved IAM role, avoiding long-lived cross-account keys." },
  { name: "DefaultAzureCredential()", patterns: ["defaultazurecredential("], description: "Tries safe Azure identity sources in order, including local CLI login and managed identity." },
  { name: "ComputeManagementClient()", patterns: ["computemanagementclient("], description: "Creates an authenticated Azure client for virtual-machine management operations." },
  { name: "ResourceManagementClient()", patterns: ["resourcemanagementclient("], description: "Creates an Azure client for resource groups and subscription resources." },
  { name: "BlobServiceClient()", patterns: ["blobserviceclient("], description: "Connects to an Azure Storage account using the supplied account URL and credential." },
  { name: "MetricsQueryClient()", patterns: ["metricsqueryclient("], description: "Creates an Azure Monitor client for querying resource metrics." },
  { name: "SecretClient()", patterns: ["secretclient("], description: "Creates an authenticated Azure Key Vault client for controlled secret access." },
  { name: "poller.result()", patterns: ["poller.result("], description: "Waits for an Azure long-running operation to complete and surfaces any failure." },
];

function explainFunctions(solution: string): FunctionNote[] {
  const source = normalize(solution);
  const matches = functionGlossary.filter((entry) =>
    entry.patterns.some((pattern) => source.includes(pattern)),
  );
  return matches.length
    ? matches.map(({ name, description }) => ({ name, description }))
    : [{
        name: "Python control flow",
        description:
          "The statements combine values, conditions, loops, or returns to transform the scenario input into the required result.",
      }];
}

function describeLearningResult(unit: Chapter["units"][number]): string {
  const source = normalize(unit.practical);
  if (source.includes("print(")) {
    return "Python evaluates the variables and expressions first, then print() sends the formatted operational result to the terminal.";
  }
  if (source.includes("return ")) {
    return "The function receives the supplied input, applies the decision or transformation, and returns a reusable result to its caller.";
  }
  if (source.includes("path(") || source.includes(".rglob(")) {
    return "The pathlib objects resolve and inspect filesystem locations without hard-coded string concatenation, producing portable path data.";
  }
  if (source.includes("subprocess.run(")) {
    return "The command is passed as a safe argument list, Python waits for the bounded operation, and the result exposes its status and output.";
  }
  if (source.includes("boto3") || source.includes("client(")) {
    return "The SDK builds an authenticated service client from the active identity chain, then the requested API operation returns structured resource data.";
  }
  if (source.includes("azure") || source.includes("defaultazurecredential(")) {
    return "Azure's credential chain supplies an approved identity, and the SDK client uses it to read or operate on the requested resource.";
  }
  if (source.includes("asyncio") || source.includes("await ")) {
    return "The coroutine yields while I/O is waiting, allowing other operations to progress before their results are collected together.";
  }
  return `The pattern applies the ${unit.title.toLowerCase()} concept to operational input and produces a reusable building block for later scenarios.`;
}

export default function Home() {
  const [chapterId, setChapterId] = useState(chapters[0].id);
  const [mode, setMode] = useState<Mode>("learn");
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [capstoneIndex, setCapstoneIndex] = useState(0);
  const [code, setCode] = useState(chapters[0].scenarios[0].starter);
  const [output, setOutput] = useState("Ready. Complete the scenario, then run your solution.");
  // Progress is intentionally kept only in memory. Refreshing the page or
  // restarting the container always creates a clean playground.
  const [completed, setCompleted] = useState<string[]>([]);
  const [openUnit, setOpenUnit] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [running, setRunning] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const chapter = chapters.find((item) => item.id === chapterId) ?? chapters[0];
  const scenario = chapter.scenarios[scenarioIndex] ?? chapter.scenarios[0];
  const scenarioKey = `${chapter.id}:${scenario.id}`;

  const chapterCompleted = useMemo(
    () => completed.filter((key) => key.startsWith(`${chapter.id}:`)).length,
    [chapter.id, completed],
  );

  const overallPercent = Math.round((completed.length / totalScenarios) * 100);

  function openChapter(nextChapter: Chapter) {
    setChapterId(nextChapter.id);
    setMode("learn");
    setScenarioIndex(0);
    setCapstoneIndex(0);
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
          No login · progress resets on refresh
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
          <h2>6 chapters · {totalScenarios} scenarios · {totalCapstones} capstones</h2>
          <p>Learn the concept. Solve the incident. Build the production project.</p>
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
                  <small>{item.track} · {done}/{item.scenarios.length} complete</small>
                  <span className="chapter-progress">
                    <i style={{ width: `${(done / item.scenarios.length) * 100}%` }} />
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
            <span>of {chapter.scenarios.length} scenarios</span>
            <div>
              <i
                style={{
                  width: `${(chapterCompleted / chapter.scenarios.length) * 100}%`,
                }}
              />
            </div>
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
            <span>02</span> Scenario bank <b>{chapter.scenarios.length}</b>
          </button>
          <button
            role="tab"
            aria-selected={mode === "capstone"}
            className={mode === "capstone" ? "active" : ""}
            onClick={() => setMode("capstone")}
          >
            <span>03</span> DevOps/SRE capstones <b>{chapter.capstones.length}</b>
          </button>
        </div>

        {mode === "learn" ? (
          <LearnView
            chapter={chapter}
            openUnit={openUnit}
            setOpenUnit={setOpenUnit}
            beginScenarios={() => openScenario(0)}
            beginCapstones={() => setMode("capstone")}
          />
        ) : mode === "practice" ? (
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
        ) : (
          <CapstoneView
            chapter={chapter}
            capstoneIndex={capstoneIndex}
            setCapstoneIndex={setCapstoneIndex}
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
  beginScenarios,
  beginCapstones,
}: {
  chapter: Chapter;
  openUnit: number;
  setOpenUnit: (index: number) => void;
  beginScenarios: () => void;
  beginCapstones: () => void;
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
          Work through these lessons in order. Every lesson now explains the
          implementation steps, what each function does, how the result is
          produced, and what to practise before entering the scenario bank.
        </p>
        <div className="learning-summary">
          <div><strong>{chapter.units.length}</strong><span>guided lessons</span></div>
          <div><strong>{chapter.scenarios.length}</strong><span>unique scenarios</span></div>
          <div><strong>{chapter.capstones.length}</strong><span>capstones</span></div>
        </div>
        <div className="level-key">
          <span><i className="basic" /> Basic</span>
          <span><i className="intermediate" /> Intermediate</span>
          <span><i className="advanced" /> Advanced</span>
        </div>
        <div className="learning-actions">
          <button className="primary-cta" onClick={beginScenarios}>
            Start {chapter.scenarios.length} scenarios <span>→</span>
          </button>
          <button className="secondary-cta" onClick={beginCapstones}>
            Open {chapter.capstones.length} capstones <span>→</span>
          </button>
        </div>
      </section>

      <div className="unit-list">
        {chapter.units.map((unit, index) => {
          const functionNotes = explainFunctions(unit.practical);
          return (
            <article
              key={unit.title}
              className={`unit-card ${openUnit === index ? "open" : ""}`}
            >
              <button
                onClick={() => setOpenUnit(openUnit === index ? -1 : index)}
                aria-expanded={openUnit === index}
              >
                <span className={`unit-index ${unit.level.toLowerCase()}`}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>
                  <small>{unit.level} · LESSON {index + 1}</small>
                  <b>{unit.title}</b>
                </span>
                <span className="unit-toggle">{openUnit === index ? "−" : "+"}</span>
              </button>
              {openUnit === index && (
                <div className="unit-detail">
                  <section className="lesson-concept">
                    <div className="practical-label">WHAT YOU WILL LEARN</div>
                    <p>{unit.concept}</p>
                  </section>

                  <section className="lesson-steps">
                    <div className="practical-label">STEP-BY-STEP</div>
                    <ol>
                      <li><b>Understand the input.</b> Identify the resource, value, or operational state the pattern receives.</li>
                      <li><b>Apply the Python operation.</b> Follow the practical pattern and keep one clear responsibility.</li>
                      <li><b>Observe the result.</b> Run it, inspect the returned value or output, and change one input.</li>
                      <li><b>Productionize it.</b> Add validation, logging, dry-run behavior, or a focused test.</li>
                    </ol>
                  </section>

                  <div className="practical-label">PRACTICAL PATTERN</div>
                  <pre>{unit.practical}</pre>

                  <section className="learning-explanation">
                    <h4>What each function does</h4>
                    <dl>
                      {functionNotes.map((note) => (
                        <div key={note.name}>
                          <dt>{note.name}</dt>
                          <dd>{note.description}</dd>
                        </div>
                      ))}
                    </dl>
                    <h4>How this result is achieved</h4>
                    <p>{describeLearningResult(unit)}</p>
                  </section>

                  <section className="practice-mission">
                    <div>
                      <span>YOUR PRACTICE</span>
                      <b>Run → change → harden</b>
                    </div>
                    <ul>
                      <li>Run the example and explain each line in your own words.</li>
                      <li>Change the resource name, threshold, path, or input and predict the result.</li>
                      <li>Add one production control, then compare it with the scenario-bank solution.</li>
                    </ul>
                  </section>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}

function CapstoneView({
  chapter,
  capstoneIndex,
  setCapstoneIndex,
}: {
  chapter: Chapter;
  capstoneIndex: number;
  setCapstoneIndex: (index: number) => void;
}) {
  const project = chapter.capstones[capstoneIndex] ?? chapter.capstones[0];
  const functionNotes = explainFunctions(project.solution);

  return (
    <div className="capstone-layout">
      <aside className="capstone-menu">
        <p className="eyebrow">REAL-TIME PROJECT LAB</p>
        <h2>Operate like the on-call engineer</h2>
        <p>
          Build each project as a small production repository. Start with the
          incident, implement the stages, test the failure paths, and use the
          acceptance criteria as your final review.
        </p>
        <div className="capstone-picker" aria-label="Select a capstone project">
          {chapter.capstones.map((item, index) => (
            <button
              key={item.id}
              className={capstoneIndex === index ? "active" : ""}
              onClick={() => setCapstoneIndex(index)}
            >
              <span>PROJECT {index + 1}</span>
              <b>{item.title}</b>
            </button>
          ))}
        </div>
      </aside>

      <article className="capstone-project">
        <div className="capstone-heading">
          <div>
            <p className="eyebrow">CAPSTONE {capstoneIndex + 1} · ADVANCED</p>
            <h2>{project.title}</h2>
          </div>
          <span>{chapter.track}</span>
        </div>

        <section className="capstone-incident">
          <div>
            <small>YOUR ROLE</small>
            <p>{project.role}</p>
          </div>
          <div>
            <small>PRODUCTION INCIDENT</small>
            <p>{project.incident}</p>
          </div>
        </section>

        <section className="capstone-section">
          <p className="eyebrow">THE MISSION</p>
          <h3>{project.mission}</h3>
          <div className="capstone-skills">
            {project.skills.map((skill) => <span key={skill}>{skill}</span>)}
          </div>
        </section>

        <section className="capstone-section">
          <p className="eyebrow">DELIVERABLES</p>
          <ul className="capstone-checklist">
            {project.deliverables.map((deliverable) => (
              <li key={deliverable}>{deliverable}</li>
            ))}
          </ul>
        </section>

        <section className="capstone-section">
          <p className="eyebrow">IMPLEMENTATION PLAN</p>
          <div className="capstone-stages">
            {project.stages.map((stage, index) => (
              <div key={stage.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h4>{stage.title}</h4>
                  <p>{stage.details}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="capstone-section">
          <p className="eyebrow">DEFINITION OF DONE</p>
          <ul className="acceptance-list">
            {project.acceptance.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </section>

        <section className="capstone-reference">
          <p className="eyebrow">REFERENCE BLUEPRINT</p>
          <pre>{project.solution}</pre>
          <div className="explanation-block">
            <h4>What each function does</h4>
            <dl>
              {functionNotes.map((note) => (
                <div key={note.name}>
                  <dt>{note.name}</dt>
                  <dd>{note.description}</dd>
                </div>
              ))}
            </dl>
            <h4>How this result is achieved</h4>
            <p>
              The blueprint separates collection, decision, action, and
              verification so each failure can be tested safely. Completing the
              deliverables and acceptance checks produces this operational result:
              <code>{project.result}</code>
            </p>
          </div>
        </section>
      </article>
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
  const functionNotes = explainFunctions(scenario.solution);

  function updateEditor(
    editor: HTMLTextAreaElement,
    nextCode: string,
    selectionStart: number,
    selectionEnd = selectionStart,
  ) {
    setCode(nextCode);
    window.requestAnimationFrame(() => {
      editor.focus();
      editor.setSelectionRange(selectionStart, selectionEnd);
    });
  }

  function handleEditorKeyDown(
    event: ReactKeyboardEvent<HTMLTextAreaElement>,
  ) {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      return;
    }

    const editor = event.currentTarget;
    const start = editor.selectionStart;
    const end = editor.selectionEnd;

    if (event.key === "Enter") {
      event.preventDefault();
      const lineStart = code.lastIndexOf("\n", start - 1) + 1;
      const textBeforeCursor = code.slice(lineStart, start);
      const currentIndent = textBeforeCursor.match(/^[\t ]*/)?.[0] ?? "";
      const opensPythonBlock = /:\s*(?:#.*)?$/.test(textBeforeCursor);
      const indentation = currentIndent + (opensPythonBlock ? "    " : "");
      const insertion = `\n${indentation}`;
      const nextCode = code.slice(0, start) + insertion + code.slice(end);
      const nextCursor = start + insertion.length;
      updateEditor(editor, nextCode, nextCursor);
      return;
    }

    if (event.key !== "Tab") {
      return;
    }

    event.preventDefault();
    const selectedText = code.slice(start, end);
    const hasMultipleLines = selectedText.includes("\n");

    if (!hasMultipleLines && start === end) {
      if (!event.shiftKey) {
        const insertion = "    ";
        const nextCode = code.slice(0, start) + insertion + code.slice(end);
        updateEditor(editor, nextCode, start + insertion.length);
        return;
      }

      const lineStart = code.lastIndexOf("\n", start - 1) + 1;
      const lineText = code.slice(lineStart);
      const removable = lineText.match(/^(?: {1,4}|\t)/)?.[0] ?? "";
      if (removable) {
        const nextCode =
          code.slice(0, lineStart) +
          code.slice(lineStart + removable.length);
        updateEditor(
          editor,
          nextCode,
          Math.max(lineStart, start - removable.length),
        );
      }
      return;
    }

    const blockStart = code.lastIndexOf("\n", start - 1) + 1;
    const selectionTouchesNextLine = end > start && code[end - 1] === "\n";
    const searchFrom = selectionTouchesNextLine ? end - 1 : end;
    const followingBreak = code.indexOf("\n", searchFrom);
    const blockEnd = followingBreak === -1 ? code.length : followingBreak;
    const block = code.slice(blockStart, blockEnd);
    const lines = block.split("\n");

    if (event.shiftKey) {
      let removedBeforeStart = 0;
      let removedTotal = 0;
      const nextBlock = lines
        .map((line, index) => {
          const removable = line.match(/^(?: {1,4}|\t)/)?.[0] ?? "";
          if (index === 0) {
            removedBeforeStart = removable.length;
          }
          removedTotal += removable.length;
          return line.slice(removable.length);
        })
        .join("\n");
      const nextCode =
        code.slice(0, blockStart) + nextBlock + code.slice(blockEnd);
      updateEditor(
        editor,
        nextCode,
        Math.max(blockStart, start - removedBeforeStart),
        Math.max(blockStart, end - removedTotal),
      );
      return;
    }

    const nextBlock = lines.map((line) => `    ${line}`).join("\n");
    const nextCode =
      code.slice(0, blockStart) + nextBlock + code.slice(blockEnd);
    updateEditor(
      editor,
      nextCode,
      start + 4,
      end + lines.length * 4,
    );
  }

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
          <span>Scenario {scenarioIndex + 1} of {chapter.scenarios.length}</span>
          <button
            onClick={() => openScenario(scenarioIndex + 1)}
            disabled={scenarioIndex === chapter.scenarios.length - 1}
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
                <div className="explanation-block">
                  <h4>What each function does</h4>
                  <dl>
                    {functionNotes.map((note) => (
                      <div key={note.name}>
                        <dt>{note.name}</dt>
                        <dd>{note.description}</dd>
                      </div>
                    ))}
                  </dl>
                  <h4>How this result is achieved</h4>
                  <p>
                    The code applies these operations to the scenario&apos;s
                    provided input, then follows the requested decision or data
                    flow. That produces the safe practice result:
                    <code>{scenario.output}</code>
                  </p>
                </div>
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
                onKeyDown={handleEditorKeyDown}
                spellCheck={false}
              />
            </div>
            <div className="run-bar">
              <span>Enter: auto-indent · Tab: 4 spaces · ⌘/Ctrl + Enter: run</span>
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
