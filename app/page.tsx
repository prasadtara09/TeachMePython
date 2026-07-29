"use client";

import { useEffect, useMemo, useState } from "react";

type Lesson = {
  id: string;
  track: "Python" | "OS" | "Linux" | "AWS" | "Azure" | "Capstone";
  number: string;
  title: string;
  duration: string;
  level: string;
  objective: string;
  concept: string;
  task: string;
  starter: string;
  solution: string;
  hint: string;
  checks: string[];
  output: string;
};

const lessons: Lesson[] = [
  {
    id: "hello-automation",
    track: "Python",
    number: "01",
    title: "Your first automation script",
    duration: "12 min",
    level: "Beginner",
    objective: "Use variables, strings, and print() to describe a server.",
    concept:
      "A script is a saved set of instructions. Variables hold values, and f-strings let you place those values inside readable messages.",
    task: 'Create variables named server and status, then print: "web-01 is healthy".',
    starter: `# Store information in variables\nserver = "web-01"\nstatus = "healthy"\n\n# Print the final message\n`,
    solution: `server = "web-01"\nstatus = "healthy"\nprint(f"{server} is {status}")`,
    hint: 'Use print(f"{server} is {status}")',
    checks: ["server", "status", "print(", 'f"'],
    output: "web-01 is healthy",
  },
  {
    id: "file-organizer",
    track: "OS",
    number: "02",
    title: "Organize files by extension",
    duration: "20 min",
    level: "Beginner",
    objective: "Meet pathlib and reason about files without changing your computer.",
    concept:
      "pathlib represents paths as objects. It makes file automation readable across macOS, Linux, and Windows.",
    task: "Loop over mock_files and print only the .log files.",
    starter: `from pathlib import Path\n\nmock_files = [Path("app.log"), Path("notes.txt"), Path("audit.log")]\n\n# Loop through the paths and print .log files\n`,
    solution: `from pathlib import Path\n\nmock_files = [Path("app.log"), Path("notes.txt"), Path("audit.log")]\n\nfor file in mock_files:\n    if file.suffix == ".log":\n        print(file.name)`,
    hint: 'A Path has a .suffix property. Compare it with ".log".',
    checks: ["for ", ".suffix", '== ".log"', "print("],
    output: "app.log\naudit.log",
  },
  {
    id: "disk-report",
    track: "OS",
    number: "03",
    title: "Build a disk usage report",
    duration: "18 min",
    level: "Beginner",
    objective: "Use functions, tuples, and readable percentage calculations.",
    concept:
      "Automation becomes reusable when logic lives in a function. The standard library already contains tools for common system jobs.",
    task: "Call shutil.disk_usage('/') and print the percentage used.",
    starter: `import shutil\n\n# Get total, used, and free disk space\n\n# Calculate and print the used percentage\n`,
    solution: `import shutil\n\ntotal, used, free = shutil.disk_usage("/")\npercent_used = used / total * 100\nprint(f"Disk used: {percent_used:.1f}%")`,
    hint: "Divide used by total, multiply by 100, then format to one decimal place.",
    checks: ["shutil.disk_usage", "used / total", "* 100", "print("],
    output: "Disk used: 42.7%\n(mock system data)",
  },
  {
    id: "service-checker",
    track: "Linux",
    number: "04",
    title: "Check a Linux service",
    duration: "25 min",
    level: "Intermediate",
    objective: "Run a command safely and inspect its result.",
    concept:
      "subprocess.run() is the standard bridge from Python to Linux commands. Passing a list is safer than building a shell string.",
    task: "Run systemctl is-active nginx with capture_output=True and text=True.",
    starter: `import subprocess\n\nresult = subprocess.run(\n    # Add the command as a list\n    \n)\nprint(result.stdout.strip())\n`,
    solution: `import subprocess\n\nresult = subprocess.run(\n    ["systemctl", "is-active", "nginx"],\n    capture_output=True,\n    text=True,\n    check=False,\n)\nprint(result.stdout.strip())`,
    hint: 'The command list is ["systemctl", "is-active", "nginx"].',
    checks: ["subprocess.run", '"systemctl"', '"is-active"', "capture_output=True", "text=True"],
    output: "active\n(mock Linux service)",
  },
  {
    id: "log-alerts",
    track: "Linux",
    number: "05",
    title: "Find errors in logs",
    duration: "22 min",
    level: "Intermediate",
    objective: "Read text line by line and filter important events.",
    concept:
      "Large logs should be processed one line at a time. Case normalization makes simple matching more dependable.",
    task: "Print each line from mock_log that contains ERROR, regardless of case.",
    starter: `mock_log = """INFO Server started\nERROR Database unavailable\nWARN Retry scheduled\nerror Cache connection failed"""\n\nfor line in mock_log.splitlines():\n    # Check and print error lines\n`,
    solution: `mock_log = """INFO Server started\nERROR Database unavailable\nWARN Retry scheduled\nerror Cache connection failed"""\n\nfor line in mock_log.splitlines():\n    if "ERROR" in line.upper():\n        print(line)`,
    hint: 'Convert each line with line.upper(), then use the "in" operator.',
    checks: [".splitlines()", "for ", ".upper()", '"ERROR" in', "print("],
    output: "ERROR Database unavailable\nerror Cache connection failed",
  },
  {
    id: "aws-inventory",
    track: "AWS",
    number: "06",
    title: "List EC2 instances safely",
    duration: "30 min",
    level: "Intermediate",
    objective: "Understand boto3 clients and nested cloud responses.",
    concept:
      "Cloud SDKs return dictionaries that mirror API responses. Start read-only, select a region explicitly, and never hard-code credentials.",
    task: "Create an EC2 client for ap-south-1 and call describe_instances().",
    starter: `import boto3\n\n# Credentials come from your environment or AWS profile\n# Create the EC2 client\n\n# Request the instance inventory\n`,
    solution: `import boto3\n\n# Credentials come from your environment or AWS profile\nec2 = boto3.client("ec2", region_name="ap-south-1")\nresponse = ec2.describe_instances()\nprint(response["Reservations"])`,
    hint: 'Use boto3.client("ec2", region_name="ap-south-1").',
    checks: ["boto3.client", '"ec2"', "region_name=", "describe_instances()"],
    output: "i-0a12bc34  running  ap-south-1a\ni-0d56ef78  stopped  ap-south-1b\n(mock AWS response)",
  },
  {
    id: "azure-vms",
    track: "Azure",
    number: "07",
    title: "Inventory Azure VMs",
    duration: "30 min",
    level: "Intermediate",
    objective: "Use default identity and iterate over virtual machines.",
    concept:
      "DefaultAzureCredential supports local CLI login and managed identity. This keeps secrets out of source code.",
    task: "Create ComputeManagementClient with a safe credential and loop over virtual_machines.list_all().",
    starter: `from azure.identity import DefaultAzureCredential\nfrom azure.mgmt.compute import ComputeManagementClient\n\ncredential = DefaultAzureCredential()\nsubscription_id = "from-environment"\n\n# Create a compute client and list VMs\n`,
    solution: `from azure.identity import DefaultAzureCredential\nfrom azure.mgmt.compute import ComputeManagementClient\n\ncredential = DefaultAzureCredential()\nsubscription_id = "from-environment"\ncompute = ComputeManagementClient(credential, subscription_id)\n\nfor vm in compute.virtual_machines.list_all():\n    print(vm.name, vm.location)`,
    hint: "The compute client needs credential first and subscription_id second.",
    checks: ["DefaultAzureCredential()", "ComputeManagementClient(", "virtual_machines.list_all()", "for ", "print("],
    output: "api-prod  centralindia\nworker-dev  southindia\n(mock Azure response)",
  },
  {
    id: "health-capstone",
    track: "Capstone",
    number: "08",
    title: "Multi-cloud health report",
    duration: "45 min",
    level: "Project",
    objective: "Combine functions, data, filtering, and a report.",
    concept:
      "Good automation separates data collection from reporting. Small functions are easier to test and safer to change.",
    task: "Complete unhealthy() so it returns services whose status is not healthy.",
    starter: `services = [\n    {"name": "linux-api", "status": "healthy"},\n    {"name": "aws-worker", "status": "stopped"},\n    {"name": "azure-web", "status": "healthy"},\n]\n\ndef unhealthy(items):\n    # Return only unhealthy services\n    pass\n\nfor service in unhealthy(services):\n    print(f"ALERT: {service['name']} is {service['status']}")\n`,
    solution: `services = [\n    {"name": "linux-api", "status": "healthy"},\n    {"name": "aws-worker", "status": "stopped"},\n    {"name": "azure-web", "status": "healthy"},\n]\n\ndef unhealthy(items):\n    return [item for item in items if item["status"] != "healthy"]\n\nfor service in unhealthy(services):\n    print(f"ALERT: {service['name']} is {service['status']}")`,
    hint: 'Use a list comprehension and keep items where status != "healthy".',
    checks: ["def unhealthy", "return ", '["status"]', '!= "healthy"', "print("],
    output: "ALERT: aws-worker is stopped",
  },
];

const tracks = ["All", "Python", "OS", "Linux", "AWS", "Azure", "Capstone"] as const;

function normalize(code: string) {
  return code.replaceAll("'", '"').replace(/\s+/g, " ").toLowerCase();
}

export default function Home() {
  const [activeId, setActiveId] = useState(lessons[0].id);
  const [code, setCode] = useState(lessons[0].starter);
  const [output, setOutput] = useState("Ready. Press Run when you finish the task.");
  const [completed, setCompleted] = useState<string[]>([]);
  const [track, setTrack] = useState<(typeof tracks)[number]>("All");
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [running, setRunning] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const active = lessons.find((lesson) => lesson.id === activeId) ?? lessons[0];
  const visibleLessons = useMemo(
    () => lessons.filter((lesson) => track === "All" || lesson.track === track),
    [track],
  );

  useEffect(() => {
    const saved = window.localStorage.getItem("pytrail-progress");
    if (saved) setCompleted(JSON.parse(saved));
  }, []);

  function selectLesson(lesson: Lesson) {
    setActiveId(lesson.id);
    setCode(lesson.starter);
    setOutput("Ready. Press Run when you finish the task.");
    setShowHint(false);
    setShowSolution(false);
    setSidebarOpen(false);
  }

  function runCode() {
    setRunning(true);
    setOutput("Running in the safe practice console…");
    window.setTimeout(() => {
      const source = normalize(code);
      const missing = active.checks.filter((check) => !source.includes(normalize(check)));

      if (missing.length === 0) {
        setOutput(`✓ All checks passed\n\n${active.output}`);
        const next = Array.from(new Set([...completed, active.id]));
        setCompleted(next);
        window.localStorage.setItem("pytrail-progress", JSON.stringify(next));
      } else {
        setOutput(
          `Not quite yet — ${missing.length} check${missing.length === 1 ? "" : "s"} still need attention.\n\nTry the hint, then run again. Your computer and cloud accounts were not touched.`,
        );
      }
      setRunning(false);
    }, 450);
  }

  function nextLesson() {
    const index = lessons.findIndex((lesson) => lesson.id === active.id);
    selectLesson(lessons[Math.min(index + 1, lessons.length - 1)]);
  }

  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
        event.preventDefault();
        runCode();
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  const progress = Math.round((completed.length / lessons.length) * 100);

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
          Safe sandbox · no credentials required
        </div>
        <div className="progress-pill" title={`${progress}% complete`}>
          <span>{completed.length}/{lessons.length} complete</span>
          <span className="mini-progress"><i style={{ width: `${progress}%` }} /></span>
        </div>
      </header>

      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-intro">
          <p className="eyebrow">LEARNING PATH</p>
          <h2>Automation from zero</h2>
          <p>Eight hands-on stops. One practical trail.</p>
        </div>
        <div className="track-tabs" aria-label="Filter lessons">
          {tracks.map((item) => (
            <button
              key={item}
              className={track === item ? "active" : ""}
              onClick={() => setTrack(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <nav className="lesson-list" aria-label="Course lessons">
          {visibleLessons.map((lesson) => (
            <button
              key={lesson.id}
              className={`lesson-link ${active.id === lesson.id ? "active" : ""}`}
              onClick={() => selectLesson(lesson)}
            >
              <span className="lesson-number">
                {completed.includes(lesson.id) ? "✓" : lesson.number}
              </span>
              <span>
                <b>{lesson.title}</b>
                <small>{lesson.track} · {lesson.duration}</small>
              </span>
            </button>
          ))}
        </nav>
        <div className="sidebar-note">
          <span>⌁</span>
          <p><b>Safety first</b>Cloud lessons return mock data. Real setup comes after the fundamentals.</p>
        </div>
      </aside>

      {sidebarOpen && <button className="backdrop" onClick={() => setSidebarOpen(false)} aria-label="Close navigation" />}

      <section className="workspace" id="top">
        <div className="lesson-header">
          <div>
            <p className="crumb">PATH / {active.track.toUpperCase()} / LESSON {active.number}</p>
            <h1>{active.title}</h1>
            <p className="objective">{active.objective}</p>
          </div>
          <div className="lesson-meta">
            <span>{active.level}</span>
            <span>◷ {active.duration}</span>
          </div>
        </div>

        <div className="content-grid">
          <article className="brief">
            <div className="concept-card">
              <span className="card-icon">⌘</span>
              <div>
                <p className="eyebrow">WHY THIS MATTERS</p>
                <p>{active.concept}</p>
              </div>
            </div>

            <section className="task-card">
              <div className="task-heading">
                <span>YOUR TASK</span>
                <span className="step-chip">Step {active.number} of 08</span>
              </div>
              <h2>{active.task}</h2>
              <ul>
                <li>Write or edit the code in the playground</li>
                <li>Run it and use the feedback to improve</li>
                <li>Pass all checks to save your progress</li>
              </ul>
            </section>

            <div className="help-row">
              <button onClick={() => setShowHint(!showHint)}>◎ {showHint ? "Hide hint" : "Give me a hint"}</button>
              <button onClick={() => setShowSolution(!showSolution)}>◫ {showSolution ? "Hide solution" : "Show solution"}</button>
            </div>
            {showHint && <div className="reveal hint"><b>Hint</b>{active.hint}</div>}
            {showSolution && (
              <div className="reveal solution">
                <b>Reference solution</b>
                <pre>{active.solution}</pre>
                <button onClick={() => { setCode(active.solution); setShowSolution(false); }}>Use this code</button>
              </div>
            )}
          </article>

          <section className="playground" aria-label="Python playground">
            <div className="panel-bar">
              <div className="window-dots"><i /><i /><i /></div>
              <span>lesson_{active.number}.py</span>
              <span className="python-badge">PYTHON 3</span>
            </div>
            <div className="editor-wrap">
              <div className="line-rail" aria-hidden="true">
                {Array.from({ length: Math.max(12, code.split("\n").length) }, (_, index) => <span key={index}>{index + 1}</span>)}
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
              <button onClick={runCode} disabled={running}>
                <span>▶</span> {running ? "Running…" : "Run code"}
              </button>
            </div>
            <div className="console">
              <div className="console-title">
                <span>CONSOLE</span>
                <button onClick={() => setOutput("")}>Clear</button>
              </div>
              <pre>{output || "Console cleared."}</pre>
            </div>
          </section>
        </div>

        <footer className="lesson-footer">
          <div>
            <span className={completed.includes(active.id) ? "complete-mark done" : "complete-mark"}>
              {completed.includes(active.id) ? "✓" : "○"}
            </span>
            <p><b>{completed.includes(active.id) ? "Lesson complete" : "Complete the challenge"}</b>
              <span>{completed.includes(active.id) ? "Progress saved on this device." : "Run your code to check your work."}</span>
            </p>
          </div>
          <button onClick={nextLesson} disabled={active.id === lessons.at(-1)?.id}>Next lesson <span>→</span></button>
        </footer>
      </section>
    </main>
  );
}
