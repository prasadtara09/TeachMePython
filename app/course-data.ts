export type TeachingUnit = {
  title: string;
  level: "Basic" | "Intermediate" | "Advanced";
  concept: string;
  practical: string;
};

export type Scenario = {
  id: string;
  title: string;
  level: "Basic" | "Intermediate" | "Advanced";
  situation: string;
  task: string;
  starter: string;
  solution: string;
  hint: string;
  checks: string[];
  output: string;
};

export type Capstone = {
  id: string;
  title: string;
  role: string;
  incident: string;
  mission: string;
  skills: string[];
  deliverables: string[];
  stages: Array<{ title: string; details: string }>;
  acceptance: string[];
  solution: string;
  result: string;
};

export type Chapter = {
  id: string;
  number: string;
  track: string;
  title: string;
  description: string;
  tools: string[];
  units: TeachingUnit[];
  scenarios: Scenario[];
  capstones: Capstone[];
};

type ScenarioSeed = Omit<Scenario, "id" | "situation"> & {
  situation: (context: string, iteration: number) => string;
};

const contexts = [
  "an SRE team operating a production Kubernetes platform",
  "a platform engineering team managing an internal developer platform",
  "a DevOps team maintaining a multi-account cloud landing zone",
  "an on-call team supporting a highly available API platform",
  "a release engineering team operating enterprise CI/CD pipelines",
  "a platform team managing a production Kubernetes cluster fleet",
  "an observability team operating metrics, logs, traces, and alerting",
  "a GitOps team maintaining infrastructure-as-code delivery workflows",
  "an SRE incident-response program reducing operational toil",
  "a network platform team supporting ingress, DNS, and service connectivity",
];

type ScenarioObjective = {
  label: string;
  situation: string;
  task: string;
  starter: string;
  solution: string;
  hint: string;
  checks: string[];
  output: string;
};

const scenarioObjectives: ScenarioObjective[] = [
  {
    label: "Validate production input",
    situation: "The automation must reject missing operational input before it performs any work.",
    task: "Add validate_production_input(value), raise ValueError for None, and validate the primary input.",
    starter: "\n# Add an input-validation boundary before processing\n",
    solution: `def validate_production_input(value):
    if value is None:
        raise ValueError("required operational input is missing")
    return value`,
    hint: "Validate at the boundary and raise a specific error before the main operation.",
    checks: ["def validate_production_input", "is none", "raise valueerror"],
    output: "Production input validation passed",
  },
  {
    label: "Add structured observability",
    situation: "On-call engineers need a searchable completion event with the owning platform context.",
    task: "Create a named logger and emit automation_check_complete with context in extra.",
    starter: "\n# Emit a structured completion log for the on-call team\n",
    solution: `import logging
logger = logging.getLogger("platform_automation")
logger.info(
    "automation_check_complete",
    extra={"platform_context": "{{context}}"},
)`,
    hint: "Use logging.getLogger() and pass structured fields through extra.",
    checks: ["logging.getlogger(", "logger.info(", "extra="],
    output: "Structured completion event emitted",
  },
  {
    label: "Introduce dry-run safety",
    situation: "The team requires a preview that proves what would happen without changing external state.",
    task: "Make dry_run default to True and print an explicit preview message when it is enabled.",
    starter: "\n# Add a dry-run safeguard that defaults to safe preview mode\n",
    solution: `dry_run = True
if dry_run:
    print("DRY RUN: no external change applied")`,
    hint: "Default the flag to True and place the preview behavior under an if condition.",
    checks: ["dry_run = true", "if dry_run", "dry run"],
    output: "Dry-run verified; no external change applied",
  },
  {
    label: "Implement bounded retries",
    situation: "A transient platform API failure must be retried without creating an infinite loop.",
    task: "Add with_retry(operation, attempts=3), retry RuntimeError, and re-raise after the final attempt.",
    starter: "\n# Add a bounded retry wrapper for transient failures\n",
    solution: `def with_retry(operation, attempts=3):
    for attempt in range(attempts):
        try:
            return operation()
        except RuntimeError:
            if attempt == attempts - 1:
                raise`,
    hint: "Use range(attempts), catch only the transient error, and re-raise on the last loop.",
    checks: ["def with_retry", "range(attempts)", "except runtimeerror", "raise"],
    output: "Transient failures are bounded to three attempts",
  },
  {
    label: "Enforce a timeout budget",
    situation: "The CI/CD job must fail predictably instead of waiting forever for an operational dependency.",
    task: "Define TIMEOUT_SECONDS=30 and add within_timeout(elapsed_seconds) to enforce the budget.",
    starter: "\n# Add a 30-second execution budget\n",
    solution: `TIMEOUT_SECONDS = 30

def within_timeout(elapsed_seconds):
    return elapsed_seconds <= TIMEOUT_SECONDS`,
    hint: "Keep the timeout in one named constant and compare elapsed time against it.",
    checks: ["timeout_seconds = 30", "def within_timeout", "<= timeout_seconds"],
    output: "Thirty-second timeout budget enforced",
  },
  {
    label: "Produce JSON evidence",
    situation: "The pipeline needs a machine-readable artifact for audit and troubleshooting.",
    task: "Create an evidence dictionary with control, context, and status, then serialize it with json.dumps().",
    starter: "\n# Produce machine-readable evidence for the pipeline\n",
    solution: `import json
evidence = {
    "control": "{{topic}}",
    "context": "{{context}}",
    "status": "passed",
}
print(json.dumps(evidence, sort_keys=True))`,
    hint: "Build a dictionary first, then serialize it with json.dumps().",
    checks: ["import json", "evidence = {", "json.dumps(", "sort_keys=true"],
    output: "JSON evidence artifact produced",
  },
  {
    label: "Record a UTC audit trail",
    situation: "The incident timeline requires a timezone-aware record of when the automation decision was made.",
    task: "Create an audit_record containing a UTC ISO-8601 timestamp, action, and platform context.",
    starter: "\n# Record a timezone-aware audit event\n",
    solution: `from datetime import datetime, timezone
audit_record = {
    "timestamp": datetime.now(timezone.utc).isoformat(),
    "action": "{{topic}}",
    "context": "{{context}}",
}
print(audit_record)`,
    hint: "Use datetime.now(timezone.utc).isoformat() so the timestamp is unambiguous.",
    checks: ["datetime.now(timezone.utc)", ".isoformat()", "audit_record"],
    output: "UTC audit record created",
  },
  {
    label: "Expose a controlled CLI",
    situation: "Platform engineers must run the automation consistently from a terminal and CI runner.",
    task: "Use argparse to require --environment, add --dry-run, and parse the command-line arguments.",
    starter: "\n# Expose the automation through a validated CLI\n",
    solution: `import argparse
parser = argparse.ArgumentParser()
parser.add_argument("--environment", required=True)
parser.add_argument("--dry-run", action="store_true")
args = parser.parse_args()`,
    hint: "Define both options before calling parse_args(); environment is required and dry-run is a Boolean flag.",
    checks: ["argparse.argumentparser", '"--environment"', "required=true", '"--dry-run"', "parse_args()"],
    output: "Validated environment-aware CLI created",
  },
  {
    label: "Add idempotency protection",
    situation: "A retried job must recognize the same operation and avoid duplicating its effect.",
    task: "Create idempotency_key(value) with SHA-256 and generate a stable key for this operation.",
    starter: "\n# Generate a stable idempotency key for safe retries\n",
    solution: `import hashlib

def idempotency_key(value):
    return hashlib.sha256(str(value).encode("utf-8")).hexdigest()

operation_key = idempotency_key("{{topic}}:{{context}}")`,
    hint: "Hash a stable representation of the operation rather than a changing timestamp.",
    checks: ["import hashlib", "def idempotency_key", "hashlib.sha256(", ".hexdigest()"],
    output: "Stable idempotency key generated",
  },
  {
    label: "Make the decision testable",
    situation: "The change cannot enter the platform repository without a deterministic unit test.",
    task: "Create production_control(value) returning a Boolean and add assertions for allowed and rejected input.",
    starter: "\n# Separate the decision and prove both outcomes with assertions\n",
    solution: `def production_control(value):
    return value is not None

assert production_control("ready") is True
assert production_control(None) is False`,
    hint: "Keep the decision free of external calls, then assert one passing and one failing case.",
    checks: ["def production_control", "return value is not none", "assert production_control", "is false"],
    output: "Deterministic success and failure tests passed",
  },
];

function hydrate(value: string, replacements: Record<string, string>): string {
  return Object.entries(replacements).reduce(
    (result, [token, replacement]) => result.replaceAll(`{{${token}}}`, replacement),
    value,
  );
}

function expand(chapterId: string, seeds: ScenarioSeed[]): Scenario[] {
  return contexts.flatMap((context, contextIndex) =>
    seeds.map((seed, seedIndex) => {
      const question = contextIndex * seeds.length + seedIndex + 1;
      const objective = scenarioObjectives[contextIndex];
      const replacements = {
        n: String(contextIndex + 1),
        context,
        topic: seed.title.toLowerCase(),
      };
      return {
        ...seed,
        id: `${chapterId}-${question}`,
        title: `${objective.label}: ${seed.title.toLowerCase()}`,
        situation: `${seed.situation(context, contextIndex + 1)} ${objective.situation}`,
        task: `${hydrate(seed.task, replacements)} ${hydrate(objective.task, replacements)}`,
        starter: `${hydrate(seed.starter, replacements)}${hydrate(objective.starter, replacements)}`,
        solution: `${hydrate(seed.solution, replacements)}\n\n${hydrate(objective.solution, replacements)}`,
        hint: `${seed.hint} Production requirement: ${objective.hint}`,
        checks: [...seed.checks, ...objective.checks],
        output: `${hydrate(seed.output, replacements)}\n${hydrate(objective.output, replacements)}`,
      };
    }),
  );
}

const pythonSeeds: ScenarioSeed[] = [
  {
    title: "Format an operational message",
    level: "Basic",
    situation: (context, n) => `${context} needs a readable status line for server web-${n}.`,
    task: 'Create server and status variables, then print "web-{{n}} is healthy" with an f-string.',
    starter: `server = "web-{{n}}"\nstatus = "healthy"\n\n# Print the status with an f-string\n`,
    solution: `server = "web-{{n}}"\nstatus = "healthy"\nprint(f"{server} is {status}")`,
    hint: 'Place the variables inside braces: f"{server} is {status}".',
    checks: ["server", "status", "print(", 'f"'],
    output: "web-{{n}} is healthy",
  },
  {
    title: "Filter unhealthy services",
    level: "Basic",
    situation: (context, n) => `${context} receives a service list from health probe ${n}.`,
    task: "Use a list comprehension to keep statuses that are not healthy.",
    starter: `statuses = ["healthy", "stopped", "healthy", "degraded"]\n\n# Build an unhealthy list\n`,
    solution: `statuses = ["healthy", "stopped", "healthy", "degraded"]\nunhealthy = [status for status in statuses if status != "healthy"]\nprint(unhealthy)`,
    hint: 'The filter belongs after the loop: if status != "healthy".',
    checks: ["[", "for status in statuses", '!= "healthy"', "print("],
    output: "['stopped', 'degraded']",
  },
  {
    title: "Summarize inventory",
    level: "Basic",
    situation: (context, n) => `${context} must count resource states in inventory batch ${n}.`,
    task: "Build a dictionary that counts how many times each state appears.",
    starter: `states = ["running", "stopped", "running", "pending"]\ncounts = {}\n\n# Count every state\n`,
    solution: `states = ["running", "stopped", "running", "pending"]\ncounts = {}\nfor state in states:\n    counts[state] = counts.get(state, 0) + 1\nprint(counts)`,
    hint: "dict.get(key, 0) provides a safe starting count.",
    checks: ["for state in states", ".get(", "+ 1", "print("],
    output: "{'running': 2, 'stopped': 1, 'pending': 1}",
  },
  {
    title: "Create a reusable threshold check",
    level: "Intermediate",
    situation: (context, n) => `${context} wants a reusable alert rule for metric stream ${n}.`,
    task: "Write is_alert(value, threshold) and return whether value is greater than threshold.",
    starter: `def is_alert(value, threshold):\n    # Return a Boolean\n    pass\n\nprint(is_alert(91, 80))\n`,
    solution: `def is_alert(value, threshold):\n    return value > threshold\n\nprint(is_alert(91, 80))`,
    hint: "A comparison already produces True or False.",
    checks: ["def is_alert", "return ", "value > threshold"],
    output: "True",
  },
  {
    title: "Handle malformed input",
    level: "Intermediate",
    situation: (context, n) => `${context} sometimes receives an invalid port value from configuration ${n}.`,
    task: "Convert raw_port to int and catch ValueError, printing invalid port.",
    starter: `raw_port = "not-a-number"\n\n# Convert safely with try/except\n`,
    solution: `raw_port = "not-a-number"\ntry:\n    port = int(raw_port)\n    print(port)\nexcept ValueError:\n    print("invalid port")`,
    hint: "Place int(raw_port) under try and catch ValueError.",
    checks: ["try:", "int(raw_port)", "except valueerror", "print("],
    output: "invalid port",
  },
  {
    title: "Model a server with a dataclass",
    level: "Intermediate",
    situation: (context, n) => `${context} needs consistent server records for report ${n}.`,
    task: "Create a Server dataclass with name and status fields, then instantiate it.",
    starter: `from dataclasses import dataclass\n\n# Define Server with name and status\n`,
    solution: `from dataclasses import dataclass\n\n@dataclass\nclass Server:\n    name: str\n    status: str\n\nserver = Server("api-{{n}}", "healthy")\nprint(server.name, server.status)`,
    hint: "Add @dataclass above a class with typed attributes.",
    checks: ["@dataclass", "class server", "name: str", "status: str", "server("],
    output: "api-{{n}} healthy",
  },
  {
    title: "Stream large results",
    level: "Intermediate",
    situation: (context, n) => `${context} must process a large event feed ${n} without storing every match.`,
    task: "Write errors(lines) as a generator that yields lines containing ERROR.",
    starter: `def errors(lines):\n    # Yield matching lines one at a time\n    pass\n`,
    solution: `def errors(lines):\n    for line in lines:\n        if "ERROR" in line.upper():\n            yield line`,
    hint: "Use yield instead of building and returning a list.",
    checks: ["def errors", "for line in lines", ".upper()", "yield line"],
    output: "Generator ready",
  },
  {
    title: "Add a context manager",
    level: "Advanced",
    situation: (context, n) => `${context} must guarantee cleanup around maintenance job ${n}.`,
    task: "Use contextlib.contextmanager with try/finally and yield a resource name.",
    starter: `from contextlib import contextmanager\n\n@contextmanager\ndef managed_resource():\n    # Yield, then always clean up\n    pass\n`,
    solution: `from contextlib import contextmanager\n\n@contextmanager\ndef managed_resource():\n    try:\n        yield "resource-{{n}}"\n    finally:\n        print("cleanup complete")`,
    hint: "A context manager generator yields inside try and cleans up in finally.",
    checks: ["@contextmanager", "try:", "yield ", "finally:"],
    output: "cleanup complete",
  },
  {
    title: "Run checks concurrently",
    level: "Advanced",
    situation: (context, n) => `${context} wants health checks for batch ${n} to run concurrently.`,
    task: "Use asyncio.gather() to await check('api') and check('worker').",
    starter: `import asyncio\n\nasync def check(name):\n    await asyncio.sleep(0.1)\n    return f"{name}: healthy"\n\nasync def main():\n    # Run both checks concurrently\n    pass\n`,
    solution: `import asyncio\n\nasync def check(name):\n    await asyncio.sleep(0.1)\n    return f"{name}: healthy"\n\nasync def main():\n    results = await asyncio.gather(check("api"), check("worker"))\n    print(results)\n\nasyncio.run(main())`,
    hint: "Pass both coroutine calls to await asyncio.gather(...).",
    checks: ["async def", "await asyncio.gather", 'check("api")', 'check("worker")'],
    output: "['api: healthy', 'worker: healthy']",
  },
  {
    title: "Build a command-line interface",
    level: "Advanced",
    situation: (context, n) => `${context} needs deployment tool ${n} to accept a required environment argument.`,
    task: "Use argparse to add a required --environment option and parse the arguments.",
    starter: `import argparse\n\nparser = argparse.ArgumentParser()\n# Add --environment and parse arguments\n`,
    solution: `import argparse\n\nparser = argparse.ArgumentParser()\nparser.add_argument("--environment", required=True)\nargs = parser.parse_args()\nprint(args.environment)`,
    hint: 'Call parser.add_argument("--environment", required=True).',
    checks: ["argparse.argumentparser", 'add_argument("--environment"', "required=true", "parse_args()"],
    output: "production",
  },
];

const osSeeds: ScenarioSeed[] = [
  {
    title: "Discover files safely",
    level: "Basic",
    situation: (context, n) => `${context} needs to discover log files for archive batch ${n}.`,
    task: "Use pathlib.Path and glob('*.log') to iterate through log files.",
    starter: `from pathlib import Path\nroot = Path("/var/log")\n\n# Iterate over .log files\n`,
    solution: `from pathlib import Path\nroot = Path("/var/log")\nfor path in root.glob("*.log"):\n    print(path.name)`,
    hint: 'Call root.glob("*.log") in a for loop.',
    checks: ["from pathlib import path", '.glob("*.log")', "for ", "print("],
    output: "app.log\naudit.log\n(mock filesystem)",
  },
  {
    title: "Create nested directories",
    level: "Basic",
    situation: (context, n) => `${context} needs a repeatable output directory for run ${n}.`,
    task: "Create reports/daily with parents=True and exist_ok=True.",
    starter: `from pathlib import Path\noutput = Path("reports/daily")\n\n# Create the directory safely\n`,
    solution: `from pathlib import Path\noutput = Path("reports/daily")\noutput.mkdir(parents=True, exist_ok=True)`,
    hint: "mkdir supports parents and exist_ok keyword arguments.",
    checks: [".mkdir(", "parents=true", "exist_ok=true"],
    output: "reports/daily ready",
  },
  {
    title: "Copy a backup",
    level: "Basic",
    situation: (context, n) => `${context} must copy configuration before change window ${n}.`,
    task: "Use shutil.copy2 to preserve metadata while copying app.conf to app.conf.bak.",
    starter: `import shutil\n\n# Copy the file and preserve metadata\n`,
    solution: `import shutil\nshutil.copy2("app.conf", "app.conf.bak")`,
    hint: "copy2(source, destination) preserves file metadata.",
    checks: ["shutil.copy2", '"app.conf"', '"app.conf.bak"'],
    output: "Backup created (mock)",
  },
  {
    title: "Rename with a timestamp",
    level: "Intermediate",
    situation: (context, n) => `${context} rotates export file ${n} after processing.`,
    task: "Use Path.rename() to rename export.csv to export-{{n}}.csv.",
    starter: `from pathlib import Path\nsource = Path("export.csv")\n\n# Rename the file\n`,
    solution: `from pathlib import Path\nsource = Path("export.csv")\nsource.rename("export-{{n}}.csv")`,
    hint: "Call rename on the source Path.",
    checks: ["path(", ".rename(", '"export-'],
    output: "export-{{n}}.csv",
  },
  {
    title: "Inspect file age",
    level: "Intermediate",
    situation: (context, n) => `${context} must identify stale reports in cycle ${n}.`,
    task: "Call stat() and read st_mtime for the file modification timestamp.",
    starter: `from pathlib import Path\nreport = Path("report.json")\n\n# Read modification time\n`,
    solution: `from pathlib import Path\nreport = Path("report.json")\nmodified_at = report.stat().st_mtime\nprint(modified_at)`,
    hint: "Path.stat() returns metadata including st_mtime.",
    checks: [".stat()", ".st_mtime", "print("],
    output: "1722258000.0 (mock timestamp)",
  },
  {
    title: "Read JSON configuration",
    level: "Intermediate",
    situation: (context, n) => `${context} stores automation settings in config ${n}.`,
    task: "Open config.json with a context manager and parse it with json.load().",
    starter: `import json\n\n# Open and parse config.json\n`,
    solution: `import json\nwith open("config.json", encoding="utf-8") as file:\n    config = json.load(file)\nprint(config)`,
    hint: "Use with open(...) as file, then json.load(file).",
    checks: ["with open(", "encoding=", "json.load(", "print("],
    output: "{'environment': 'production'}",
  },
  {
    title: "Write a CSV report",
    level: "Intermediate",
    situation: (context, n) => `${context} needs an inventory CSV for report ${n}.`,
    task: "Use csv.DictWriter, writeheader(), and writerow() to create a report.",
    starter: `import csv\nrows = [{"name": "web-{{n}}", "status": "healthy"}]\n\n# Write inventory.csv\n`,
    solution: `import csv\nrows = [{"name": "web-{{n}}", "status": "healthy"}]\nwith open("inventory.csv", "w", newline="", encoding="utf-8") as file:\n    writer = csv.DictWriter(file, fieldnames=["name", "status"])\n    writer.writeheader()\n    writer.writerows(rows)`,
    hint: "Create DictWriter with fieldnames before writing header and rows.",
    checks: ["csv.dictwriter", "writeheader()", "writerows(", "newline="],
    output: "inventory.csv created",
  },
  {
    title: "Create a ZIP archive",
    level: "Advanced",
    situation: (context, n) => `${context} packages logs for incident ${n}.`,
    task: "Use zipfile.ZipFile in write mode and add app.log.",
    starter: `from zipfile import ZipFile\n\n# Create logs.zip and add app.log\n`,
    solution: `from zipfile import ZipFile\nwith ZipFile("logs.zip", "w") as archive:\n    archive.write("app.log")`,
    hint: 'Open ZipFile("logs.zip", "w") as a context manager.',
    checks: ["zipfile(", '"logs.zip"', '"w"', ".write("],
    output: "logs.zip created",
  },
  {
    title: "Verify file integrity",
    level: "Advanced",
    situation: (context, n) => `${context} verifies artifact ${n} after transfer.`,
    task: "Create a SHA-256 object, update it with bytes, and print hexdigest().",
    starter: `import hashlib\ndata = b"artifact-{{n}}"\n\n# Calculate SHA-256\n`,
    solution: `import hashlib\ndigest = hashlib.sha256()\ndigest.update(b"artifact-{{n}}")\nprint(digest.hexdigest())`,
    hint: "Use hashlib.sha256(), update(), then hexdigest().",
    checks: ["hashlib.sha256", ".update(", ".hexdigest()"],
    output: "SHA-256 digest generated",
  },
  {
    title: "Perform an atomic write",
    level: "Advanced",
    situation: (context, n) => `${context} cannot risk a half-written configuration during release ${n}.`,
    task: "Write to a temporary file and replace config.json with os.replace().",
    starter: `import os\nfrom pathlib import Path\n\ntemp = Path("config.json.tmp")\n# Write temporary content, then replace the target\n`,
    solution: `import os\nfrom pathlib import Path\n\ntemp = Path("config.json.tmp")\ntemp.write_text('{"ready": true}', encoding="utf-8")\nos.replace(temp, "config.json")`,
    hint: "Write the temporary file completely before os.replace().",
    checks: [".write_text(", "encoding=", "os.replace("],
    output: "config.json replaced atomically",
  },
];

const linuxSeeds: ScenarioSeed[] = [
  {
    title: "Check a systemd service",
    level: "Basic",
    situation: (context, n) => `${context} checks nginx service state on node ${n}.`,
    task: "Run systemctl is-active nginx using subprocess.run with a command list.",
    starter: `import subprocess\n\n# Run systemctl safely\n`,
    solution: `import subprocess\nresult = subprocess.run(\n    ["systemctl", "is-active", "nginx"],\n    capture_output=True,\n    text=True,\n    check=False,\n)\nprint(result.stdout.strip())`,
    hint: "Pass command arguments as a list, not a shell string.",
    checks: ["subprocess.run", '"systemctl"', '"is-active"', "capture_output=true", "text=true"],
    output: "active (mock Linux host)",
  },
  {
    title: "Report disk pressure",
    level: "Basic",
    situation: (context, n) => `${context} monitors root filesystem on host ${n}.`,
    task: "Use shutil.disk_usage('/') and calculate used percent.",
    starter: `import shutil\n\n# Read disk usage and calculate percentage\n`,
    solution: `import shutil\ntotal, used, free = shutil.disk_usage("/")\npercent = used / total * 100\nprint(f"{percent:.1f}%")`,
    hint: "Divide used by total and multiply by 100.",
    checks: ["shutil.disk_usage", "used / total", "* 100", "print("],
    output: "72.4% (mock Linux host)",
  },
  {
    title: "Inspect running processes",
    level: "Basic",
    situation: (context, n) => `${context} needs a process snapshot from node ${n}.`,
    task: "Run ps with arguments aux and capture text output.",
    starter: `import subprocess\n\n# Capture a process snapshot\n`,
    solution: `import subprocess\nresult = subprocess.run(["ps", "aux"], capture_output=True, text=True, check=True)\nprint(result.stdout)`,
    hint: 'Use ["ps", "aux"] with capture_output=True.',
    checks: ["subprocess.run", '"ps"', '"aux"', "capture_output=true", "text=true"],
    output: "USER PID %CPU %MEM COMMAND (mock)",
  },
  {
    title: "Parse critical log lines",
    level: "Intermediate",
    situation: (context, n) => `${context} triages application log stream ${n}.`,
    task: "Print lines containing ERROR or CRITICAL, case-insensitively.",
    starter: `lines = ["INFO ready", "ERROR db down", "critical disk full"]\n\n# Print important lines\n`,
    solution: `lines = ["INFO ready", "ERROR db down", "critical disk full"]\nfor line in lines:\n    normalized = line.upper()\n    if "ERROR" in normalized or "CRITICAL" in normalized:\n        print(line)`,
    hint: "Normalize once with upper(), then test both keywords.",
    checks: ["for line in lines", ".upper()", '"error" in', '"critical" in', "print("],
    output: "ERROR db down\ncritical disk full",
  },
  {
    title: "Check file permissions",
    level: "Intermediate",
    situation: (context, n) => `${context} audits secret file permissions on host ${n}.`,
    task: "Use stat.S_IMODE with Path.stat().st_mode and print the octal mode.",
    starter: `import stat\nfrom pathlib import Path\nsecret = Path("secret.conf")\n\n# Print permission bits in octal\n`,
    solution: `import stat\nfrom pathlib import Path\nsecret = Path("secret.conf")\nmode = stat.S_IMODE(secret.stat().st_mode)\nprint(oct(mode))`,
    hint: "Pass st_mode to stat.S_IMODE, then oct().",
    checks: ["stat.s_imode", ".stat().st_mode", "oct(", "print("],
    output: "0o600 (mock)",
  },
  {
    title: "Validate environment variables",
    level: "Intermediate",
    situation: (context, n) => `${context} requires APP_ENV for deployment ${n}.`,
    task: "Read APP_ENV with os.environ.get and raise RuntimeError if missing.",
    starter: `import os\n\n# Read and validate APP_ENV\n`,
    solution: `import os\napp_env = os.environ.get("APP_ENV")\nif not app_env:\n    raise RuntimeError("APP_ENV is required")`,
    hint: "Use os.environ.get, then test the result.",
    checks: ["os.environ.get", '"app_env"', "if not ", "raise runtimeerror"],
    output: "APP_ENV validated",
  },
  {
    title: "Apply a command timeout",
    level: "Intermediate",
    situation: (context, n) => `${context} prevents diagnostic command ${n} from hanging.`,
    task: "Run ping with subprocess.run and timeout=5, catching TimeoutExpired.",
    starter: `import subprocess\n\n# Run with a timeout and handle expiry\n`,
    solution: `import subprocess\ntry:\n    subprocess.run(["ping", "-c", "1", "example.com"], timeout=5, check=True)\nexcept subprocess.TimeoutExpired:\n    print("command timed out")`,
    hint: "timeout belongs in subprocess.run; catch subprocess.TimeoutExpired.",
    checks: ["subprocess.run", "timeout=5", "except subprocess.timeoutexpired"],
    output: "Command completed (mock)",
  },
  {
    title: "Send a graceful signal",
    level: "Advanced",
    situation: (context, n) => `${context} gracefully reloads process ${n}.`,
    task: "Use os.kill(pid, signal.SIGHUP) rather than a shell command.",
    starter: `import os\nimport signal\npid = 4321\n\n# Send a graceful reload signal\n`,
    solution: `import os\nimport signal\npid = 4321\nos.kill(pid, signal.SIGHUP)`,
    hint: "os.kill accepts a PID and a signal constant.",
    checks: ["os.kill(", "signal.sighup"],
    output: "SIGHUP sent (mock)",
  },
  {
    title: "Stream command output",
    level: "Advanced",
    situation: (context, n) => `${context} needs live output from migration ${n}.`,
    task: "Use subprocess.Popen with stdout=PIPE, text=True, then iterate over stdout.",
    starter: `import subprocess\n\n# Start command and stream its output\n`,
    solution: `import subprocess\nprocess = subprocess.Popen(\n    ["journalctl", "-n", "10"],\n    stdout=subprocess.PIPE,\n    text=True,\n)\nfor line in process.stdout:\n    print(line.rstrip())`,
    hint: "Popen exposes stdout as an iterable when PIPE and text=True are used.",
    checks: ["subprocess.popen", "stdout=subprocess.pipe", "text=true", "for line in process.stdout"],
    output: "10 journal lines streamed (mock)",
  },
  {
    title: "Make maintenance idempotent",
    level: "Advanced",
    situation: (context, n) => `${context} runs cleanup job ${n} repeatedly and safely.`,
    task: "Check Path.exists() before unlinking the stale PID file.",
    starter: `from pathlib import Path\npid_file = Path("/tmp/app.pid")\n\n# Remove only when present\n`,
    solution: `from pathlib import Path\npid_file = Path("/tmp/app.pid")\nif pid_file.exists():\n    pid_file.unlink()`,
    hint: "Guard unlink() with exists().",
    checks: [".exists()", "if ", ".unlink()"],
    output: "Cleanup safe to repeat",
  },
];

const awsSeeds: ScenarioSeed[] = [
  {
    title: "Create a regional EC2 client",
    level: "Basic",
    situation: (context, n) => `${context} inventories EC2 resources in ap-south-${n}.`,
    task: "Create an EC2 client using boto3.client and an explicit region_name.",
    starter: `import boto3\n\n# Credentials come from the AWS profile or role\n# Create a regional EC2 client\n`,
    solution: `import boto3\nec2 = boto3.client("ec2", region_name="ap-south-1")`,
    hint: 'Use boto3.client("ec2", region_name="ap-south-1").',
    checks: ["import boto3", "boto3.client", '"ec2"', "region_name="],
    output: "EC2 client created (mock boto3)",
  },
  {
    title: "Paginate S3 buckets and objects",
    level: "Basic",
    situation: (context, n) => `${context} inventories a large S3 prefix for audit ${n}.`,
    task: "Get a list_objects_v2 paginator and iterate through paginate(Bucket='audit-bucket').",
    starter: `import boto3\ns3 = boto3.client("s3")\n\n# Paginate all objects\n`,
    solution: `import boto3\ns3 = boto3.client("s3")\npaginator = s3.get_paginator("list_objects_v2")\nfor page in paginator.paginate(Bucket="audit-bucket"):\n    for item in page.get("Contents", []):\n        print(item["Key"])`,
    hint: 'Call s3.get_paginator("list_objects_v2").',
    checks: ["boto3.client", "get_paginator", '"list_objects_v2"', ".paginate(", 'bucket="audit-bucket"'],
    output: "logs/app-{{n}}.log (mock boto3)",
  },
  {
    title: "Filter running EC2 instances",
    level: "Basic",
    situation: (context, n) => `${context} needs only running instances for report ${n}.`,
    task: "Call describe_instances with an instance-state-name=running filter.",
    starter: `import boto3\nec2 = boto3.client("ec2", region_name="ap-south-1")\n\n# Filter running instances\n`,
    solution: `import boto3\nec2 = boto3.client("ec2", region_name="ap-south-1")\nresponse = ec2.describe_instances(\n    Filters=[{"Name": "instance-state-name", "Values": ["running"]}]\n)`,
    hint: "describe_instances accepts a Filters list with Name and Values.",
    checks: ["describe_instances(", '"instance-state-name"', '"running"', "filters="],
    output: "2 running instances (mock boto3)",
  },
  {
    title: "Read resource tags safely",
    level: "Intermediate",
    situation: (context, n) => `${context} extracts the Name tag from instance batch ${n}.`,
    task: "Use next() with a default to find the Name tag without raising an error.",
    starter: `tags = [{"Key": "Environment", "Value": "prod"}, {"Key": "Name", "Value": "api-{{n}}"}]\n\n# Safely find Name\n`,
    solution: `tags = [{"Key": "Environment", "Value": "prod"}, {"Key": "Name", "Value": "api-{{n}}"}]\nname = next((tag["Value"] for tag in tags if tag["Key"] == "Name"), "unnamed")\nprint(name)`,
    hint: "next(generator, default) avoids StopIteration.",
    checks: ["next(", 'tag["value"]', 'tag["key"] == "name"', '"unnamed"'],
    output: "api-{{n}}",
  },
  {
    title: "Publish a CloudWatch metric",
    level: "Intermediate",
    situation: (context, n) => `${context} publishes failed-job count ${n} to CloudWatch.`,
    task: "Use a boto3 cloudwatch client and put_metric_data with Namespace and MetricData.",
    starter: `import boto3\ncloudwatch = boto3.client("cloudwatch", region_name="ap-south-1")\n\n# Publish FailedJobs metric\n`,
    solution: `import boto3\ncloudwatch = boto3.client("cloudwatch", region_name="ap-south-1")\ncloudwatch.put_metric_data(\n    Namespace="PyTrail/Automation",\n    MetricData=[{"MetricName": "FailedJobs", "Value": {{n}}, "Unit": "Count"}],\n)`,
    hint: "put_metric_data requires Namespace and a MetricData list.",
    checks: ['boto3.client("cloudwatch"', "put_metric_data(", "namespace=", "metricdata="],
    output: "FailedJobs metric published (mock boto3)",
  },
  {
    title: "Confirm the AWS identity",
    level: "Intermediate",
    situation: (context, n) => `${context} validates its execution identity before change ${n}.`,
    task: "Create an STS client and call get_caller_identity().",
    starter: `import boto3\n\n# Print the active AWS account and ARN\n`,
    solution: `import boto3\nsts = boto3.client("sts")\nidentity = sts.get_caller_identity()\nprint(identity["Account"], identity["Arn"])`,
    hint: 'The service name is "sts".',
    checks: ['boto3.client("sts"', "get_caller_identity()", '["account"]', '["arn"]'],
    output: "123456789012 arn:aws:iam::123456789012:role/automation (mock)",
  },
  {
    title: "Upload securely to S3",
    level: "Intermediate",
    situation: (context, n) => `${context} uploads report ${n} with server-side encryption.`,
    task: "Call upload_file with ExtraArgs enabling AES256 encryption.",
    starter: `import boto3\ns3 = boto3.client("s3")\n\n# Upload report.csv securely\n`,
    solution: `import boto3\ns3 = boto3.client("s3")\ns3.upload_file(\n    "report.csv",\n    "reports-bucket",\n    "daily/report-{{n}}.csv",\n    ExtraArgs={"ServerSideEncryption": "AES256"},\n)`,
    hint: "Pass encryption settings through ExtraArgs.",
    checks: [".upload_file(", "extraargs=", '"serversideencryption"', '"aes256"'],
    output: "daily/report-{{n}}.csv uploaded (mock boto3)",
  },
  {
    title: "Wait for an instance state",
    level: "Advanced",
    situation: (context, n) => `${context} must wait for instance ${n} before the next deployment step.`,
    task: "Get the instance_running waiter and call wait with InstanceIds.",
    starter: `import boto3\nec2 = boto3.client("ec2", region_name="ap-south-1")\n\n# Wait until the instance is running\n`,
    solution: `import boto3\nec2 = boto3.client("ec2", region_name="ap-south-1")\nwaiter = ec2.get_waiter("instance_running")\nwaiter.wait(InstanceIds=["i-0123456789abcdef0"])`,
    hint: 'Use ec2.get_waiter("instance_running").',
    checks: ["get_waiter", '"instance_running"', ".wait(", "instanceids="],
    output: "Instance running (mock boto3)",
  },
  {
    title: "Configure SDK retries",
    level: "Advanced",
    situation: (context, n) => `${context} hardens API calls for automation job ${n}.`,
    task: "Create botocore Config with standard retry mode and max_attempts=10.",
    starter: `import boto3\nfrom botocore.config import Config\n\n# Configure standard retries\n`,
    solution: `import boto3\nfrom botocore.config import Config\n\nconfig = Config(retries={"mode": "standard", "max_attempts": 10})\nec2 = boto3.client("ec2", config=config)`,
    hint: "Pass a retries dictionary to Config, then config= to boto3.client.",
    checks: ["from botocore.config import config", "retries=", '"standard"', '"max_attempts"', "config=config"],
    output: "Retry policy configured",
  },
  {
    title: "Use an assumed-role session",
    level: "Advanced",
    situation: (context, n) => `${context} accesses a target account through approved role ${n}.`,
    task: "Call sts.assume_role and build a boto3.Session from the returned temporary credentials.",
    starter: `import boto3\nsts = boto3.client("sts")\n\n# Assume the role and create a temporary session\n`,
    solution: `import boto3\nsts = boto3.client("sts")\nresponse = sts.assume_role(\n    RoleArn="arn:aws:iam::123456789012:role/ReadOnlyAutomation",\n    RoleSessionName="pytrail-{{n}}",\n)\ncredentials = response["Credentials"]\nsession = boto3.Session(\n    aws_access_key_id=credentials["AccessKeyId"],\n    aws_secret_access_key=credentials["SecretAccessKey"],\n    aws_session_token=credentials["SessionToken"],\n)`,
    hint: "Temporary values are under response['Credentials']; include the session token.",
    checks: ["assume_role(", "rolearn=", "rolesessionname=", 'response["credentials"]', "boto3.session("],
    output: "Temporary boto3 session created (mock)",
  },
];

const azureSeeds: ScenarioSeed[] = [
  {
    title: "Authenticate without secrets",
    level: "Basic",
    situation: (context, n) => `${context} authenticates Azure automation job ${n} locally and in managed identity.`,
    task: "Create a DefaultAzureCredential instance.",
    starter: `from azure.identity import DefaultAzureCredential\n\n# Create a credential chain\n`,
    solution: `from azure.identity import DefaultAzureCredential\ncredential = DefaultAzureCredential()`,
    hint: "DefaultAzureCredential needs no hard-coded secret.",
    checks: ["from azure.identity import defaultazurecredential", "defaultazurecredential()"],
    output: "Azure credential chain ready (mock)",
  },
  {
    title: "List virtual machines",
    level: "Basic",
    situation: (context, n) => `${context} inventories Azure VMs for subscription review ${n}.`,
    task: "Create ComputeManagementClient and iterate over virtual_machines.list_all().",
    starter: `from azure.identity import DefaultAzureCredential\nfrom azure.mgmt.compute import ComputeManagementClient\n\ncredential = DefaultAzureCredential()\nsubscription_id = "from-environment"\n# List all VMs\n`,
    solution: `from azure.identity import DefaultAzureCredential\nfrom azure.mgmt.compute import ComputeManagementClient\ncredential = DefaultAzureCredential()\nsubscription_id = "from-environment"\ncompute = ComputeManagementClient(credential, subscription_id)\nfor vm in compute.virtual_machines.list_all():\n    print(vm.name, vm.location)`,
    hint: "Create the compute client, then use virtual_machines.list_all().",
    checks: ["computemanagementclient(", "virtual_machines.list_all()", "for vm in", "print("],
    output: "api-{{n}} centralindia (mock Azure)",
  },
  {
    title: "List resource groups",
    level: "Basic",
    situation: (context, n) => `${context} reviews Azure resource groups for governance cycle ${n}.`,
    task: "Use ResourceManagementClient and iterate over resource_groups.list().",
    starter: `from azure.mgmt.resource import ResourceManagementClient\n\n# Create client and list resource groups\n`,
    solution: `from azure.mgmt.resource import ResourceManagementClient\nclient = ResourceManagementClient(credential, subscription_id)\nfor group in client.resource_groups.list():\n    print(group.name)`,
    hint: "Resource groups are available through client.resource_groups.list().",
    checks: ["resourcemanagementclient(", "resource_groups.list()", "for group in"],
    output: "rg-production-{{n}} (mock Azure)",
  },
  {
    title: "Read blob inventory",
    level: "Intermediate",
    situation: (context, n) => `${context} inventories blobs for retention review ${n}.`,
    task: "Create BlobServiceClient from an account URL and iterate container_client.list_blobs().",
    starter: `from azure.storage.blob import BlobServiceClient\n\n# Create clients and list blobs\n`,
    solution: `from azure.storage.blob import BlobServiceClient\nservice = BlobServiceClient("https://account.blob.core.windows.net", credential=credential)\ncontainer = service.get_container_client("reports")\nfor blob in container.list_blobs():\n    print(blob.name)`,
    hint: "Get a container client from BlobServiceClient before list_blobs().",
    checks: ["blobserviceclient(", "credential=", "get_container_client(", "list_blobs()"],
    output: "report-{{n}}.json (mock Azure)",
  },
  {
    title: "Query Azure Monitor",
    level: "Intermediate",
    situation: (context, n) => `${context} queries CPU metrics for incident ${n}.`,
    task: "Use MetricsQueryClient and call query_resource with metric_names=['Percentage CPU'].",
    starter: `from azure.monitor.query import MetricsQueryClient\n\n# Query Percentage CPU\n`,
    solution: `from azure.monitor.query import MetricsQueryClient\nclient = MetricsQueryClient(credential)\nresponse = client.query_resource(\n    resource_uri,\n    metric_names=["Percentage CPU"],\n)\nprint(response.metrics)`,
    hint: "MetricsQueryClient takes the credential; query_resource takes the resource URI.",
    checks: ["metricsqueryclient(", "query_resource(", '"percentage cpu"', "metric_names="],
    output: "Percentage CPU: 34.2 (mock Azure)",
  },
  {
    title: "Inspect network interfaces",
    level: "Intermediate",
    situation: (context, n) => `${context} audits NIC configuration for workload ${n}.`,
    task: "Use NetworkManagementClient and call network_interfaces.list_all().",
    starter: `from azure.mgmt.network import NetworkManagementClient\n\n# List all network interfaces\n`,
    solution: `from azure.mgmt.network import NetworkManagementClient\nnetwork = NetworkManagementClient(credential, subscription_id)\nfor nic in network.network_interfaces.list_all():\n    print(nic.name, nic.location)`,
    hint: "Network interfaces expose list_all().",
    checks: ["networkmanagementclient(", "network_interfaces.list_all()", "for nic in"],
    output: "nic-api-{{n}} centralindia (mock Azure)",
  },
  {
    title: "Retrieve a Key Vault secret",
    level: "Intermediate",
    situation: (context, n) => `${context} retrieves runtime secret ${n} without embedding it in code.`,
    task: "Create SecretClient with vault_url and credential, then call get_secret.",
    starter: `from azure.keyvault.secrets import SecretClient\n\n# Retrieve database-url\n`,
    solution: `from azure.keyvault.secrets import SecretClient\nclient = SecretClient(vault_url="https://example.vault.azure.net", credential=credential)\nsecret = client.get_secret("database-url")\nprint(secret.value)`,
    hint: "SecretClient needs vault_url and credential.",
    checks: ["secretclient(", "vault_url=", "credential=", 'get_secret("database-url")'],
    output: "[secret value hidden] (mock Azure)",
  },
  {
    title: "Wait for a long-running operation",
    level: "Advanced",
    situation: (context, n) => `${context} starts VM operation ${n} and must wait correctly.`,
    task: "Store begin_start() result as poller and call poller.result().",
    starter: `# compute is an authenticated ComputeManagementClient\n\n# Start the VM and wait for completion\n`,
    solution: `poller = compute.virtual_machines.begin_start("rg-production", "api-{{n}}")\npoller.result()`,
    hint: "Azure begin_* methods return pollers; result() waits for completion.",
    checks: ["begin_start(", "poller", ".result()"],
    output: "VM operation completed (mock Azure)",
  },
  {
    title: "Handle Azure SDK errors",
    level: "Advanced",
    situation: (context, n) => `${context} makes resource lookup ${n} resilient to missing resources.`,
    task: "Catch ResourceNotFoundError around a client get() call.",
    starter: `from azure.core.exceptions import ResourceNotFoundError\n\n# Handle a missing resource\n`,
    solution: `from azure.core.exceptions import ResourceNotFoundError\ntry:\n    resource = client.get("resource-{{n}}")\nexcept ResourceNotFoundError:\n    resource = None\n    print("resource not found")`,
    hint: "Import and catch ResourceNotFoundError specifically.",
    checks: ["resourcenotfounderror", "try:", "except ", "client.get("],
    output: "resource not found",
  },
  {
    title: "Use async Azure clients",
    level: "Advanced",
    situation: (context, n) => `${context} parallelizes storage operation set ${n}.`,
    task: "Use an async BlobServiceClient context manager and await get_account_information().",
    starter: `from azure.storage.blob.aio import BlobServiceClient\n\nasync def inspect():\n    # Open async client and await account info\n    pass\n`,
    solution: `from azure.storage.blob.aio import BlobServiceClient\n\nasync def inspect():\n    async with BlobServiceClient(account_url, credential=credential) as client:\n        info = await client.get_account_information()\n        return info`,
    hint: "Use async with and await the SDK method.",
    checks: ["from azure.storage.blob.aio", "async def", "async with", "await client.get_account_information()"],
    output: "Async account inspection complete (mock Azure)",
  },
];

const productionSeeds: ScenarioSeed[] = [
  {
    title: "Add structured logging",
    level: "Basic",
    situation: (context, n) => `${context} needs searchable logs for automation run ${n}.`,
    task: "Configure logging and log the job name with an extra field.",
    starter: `import logging\n\n# Configure and write an INFO log\n`,
    solution: `import logging\nlogging.basicConfig(level=logging.INFO)\nlogger = logging.getLogger("automation")\nlogger.info("job completed", extra={"job_id": "{{n}}"})`,
    hint: "Create a named logger after basicConfig.",
    checks: ["logging.basicconfig", "getlogger(", ".info(", "extra="],
    output: "INFO automation job completed",
  },
  {
    title: "Add exponential backoff",
    level: "Basic",
    situation: (context, n) => `${context} retries transient API request ${n}.`,
    task: "Loop over three attempts and sleep for 2 ** attempt seconds after failure.",
    starter: `import time\n\n# Retry three times with exponential delay\n`,
    solution: `import time\nfor attempt in range(3):\n    try:\n        call_api()\n        break\n    except TemporaryError:\n        time.sleep(2 ** attempt)`,
    hint: "Use range(3) and time.sleep(2 ** attempt).",
    checks: ["for attempt in range(3)", "try:", "except ", "time.sleep(2 ** attempt)"],
    output: "Request completed after retry (mock)",
  },
  {
    title: "Protect a destructive action",
    level: "Basic",
    situation: (context, n) => `${context} requires dry-run protection for cleanup ${n}.`,
    task: "If dry_run is true, print the intended deletion; otherwise call delete_resource().",
    starter: `dry_run = True\nresource = "old-snapshot-{{n}}"\n\n# Protect the destructive action\n`,
    solution: `dry_run = True\nresource = "old-snapshot-{{n}}"\nif dry_run:\n    print(f"would delete {resource}")\nelse:\n    delete_resource(resource)`,
    hint: "Put the real action only in the else branch.",
    checks: ["if dry_run", "would delete", "else:", "delete_resource("],
    output: "would delete old-snapshot-{{n}}",
  },
  {
    title: "Test with a mock",
    level: "Intermediate",
    situation: (context, n) => `${context} tests API workflow ${n} without a real network call.`,
    task: "Use unittest.mock.patch and assert_called_once().",
    starter: `from unittest.mock import patch\n\n# Patch call_api and verify one call\n`,
    solution: `from unittest.mock import patch\nwith patch("app.call_api") as mock_call:\n    run_job()\n    mock_call.assert_called_once()`,
    hint: "Use patch as a context manager and assert on the mock.",
    checks: ["from unittest.mock import patch", "with patch(", "assert_called_once()"],
    output: "Test passed",
  },
  {
    title: "Bound concurrent work",
    level: "Intermediate",
    situation: (context, n) => `${context} processes hosts concurrently for batch ${n}.`,
    task: "Use ThreadPoolExecutor(max_workers=5) and executor.map(check_host, hosts).",
    starter: `from concurrent.futures import ThreadPoolExecutor\nhosts = ["web-1", "web-2", "web-3"]\n\n# Check hosts with bounded concurrency\n`,
    solution: `from concurrent.futures import ThreadPoolExecutor\nhosts = ["web-1", "web-2", "web-3"]\nwith ThreadPoolExecutor(max_workers=5) as executor:\n    results = list(executor.map(check_host, hosts))`,
    hint: "Use the executor as a context manager and map the function over hosts.",
    checks: ["threadpoolexecutor", "max_workers=5", "executor.map(", "with "],
    output: "3 hosts checked",
  },
  {
    title: "Validate configuration",
    level: "Intermediate",
    situation: (context, n) => `${context} rejects an unsafe environment value for release ${n}.`,
    task: "Raise ValueError unless environment is dev, staging, or prod.",
    starter: `environment = "production-ish"\nallowed = {"dev", "staging", "prod"}\n\n# Validate environment\n`,
    solution: `environment = "production-ish"\nallowed = {"dev", "staging", "prod"}\nif environment not in allowed:\n    raise ValueError(f"invalid environment: {environment}")`,
    hint: "Use the not in membership operator.",
    checks: ["if environment not in allowed", "raise valueerror"],
    output: "ValueError: invalid environment",
  },
  {
    title: "Make updates idempotent",
    level: "Intermediate",
    situation: (context, n) => `${context} applies desired tag state repeatedly in job ${n}.`,
    task: "Only call update_tag when the current value differs from desired.",
    starter: `current = "staging"\ndesired = "production"\n\n# Update only when needed\n`,
    solution: `current = "staging"\ndesired = "production"\nif current != desired:\n    update_tag(desired)`,
    hint: "Compare current and desired before changing state.",
    checks: ["if current != desired", "update_tag("],
    output: "Tag updated once",
  },
  {
    title: "Return meaningful exit codes",
    level: "Advanced",
    situation: (context, n) => `${context} integrates health script ${n} with CI.`,
    task: "Return exit code 0 when healthy and 1 otherwise, then call sys.exit(main()).",
    starter: `import sys\n\ndef main():\n    healthy = check_health()\n    # Return a CI-friendly code\n\n# Exit with main result\n`,
    solution: `import sys\n\ndef main():\n    healthy = check_health()\n    return 0 if healthy else 1\n\nsys.exit(main())`,
    hint: "Return 0 for success and pass main() to sys.exit.",
    checks: ["return 0 if healthy else 1", "sys.exit(main())"],
    output: "Process exit code: 0",
  },
  {
    title: "Write an audit record",
    level: "Advanced",
    situation: (context, n) => `${context} records who changed what in operation ${n}.`,
    task: "Create a JSON audit dictionary with timestamp, action, actor, and resource.",
    starter: `from datetime import datetime, timezone\nimport json\n\n# Build and print an audit record\n`,
    solution: `from datetime import datetime, timezone\nimport json\nrecord = {\n    "timestamp": datetime.now(timezone.utc).isoformat(),\n    "action": "update",\n    "actor": "automation",\n    "resource": "service-{{n}}",\n}\nprint(json.dumps(record))`,
    hint: "Use a timezone-aware UTC timestamp and json.dumps.",
    checks: ["datetime.now(timezone.utc)", '"action"', '"actor"', '"resource"', "json.dumps("],
    output: '{"action":"update","actor":"automation","resource":"service-{{n}}"}',
  },
  {
    title: "Design rollback behavior",
    level: "Advanced",
    situation: (context, n) => `${context} must restore state if deployment step ${n} fails.`,
    task: "Capture previous_state, call deploy() in try, and call rollback(previous_state) in except.",
    starter: `previous_state = read_current_state()\n\n# Deploy with rollback on failure\n`,
    solution: `previous_state = read_current_state()\ntry:\n    deploy()\nexcept DeploymentError:\n    rollback(previous_state)\n    raise`,
    hint: "Rollback in except and re-raise so the failure stays visible.",
    checks: ["previous_state", "try:", "except deploymenterror", "rollback(previous_state)", "raise"],
    output: "Rollback path verified",
  },
];

const pythonUnits: TeachingUnit[] = [
  { title: "Values, variables, and output", level: "Basic", concept: "Learn strings, numbers, booleans, naming, and f-strings—the raw materials of every automation script.", practical: `server = "api-01"\nport = 443\nprint(f"checking {server}:{port}")` },
  { title: "Conditions and operational decisions", level: "Basic", concept: "Use comparisons, membership, and if/elif/else to turn raw state into decisions.", practical: `usage = 87\nif usage >= 80:\n    print("disk alert")` },
  { title: "Lists, dictionaries, sets, and tuples", level: "Basic", concept: "Represent inventories, configuration, unique values, and fixed records with the right collection.", practical: `servers = [{"name": "web-1", "state": "running"}]\nprint(servers[0]["name"])` },
  { title: "Loops and comprehensions", level: "Basic", concept: "Process many resources predictably and express simple transformations concisely.", practical: `running = [s for s in servers if s["state"] == "running"]` },
  { title: "Functions and clean boundaries", level: "Intermediate", concept: "Package behavior into small functions with inputs, outputs, type hints, and focused responsibility.", practical: `def percent(used: int, total: int) -> float:\n    return used / total * 100` },
  { title: "Errors, exceptions, and cleanup", level: "Intermediate", concept: "Fail clearly, catch only expected errors, and guarantee cleanup with finally and context managers.", practical: `try:\n    port = int(raw_port)\nexcept ValueError as exc:\n    raise ConfigError("invalid port") from exc` },
  { title: "Files, JSON, CSV, and paths", level: "Intermediate", concept: "Use pathlib and context managers to create portable scripts that read and write common operations data.", practical: `from pathlib import Path\nconfig = Path("config.json").read_text(encoding="utf-8")` },
  { title: "Modules, packages, and environments", level: "Intermediate", concept: "Split code into importable modules, isolate dependencies, and keep secrets in environment configuration.", practical: `# project layout\n# automation/\n#   __init__.py\n#   inventory.py\n#   cli.py` },
  { title: "Classes, dataclasses, and protocols", level: "Advanced", concept: "Model resources cleanly and use interfaces when several providers share behavior.", practical: `@dataclass\nclass Server:\n    name: str\n    state: str = "unknown"` },
  { title: "Generators and scalable data flow", level: "Advanced", concept: "Stream large logs and inventories with yield instead of holding everything in memory.", practical: `def errors(lines):\n    for line in lines:\n        if "ERROR" in line:\n            yield line` },
  { title: "Concurrency and async I/O", level: "Advanced", concept: "Use threads for blocking SDK work and asyncio for high-volume I/O while controlling concurrency.", practical: `results = await asyncio.gather(*(check(url) for url in urls))` },
  { title: "CLI design, testing, and production quality", level: "Advanced", concept: "Finish with argparse, logging, unit tests, mocks, type hints, dry-runs, exit codes, and packaging.", practical: `parser.add_argument("--dry-run", action="store_true")\nargs = parser.parse_args()` },
];

function compactUnits(items: Array<[string, TeachingUnit["level"], string, string]>): TeachingUnit[] {
  return items.map(([title, level, concept, practical]) => ({ title, level, concept, practical }));
}

const capstonesByChapter: Record<string, Capstone[]> = {
  "python-mastery": [
    {
      id: "python-deployment-gate",
      title: "Build a production deployment readiness gate",
      role: "Platform engineer supporting a Kubernetes-based deployment platform",
      incident: "A release reached production with a missing environment variable and an unhealthy dependency. The rollout completed, but the API platform failed readiness checks for 18 minutes.",
      mission: "Create a Python CLI that validates configuration, checks service health concurrently, produces a JSON evidence report, and exits with a CI-friendly status code.",
      skills: ["argparse CLI", "dataclasses", "asyncio", "JSON reports", "logging", "exit codes", "unit tests"],
      deliverables: [
        "A validate-release command with --config, --environment, and --dry-run options",
        "Typed validation results for configuration, endpoints, and artifact metadata",
        "A machine-readable report that CI can retain as evidence",
        "Unit tests for success, timeout, malformed configuration, and partial failure",
      ],
      stages: [
        { title: "Model the gate", details: "Create dataclasses for checks and the final decision. Load required values from JSON and environment variables." },
        { title: "Run safe checks", details: "Execute independent health probes concurrently, apply timeouts, and collect every failure instead of stopping at the first one." },
        { title: "Integrate with CI", details: "Write the evidence report, log the decision, and return exit code 0 only when every mandatory check passes." },
      ],
      acceptance: [
        "Repeated dry-runs do not change any service",
        "Secrets are never printed in logs or reports",
        "A failed mandatory check produces a non-zero exit code",
        "Tests run without contacting real production endpoints",
      ],
      solution: `import argparse, asyncio, json, sys
from dataclasses import asdict, dataclass
from pathlib import Path

@dataclass
class Check:
    name: str
    passed: bool
    detail: str

async def probe(name: str, healthy: bool) -> Check:
    await asyncio.sleep(0.05)
    return Check(name, healthy, "healthy" if healthy else "unavailable")

async def main(config_path: str) -> int:
    config = json.loads(Path(config_path).read_text(encoding="utf-8"))
    checks = await asyncio.gather(
        probe("api", config.get("api_healthy", False)),
        probe("database", config.get("database_healthy", False)),
    )
    Path("readiness.json").write_text(
        json.dumps([asdict(check) for check in checks], indent=2),
        encoding="utf-8",
    )
    return 0 if all(check.passed for check in checks) else 2

parser = argparse.ArgumentParser()
parser.add_argument("--config", required=True)
args = parser.parse_args()
sys.exit(asyncio.run(main(args.config)))`,
      result: "CI receives a repeatable pass/fail decision and a readiness.json evidence artifact before any production deployment begins.",
    },
    {
      id: "python-incident-correlator",
      title: "Create an SRE incident log correlator",
      role: "On-call SRE investigating intermittent API latency",
      incident: "Errors are spread across gateway, application, and worker logs. Manual searches take too long and timestamps use different formats.",
      mission: "Build a memory-efficient Python tool that streams multiple logs, normalizes events, groups related request IDs, and generates an incident timeline.",
      skills: ["pathlib", "generators", "regular expressions", "datetime", "collections", "CSV/JSON", "testing"],
      deliverables: [
        "Recursive log discovery with include and exclude patterns",
        "A generator-based parser that handles malformed lines safely",
        "Request-ID correlation and a time-ordered incident timeline",
        "JSON summary plus CSV evidence for the post-incident review",
      ],
      stages: [
        { title: "Stream events", details: "Discover log files and yield one normalized event at a time so multi-gigabyte logs do not fill memory." },
        { title: "Correlate symptoms", details: "Normalize UTC timestamps, group by request ID, and calculate error counts and slowest operations." },
        { title: "Produce evidence", details: "Write a concise incident summary, retain source filenames, and test with representative log fixtures." },
      ],
      acceptance: [
        "Processes large files without loading them completely",
        "Malformed lines are counted and skipped, not fatal",
        "Events are ordered using timezone-aware timestamps",
        "The report identifies the first failure and affected request IDs",
      ],
      solution: `import json
from collections import defaultdict
from pathlib import Path

def error_events(root: Path):
    for path in root.rglob("*.log"):
        with path.open(encoding="utf-8") as stream:
            for line in stream:
                if "ERROR" in line:
                    timestamp, request_id, message = line.strip().split("|", 2)
                    yield {
                        "timestamp": timestamp,
                        "request_id": request_id,
                        "message": message,
                        "source": str(path),
                    }

def correlate(root: Path) -> dict:
    grouped = defaultdict(list)
    for event in error_events(root):
        grouped[event["request_id"]].append(event)
    return {key: sorted(events, key=lambda item: item["timestamp"])
            for key, events in grouped.items()}

Path("incident.json").write_text(
    json.dumps(correlate(Path("logs")), indent=2),
    encoding="utf-8",
)`,
      result: "The on-call engineer receives a request-by-request failure timeline and can move from symptom to likely cause without manual log stitching.",
    },
  ],
  "os-files": [
    {
      id: "os-config-safety",
      title: "Build an atomic configuration backup and rollback tool",
      role: "DevOps engineer maintaining configuration on a fleet of application hosts",
      incident: "A partially written configuration file caused services to fail during a rolling restart.",
      mission: "Create a cross-platform tool that validates configuration, creates timestamped backups, writes through a temporary file, and rolls back after failed verification.",
      skills: ["pathlib", "shutil", "temporary files", "os.replace", "hashing", "JSON manifests"],
      deliverables: ["Backup and apply commands", "SHA-256 manifest", "Atomic replacement workflow", "Rollback and retention policy"],
      stages: [
        { title: "Inventory and verify", details: "Resolve paths, verify the source exists, and calculate the current checksum before changing anything." },
        { title: "Apply atomically", details: "Write the candidate to a sibling temporary file, validate it, then replace the target in one filesystem operation." },
        { title: "Recover safely", details: "Restore the verified backup after a failed health check and record every action in a JSON manifest." },
      ],
      acceptance: ["No partial target file is observable", "Backups preserve metadata", "Rollback verifies the backup checksum", "Repeated runs enforce the same retention limit"],
      solution: `import hashlib, json, os, shutil
from pathlib import Path

def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()

def apply_config(candidate: Path, target: Path) -> dict:
    backup = target.with_suffix(target.suffix + ".bak")
    temp = target.with_suffix(target.suffix + ".tmp")
    if target.exists():
        shutil.copy2(target, backup)
    shutil.copy2(candidate, temp)
    os.replace(temp, target)
    manifest = {"target": str(target), "sha256": digest(target)}
    Path("config-change.json").write_text(json.dumps(manifest, indent=2))
    return manifest`,
      result: "Configuration changes become atomic, auditable, and recoverable without leaving corrupted files behind.",
    },
    {
      id: "os-artifact-retention",
      title: "Create a build-artifact integrity and retention pipeline",
      role: "DevOps platform engineer managing artifacts produced by enterprise CI pipelines",
      incident: "Disk usage reached 100%, while the only known-good rollback artifact had an unverified checksum.",
      mission: "Discover artifacts, verify checksums, archive approved releases, and remove only expired unprotected files in dry-run-first mode.",
      skills: ["file discovery", "metadata", "zipfile", "hashlib", "CSV reporting", "safe deletion"],
      deliverables: ["Artifact inventory report", "Integrity verification", "Compressed release bundle", "Dry-run retention cleanup"],
      stages: [
        { title: "Build inventory", details: "Collect path, size, modification time, release label, and SHA-256 for every artifact." },
        { title: "Protect releases", details: "Archive approved artifacts and write a manifest inside the bundle." },
        { title: "Apply retention", details: "Preview expired candidates, exclude protected releases, and delete only after explicit apply mode." },
      ],
      acceptance: ["Dry-run is the default", "Protected releases are never selected", "Every archive has a checksum manifest", "Cleanup reports reclaimed bytes"],
      solution: `import hashlib
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile

def checksum(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()

def archive_release(files: list[Path], destination: Path) -> None:
    with ZipFile(destination, "w", ZIP_DEFLATED) as archive:
        for path in files:
            archive.write(path, arcname=path.name)
        manifest = "\\n".join(f"{checksum(path)}  {path.name}" for path in files)
        archive.writestr("SHA256SUMS", manifest)

artifacts = list(Path("artifacts").glob("*.tar.gz"))
archive_release(artifacts, Path("release-bundle.zip"))`,
      result: "Release storage stays within policy while every retained rollback artifact has verifiable integrity evidence.",
    },
  ],
  "linux-automation": [
    {
      id: "linux-self-healing",
      title: "Build a systemd service health and self-healing agent",
      role: "Linux SRE responsible for a customer-facing API service",
      incident: "The API process remained active but stopped serving traffic; systemd alone did not detect the application failure.",
      mission: "Implement a guarded health agent that checks systemd and HTTP health, gathers diagnostics, and performs a rate-limited restart with audit logs.",
      skills: ["subprocess", "systemd", "timeouts", "signals", "journald", "rate limiting", "dry-run"],
      deliverables: ["Service and endpoint checks", "Diagnostic bundle", "Guarded restart policy", "Structured audit log and exit codes"],
      stages: [
        { title: "Measure health", details: "Run systemctl with argument lists and timeouts, then compare process state with the application endpoint." },
        { title: "Capture evidence", details: "Save recent journal entries, process information, disk usage, and load before remediation." },
        { title: "Remediate safely", details: "Enforce cooldown and restart limits, support dry-run, restart once, and verify recovery." },
      ],
      acceptance: ["No shell=True command execution", "Every command has a timeout", "Restart storms are prevented", "Failure evidence is captured before restart"],
      solution: `import subprocess
from datetime import datetime, timezone

def command(args: list[str]) -> subprocess.CompletedProcess[str]:
    return subprocess.run(args, capture_output=True, text=True, timeout=10)

def service_active(name: str) -> bool:
    return command(["systemctl", "is-active", "--quiet", name]).returncode == 0

def recover(name: str, dry_run: bool = True) -> bool:
    if service_active(name):
        return True
    if dry_run:
        print(f"would restart {name}")
        return False
    result = command(["systemctl", "restart", name])
    print(datetime.now(timezone.utc).isoformat(), name, result.returncode)
    return result.returncode == 0 and service_active(name)`,
      result: "The agent repairs a verified service failure once, preserves diagnostic evidence, and avoids unsafe restart loops.",
    },
    {
      id: "linux-triage-bundle",
      title: "Generate an automated Linux incident triage bundle",
      role: "On-call engineer responding to high load and disk alerts",
      incident: "Engineers spent the first 20 minutes of incidents manually collecting the same host evidence.",
      mission: "Create a non-destructive collector for CPU, memory, disk, processes, open ports, service state, and bounded log excerpts.",
      skills: ["subprocess", "shutil.disk_usage", "streaming logs", "permissions", "tar archives", "redaction"],
      deliverables: ["Modular collectors", "Timeout and error isolation", "Secret redaction", "Compressed timestamped support bundle"],
      stages: [
        { title: "Collect bounded evidence", details: "Run allow-listed read-only commands and cap both execution time and output size." },
        { title: "Redact sensitive data", details: "Remove tokens, passwords, and environment secrets before saving evidence." },
        { title: "Package and summarize", details: "Create a compressed bundle with a top-level health summary and per-collector errors." },
      ],
      acceptance: ["Collectors never modify the host", "One failed command does not stop the bundle", "Secrets are redacted", "Bundle creation completes within a defined timeout"],
      solution: `import json, shutil, subprocess
from pathlib import Path

COMMANDS = {
    "uptime": ["uptime"],
    "processes": ["ps", "-eo", "pid,comm,%cpu,%mem", "--sort=-%cpu"],
    "failed_services": ["systemctl", "--failed", "--no-pager"],
}

def collect() -> dict:
    report = {}
    for name, args in COMMANDS.items():
        result = subprocess.run(args, capture_output=True, text=True, timeout=10)
        report[name] = {"code": result.returncode, "output": result.stdout[:20000]}
    total, used, free = shutil.disk_usage("/")
    report["disk"] = {"total": total, "used": used, "free": free}
    return report

Path("triage.json").write_text(json.dumps(collect(), indent=2))`,
      result: "The responder receives consistent evidence in seconds and can focus immediately on diagnosis rather than manual collection.",
    },
  ],
  "aws-boto3": [
    {
      id: "aws-multi-account-inventory",
      title: "Build a multi-account AWS compliance inventory",
      role: "Cloud platform engineer responsible for development and production accounts",
      incident: "An internet-facing instance and unencrypted bucket were discovered during an audit, but the central inventory was incomplete.",
      mission: "Use boto3 to assume read-only roles, paginate EC2 and S3 inventory, evaluate compliance rules, and publish account-level evidence.",
      skills: ["boto3 Session", "STS AssumeRole", "paginators", "EC2/S3 APIs", "tags", "retry configuration", "CSV/JSON"],
      deliverables: ["Cross-account role session factory", "Paginated inventory collectors", "Compliance rule engine", "Consolidated evidence report"],
      stages: [
        { title: "Assume least privilege", details: "Use STS temporary credentials and verify the active account with GetCallerIdentity." },
        { title: "Collect everything", details: "Use regional iteration and paginators so large accounts are not truncated." },
        { title: "Evaluate and report", details: "Flag missing ownership tags, public exposure, and encryption gaps without changing resources." },
      ],
      acceptance: ["No long-lived access keys", "Every API list is fully paginated", "AccessDenied is isolated per account", "Reports include account, region, ARN, rule, and evidence"],
      solution: `import boto3

def assumed_session(role_arn: str) -> boto3.Session:
    response = boto3.client("sts").assume_role(
        RoleArn=role_arn,
        RoleSessionName="central-inventory",
    )
    keys = response["Credentials"]
    return boto3.Session(
        aws_access_key_id=keys["AccessKeyId"],
        aws_secret_access_key=keys["SecretAccessKey"],
        aws_session_token=keys["SessionToken"],
    )

def instances(session: boto3.Session, region: str):
    ec2 = session.client("ec2", region_name=region)
    paginator = ec2.get_paginator("describe_instances")
    for page in paginator.paginate():
        for reservation in page["Reservations"]:
            yield from reservation["Instances"]`,
      result: "Security and platform teams receive a complete, repeatable inventory with actionable compliance evidence across every approved AWS account.",
    },
    {
      id: "aws-alarm-remediator",
      title: "Create a guarded AWS alarm remediation workflow",
      role: "SRE automating repetitive recovery for an EC2 worker fleet",
      incident: "A runbook required manual instance recovery during off-hours, increasing mean time to recovery.",
      mission: "Consume an alarm event, validate resource tags and state, gather CloudWatch evidence, execute an allow-listed boto3 action, and verify recovery.",
      skills: ["boto3 clients", "CloudWatch", "EC2 waiters", "idempotency", "dry-run", "SNS/EventBridge", "audit records"],
      deliverables: ["Event validation", "Eligibility policy", "Dry-run remediation", "Waiter-based verification and notification"],
      stages: [
        { title: "Validate the event", details: "Reject malformed, stale, duplicate, or unsupported alarms before looking up the resource." },
        { title: "Enforce guardrails", details: "Require opt-in tags, allowed environments, a cooldown window, and a supported current state." },
        { title: "Act and verify", details: "Record evidence, perform one approved action, wait for the desired state, and publish the outcome." },
      ],
      acceptance: ["Dry-run produces the full decision without mutation", "Only tagged resources are eligible", "Duplicate events are idempotent", "Every action records before/after state"],
      solution: `import boto3

ec2 = boto3.client("ec2", region_name="ap-south-1")

def restart_instance(instance_id: str, dry_run: bool = True) -> str:
    response = ec2.describe_instances(InstanceIds=[instance_id])
    instance = response["Reservations"][0]["Instances"][0]
    tags = {tag["Key"]: tag["Value"] for tag in instance.get("Tags", [])}
    if tags.get("AutoRemediate") != "true":
        return "skipped: resource has not opted in"
    if dry_run:
        return f"would reboot {instance_id}"
    ec2.reboot_instances(InstanceIds=[instance_id])
    waiter = ec2.get_waiter("instance_status_ok")
    waiter.wait(InstanceIds=[instance_id])
    return "recovered"`,
      result: "Eligible alarms trigger a bounded, auditable recovery while unapproved resources remain untouched.",
    },
  ],
  "azure-sdk": [
    {
      id: "azure-compliance-inventory",
      title: "Build an Azure VM and Storage compliance inventory",
      role: "Azure platform engineer supporting multiple subscriptions",
      incident: "Unmanaged disks and public storage settings were found after teams bypassed the standard provisioning path.",
      mission: "Authenticate with DefaultAzureCredential, inventory subscriptions, VMs, disks, and storage, then evaluate tagging, encryption, and exposure rules.",
      skills: ["DefaultAzureCredential", "management clients", "Azure Resource Graph", "paging", "typed exceptions", "CSV/JSON"],
      deliverables: ["Subscription-aware client factory", "Paged resource inventory", "Compliance findings", "Management-ready summary"],
      stages: [
        { title: "Use the identity chain", details: "Run locally with Azure CLI identity and in Azure with managed identity without changing code." },
        { title: "Normalize resources", details: "Collect IDs, regions, tags, power state, disk configuration, and storage network settings." },
        { title: "Evaluate policy", details: "Generate evidence for missing owner tags, public access, and encryption or backup gaps." },
      ],
      acceptance: ["No credentials in source", "All subscriptions are identified in output", "Authorization failures do not hide other subscriptions", "Findings link policy to resource evidence"],
      solution: `from azure.identity import DefaultAzureCredential
from azure.mgmt.compute import ComputeManagementClient

def inventory(subscription_id: str) -> list[dict]:
    credential = DefaultAzureCredential()
    compute = ComputeManagementClient(credential, subscription_id)
    records = []
    for vm in compute.virtual_machines.list_all():
        records.append({
            "id": vm.id,
            "name": vm.name,
            "location": vm.location,
            "owner": (vm.tags or {}).get("owner", "missing"),
            "compliant": "owner" in (vm.tags or {}),
        })
    return records`,
      result: "Cloud owners receive a subscription-wide resource register and evidence-based compliance backlog without hard-coded credentials.",
    },
    {
      id: "azure-monitor-remediation",
      title: "Create an Azure Monitor incident remediation runner",
      role: "SRE operating a VM-backed internal application platform",
      incident: "A memory-pressure alert required repeated manual checks, VM restart approval, and post-recovery validation.",
      mission: "Turn an Azure Monitor alert into a guarded runbook that queries metrics, validates tags, starts or restarts a VM through a poller, and verifies health.",
      skills: ["Azure Monitor", "ComputeManagementClient", "pollers", "managed identity", "Key Vault", "audit logging"],
      deliverables: ["Alert parser", "Metric evidence query", "Eligibility guardrails", "Long-running operation handling and audit result"],
      stages: [
        { title: "Enrich the alert", details: "Resolve the resource ID, query recent metrics, and record the threshold window." },
        { title: "Make a safe decision", details: "Require remediation tags, supported environment, approval state, and a cooldown." },
        { title: "Execute and verify", details: "Start the SDK operation, wait on the poller, probe application health, and record the final outcome." },
      ],
      acceptance: ["Managed identity is used in Azure", "A dry-run path is available", "Poller failures are surfaced", "Audit data contains alert, decision, action, and verification"],
      solution: `from azure.identity import DefaultAzureCredential
from azure.mgmt.compute import ComputeManagementClient

credential = DefaultAzureCredential()

def start_vm(subscription_id: str, group: str, vm_name: str, dry_run=True):
    if dry_run:
        return f"would start {group}/{vm_name}"
    compute = ComputeManagementClient(credential, subscription_id)
    poller = compute.virtual_machines.begin_start(group, vm_name)
    poller.result()
    return f"started {group}/{vm_name}"`,
      result: "The alert follows a controlled, identity-safe remediation path with metric evidence and verified recovery.",
    },
  ],
  production: [
    {
      id: "production-canary-orchestrator",
      title: "Build a canary deployment and automatic rollback orchestrator",
      role: "Release SRE deploying a critical API across multiple environments",
      incident: "A deployment passed infrastructure checks but increased error rate after full rollout, requiring a manual rollback.",
      mission: "Create a provider-neutral Python orchestrator that validates artifacts, deploys a canary, evaluates SLO signals, promotes gradually, and rolls back safely.",
      skills: ["state machines", "interfaces", "structured logging", "metrics", "timeouts", "rollback", "unit tests"],
      deliverables: ["Deployment state model", "Canary stages", "SLO decision engine", "Idempotent rollback and audit trail"],
      stages: [
        { title: "Define desired state", details: "Represent version, environment, traffic percentage, approvals, and rollback target explicitly." },
        { title: "Evaluate the canary", details: "Compare error rate, latency, saturation, and minimum sample size against policy at each stage." },
        { title: "Promote or restore", details: "Advance traffic only after a passing window; otherwise restore the previous version and verify it." },
      ],
      acceptance: ["Re-running a completed stage is safe", "Insufficient metric samples cannot pass", "Rollback is tested and observable", "Every transition has actor, timestamp, reason, and evidence"],
      solution: `from dataclasses import dataclass

@dataclass
class Signals:
    error_rate: float
    p95_ms: float
    samples: int

def can_promote(signals: Signals) -> bool:
    return (
        signals.samples >= 1000
        and signals.error_rate < 0.01
        and signals.p95_ms < 400
    )

def deploy(provider, version: str, previous: str, signals: Signals) -> str:
    provider.set_traffic(version, 10)
    if not can_promote(signals):
        provider.rollback(previous)
        return "rolled back"
    provider.set_traffic(version, 100)
    return "promoted"`,
      result: "Releases advance only when real service signals pass policy, and failures restore the known-good version automatically.",
    },
    {
      id: "production-slo-automation",
      title: "Create an SLO and error-budget operations service",
      role: "Reliability engineer standardizing operational decisions across service teams",
      incident: "Teams continued risky releases while reliability was below target because SLO data was reviewed manually once a week.",
      mission: "Build a scheduled Python service that collects SLI data, calculates rolling SLOs and burn rates, opens actionable alerts, and generates audit-ready reports.",
      skills: ["clean architecture", "concurrency", "retries", "time windows", "structured data", "testing", "CI/CD"],
      deliverables: ["Provider adapters", "SLO calculation engine", "Multi-window burn-rate alerts", "Daily report and release-policy output"],
      stages: [
        { title: "Model reliability", details: "Define service, objective, window, good events, total events, and missing-data policy." },
        { title: "Calculate burn", details: "Compute compliance and short/long-window burn rates with deterministic time boundaries." },
        { title: "Drive operations", details: "Emit alerts with evidence, recommend release freeze or proceed, and retain a daily audit report." },
      ],
      acceptance: ["Calculations have unit tests with fixed timestamps", "Missing data is visible and cannot silently pass", "Alerts are deduplicated", "Provider failures retry with limits and preserve partial results"],
      solution: `from dataclasses import dataclass

@dataclass
class Window:
    good: int
    total: int

def availability(window: Window) -> float:
    return window.good / window.total if window.total else 0.0

def burn_rate(window: Window, objective: float) -> float:
    allowed_bad = 1 - objective
    observed_bad = 1 - availability(window)
    return observed_bad / allowed_bad

def release_allowed(window: Window, objective: float = 0.999) -> bool:
    return window.total > 0 and burn_rate(window, objective) < 1.0`,
      result: "Reliability data becomes a daily automated release signal, allowing teams to protect the error budget before customer impact grows.",
    },
  ],
};

type OperationalCapstoneSeed = Omit<
  Capstone,
  "deliverables" | "stages" | "acceptance"
> & {
  artifact: string;
  guardrail: string;
};

function operationalCapstone(seed: OperationalCapstoneSeed): Capstone {
  const { artifact, guardrail, ...project } = seed;
  return {
    ...project,
    deliverables: [
      `A working ${artifact} with configuration separated from code`,
      "Dry-run, structured logging, clear exit codes, and an audit report",
      "Unit tests with mocked infrastructure and explicit failure-path coverage",
      "A README, architecture notes, operating runbook, and sample evidence",
    ],
    stages: [
      {
        title: "Discover and model",
        details:
          "Collect the required operational state, normalize it into typed records, and reject incomplete or unsafe input.",
      },
      {
        title: "Decide with policy",
        details:
          "Compare observed state with the declared rule, explain every decision, and preview the action in dry-run mode.",
      },
      {
        title: "Act, verify, and report",
        details:
          "Execute only allow-listed changes, verify the resulting state, and write evidence that another engineer can audit.",
      },
    ],
    acceptance: [
      guardrail,
      "Every external operation has a timeout, bounded retry, and isolated error handling",
      "Repeated execution is idempotent and does not duplicate actions",
      "Tests exercise success, partial failure, invalid input, and dry-run behavior",
    ],
  };
}

const additionalCapstonesByChapter: Record<string, Capstone[]> = {
  "python-mastery": [
    operationalCapstone({
      id: "python-config-drift",
      title: "Build a configuration-drift detection CLI",
      role: "Platform engineer enforcing consistent service configuration",
      incident: "A manual production edit diverged from Git and caused different behavior across replicas.",
      mission: "Compare desired YAML or JSON configuration with live snapshots, classify drift, and produce a safe reconciliation plan.",
      skills: ["argparse", "pathlib", "JSON", "dataclasses", "recursive comparison", "exit codes"],
      artifact: "drift-detection command-line tool",
      guardrail: "The default mode reports drift and never modifies live configuration",
      solution: `import json
from pathlib import Path

def flatten(value, prefix=""):
    if isinstance(value, dict):
        return {key: item for name, child in value.items()
                for key, item in flatten(child, f"{prefix}.{name}".strip(".")).items()}
    return {prefix: value}

desired = flatten(json.loads(Path("desired.json").read_text()))
actual = flatten(json.loads(Path("actual.json").read_text()))
drift = {key: {"desired": desired.get(key), "actual": actual.get(key)}
         for key in desired.keys() | actual.keys() if desired.get(key) != actual.get(key)}
print(json.dumps(drift, indent=2))`,
      result: "Engineers receive an exact, reviewable drift report before deciding whether to reconcile production.",
    }),
    operationalCapstone({
      id: "python-rollout-observer",
      title: "Create a Kubernetes rollout observer",
      role: "SRE monitoring application deployments across namespaces",
      incident: "A rollout remained partially available while the CI job reported success.",
      mission: "Parse rollout snapshots, track ready replicas and image versions, enforce a deadline, and report the blocking workload.",
      skills: ["subprocess", "JSON parsing", "timeouts", "dataclasses", "logging", "testing"],
      artifact: "Kubernetes rollout observation utility",
      guardrail: "The tool uses read-only Kubernetes commands and cannot mutate workloads",
      solution: `import json, subprocess, time

def deployments(namespace):
    result = subprocess.run(
        ["kubectl", "get", "deploy", "-n", namespace, "-o", "json"],
        capture_output=True, text=True, check=True, timeout=15,
    )
    return json.loads(result.stdout)["items"]

def ready(item):
    desired = item["spec"].get("replicas", 1)
    return item.get("status", {}).get("readyReplicas", 0) == desired

blocked = [item["metadata"]["name"] for item in deployments("production") if not ready(item)]
print({"blocked": blocked})`,
      result: "The delivery pipeline fails with the names and readiness evidence of workloads that did not complete rollout.",
    }),
    operationalCapstone({
      id: "python-synthetic-monitor",
      title: "Develop a multi-endpoint synthetic monitoring runner",
      role: "SRE validating critical user journeys from several regions",
      incident: "Basic uptime checks passed while authentication and checkout dependencies were failing.",
      mission: "Run configurable synthetic steps concurrently, validate latency and response contracts, and emit SLI-compatible results.",
      skills: ["asyncio", "HTTP clients", "timeouts", "percentiles", "JSON", "structured logs"],
      artifact: "synthetic monitoring runner",
      guardrail: "Synthetic requests use dedicated test identities and never modify customer data",
      solution: `import asyncio, time

async def check(name, operation, limit_ms):
    started = time.monotonic()
    status = await asyncio.wait_for(operation(), timeout=limit_ms / 1000)
    latency = round((time.monotonic() - started) * 1000)
    return {"name": name, "ok": status == 200 and latency <= limit_ms, "latency_ms": latency}

async def run(checks):
    return await asyncio.gather(*(check(**item) for item in checks), return_exceptions=True)`,
      result: "Monitoring reports journey-level availability and latency instead of relying on a shallow process check.",
    }),
    operationalCapstone({
      id: "python-iac-risk",
      title: "Build an infrastructure-plan risk analyzer",
      role: "Platform engineer reviewing Terraform plans in CI",
      incident: "A routine change replaced a production database because destructive plan actions were missed.",
      mission: "Parse Terraform plan JSON, score risky changes, enforce environment policy, and generate pull-request evidence.",
      skills: ["JSON", "rule engines", "enums", "CLI design", "testing", "CI exit codes"],
      artifact: "Terraform plan risk-analysis gate",
      guardrail: "The analyzer is read-only and blocks destructive production actions unless explicitly approved",
      solution: `import json
from pathlib import Path

RISK = {"delete": 5, "create": 1, "update": 2, "no-op": 0}

def score(change):
    return sum(RISK.get(action, 3) for action in change["change"]["actions"])

plan = json.loads(Path("tfplan.json").read_text())
findings = [{"address": item["address"], "risk": score(item)}
            for item in plan["resource_changes"] if score(item) >= 5]
print(json.dumps(findings, indent=2))`,
      result: "Pull requests surface destructive infrastructure changes before approval and deployment.",
    }),
    operationalCapstone({
      id: "python-runbook-cli",
      title: "Turn an operational runbook into a guarded automation CLI",
      role: "SRE reducing repetitive incident-response toil",
      incident: "Manual runbook steps were executed out of order during a high-severity incident.",
      mission: "Model runbook steps with preconditions, approvals, dry-run output, checkpoints, rollback, and a complete execution record.",
      skills: ["classes", "protocols", "state machines", "argparse", "logging", "rollback"],
      artifact: "checkpointed runbook automation CLI",
      guardrail: "Destructive steps require an explicit apply flag and a recorded approval",
      solution: `from dataclasses import dataclass

@dataclass
class Step:
    name: str
    check: callable
    action: callable

def execute(steps, apply=False):
    report = []
    for step in steps:
        allowed = step.check()
        outcome = step.action() if allowed and apply else "preview"
        report.append({"step": step.name, "allowed": allowed, "outcome": outcome})
    return report`,
      result: "Responders execute the approved runbook in order with checkpoints, evidence, and a safe preview path.",
    }),
  ],
  "os-files": [
    operationalCapstone({
      id: "os-log-retention",
      title: "Build a policy-driven log rotation and retention manager",
      role: "Platform engineer controlling disk growth on build and utility hosts",
      incident: "Unbounded application logs exhausted the root filesystem and interrupted deployments.",
      mission: "Discover oversized logs, rotate active files safely, compress closed files, and enforce tiered retention rules.",
      skills: ["pathlib", "file metadata", "gzip", "atomic rename", "retention policy", "dry-run"],
      artifact: "log rotation and retention manager",
      guardrail: "Active files are copied or renamed safely and deletion is disabled by default",
      solution: `import gzip, shutil
from pathlib import Path

def rotate(path: Path, limit: int):
    if path.stat().st_size < limit:
        return "within-policy"
    archive = path.with_suffix(path.suffix + ".1.gz")
    with path.open("rb") as source, gzip.open(archive, "wb") as target:
        shutil.copyfileobj(source, target)
    path.write_text("", encoding="utf-8")
    return str(archive)`,
      result: "Hosts remain within disk policy while recent diagnostic logs stay compressed and available.",
    }),
    operationalCapstone({
      id: "os-permission-audit",
      title: "Create a secrets and filesystem-permission auditor",
      role: "DevSecOps engineer auditing CI runners and automation hosts",
      incident: "A credentials file was accidentally created with world-readable permissions.",
      mission: "Scan approved roots for secret-like files, inspect Unix modes and ownership, redact evidence, and propose safe corrections.",
      skills: ["pathlib", "stat", "ownership", "pattern matching", "redaction", "CSV reports"],
      artifact: "filesystem permission auditing tool",
      guardrail: "The scanner never reads secret values into its report and fixes require explicit apply mode",
      solution: `import stat
from pathlib import Path

SENSITIVE = {".env", "credentials", "id_rsa"}

def finding(path: Path):
    mode = stat.S_IMODE(path.stat().st_mode)
    if path.name in SENSITIVE and mode & 0o077:
        return {"path": str(path), "mode": oct(mode), "expected": "0o600"}

findings = [item for path in Path("workspace").rglob("*")
            if path.is_file() and (item := finding(path))]
print(findings)`,
      result: "Automation hosts receive a value-free report of exposed credential files and the exact safe mode required.",
    }),
    operationalCapstone({
      id: "os-capacity-forecast",
      title: "Develop a filesystem capacity and growth analyzer",
      role: "SRE forecasting storage exhaustion across platform nodes",
      incident: "A rapidly growing cache volume crossed its alert threshold between daily checks.",
      mission: "Create repeatable snapshots, calculate directory growth, rank large paths, and estimate time to capacity.",
      skills: ["pathlib", "disk usage", "CSV history", "statistics", "top-N reports", "alerts"],
      artifact: "filesystem growth forecasting utility",
      guardrail: "Scanning stays inside configured roots and excludes virtual or sensitive filesystems",
      solution: `from pathlib import Path

def directory_bytes(root: Path) -> int:
    total = 0
    for path in root.rglob("*"):
        try:
            if path.is_file():
                total += path.stat().st_size
        except OSError:
            continue
    return total

print({"cache_bytes": directory_bytes(Path("/var/cache/app"))})`,
      result: "SREs can prioritize growing paths and act before a filesystem reaches its operational limit.",
    }),
    operationalCapstone({
      id: "os-manifest-drift",
      title: "Implement a host file-integrity baseline monitor",
      role: "Platform engineer protecting critical automation configuration",
      incident: "A critical startup script changed outside the deployment process and was not detected.",
      mission: "Create a signed-style checksum baseline, compare later snapshots, and classify created, modified, and missing files.",
      skills: ["hashlib", "JSON manifests", "path normalization", "file metadata", "diff reports", "exclusions"],
      artifact: "file-integrity baseline monitor",
      guardrail: "Baseline updates require a separate explicit command and never happen during verification",
      solution: `import hashlib, json
from pathlib import Path

def snapshot(root: Path):
    return {
        str(path.relative_to(root)): hashlib.sha256(path.read_bytes()).hexdigest()
        for path in root.rglob("*") if path.is_file()
    }

current = snapshot(Path("config"))
baseline = json.loads(Path("baseline.json").read_text())
changed = {name for name in current.keys() | baseline.keys()
           if current.get(name) != baseline.get(name)}
print(sorted(changed))`,
      result: "Unauthorized or accidental changes to platform configuration are detected with exact path and checksum evidence.",
    }),
    operationalCapstone({
      id: "os-restore-drill",
      title: "Automate backup restore verification drills",
      role: "SRE proving that platform backups are recoverable",
      incident: "A backup job was green for months, but its archive could not be restored during an incident.",
      mission: "Select a recent backup, extract it into isolation, verify manifests, run validation checks, and publish recovery evidence.",
      skills: ["archives", "temporary directories", "hashing", "manifests", "cleanup", "reports"],
      artifact: "backup restore-verification runner",
      guardrail: "Restores occur only inside a newly created temporary directory",
      solution: `import hashlib, tempfile
from pathlib import Path
from zipfile import ZipFile

def verify(archive: Path, expected: dict):
    with tempfile.TemporaryDirectory() as directory:
        with ZipFile(archive) as bundle:
            bundle.extractall(directory)
        root = Path(directory)
        return all(
            hashlib.sha256((root / name).read_bytes()).hexdigest() == digest
            for name, digest in expected.items()
        )`,
      result: "Backup health is measured by successful isolated restoration and integrity checks, not job completion alone.",
    }),
  ],
  "linux-automation": [
    operationalCapstone({
      id: "linux-patch-readiness",
      title: "Build a Linux patch-readiness orchestrator",
      role: "SRE preparing a fleet for scheduled security maintenance",
      incident: "A node rebooted without enough capacity elsewhere in the cluster, reducing service availability.",
      mission: "Check capacity, package state, uptime, active sessions, and workload drain readiness before approving a host patch.",
      skills: ["subprocess", "package managers", "load checks", "timeouts", "maintenance windows", "exit codes"],
      artifact: "Linux patch-readiness gate",
      guardrail: "The readiness command is read-only and cannot install packages or reboot hosts",
      solution: `import shutil, subprocess

def check(args):
    return subprocess.run(args, capture_output=True, text=True, timeout=15)

def ready():
    free = shutil.disk_usage("/").free
    failed = check(["systemctl", "--failed", "--no-legend"]).stdout.strip()
    updates = check(["apt-get", "-s", "upgrade"]).returncode
    return free > 5_000_000_000 and not failed and updates == 0

print({"patch_ready": ready()})`,
      result: "Maintenance proceeds only when the node and surrounding platform meet the declared safety conditions.",
    }),
    operationalCapstone({
      id: "linux-ssh-compliance",
      title: "Create an SSH access and account compliance auditor",
      role: "Platform engineer maintaining hardened Linux access",
      incident: "A former contractor account and an unauthorized SSH key remained active on a utility host.",
      mission: "Inventory interactive users, sudo membership, authorized keys, shell policy, and recent access without exposing key contents.",
      skills: ["pwd/grp", "pathlib", "permissions", "subprocess", "fingerprints", "compliance reports"],
      artifact: "Linux access compliance auditor",
      guardrail: "The report stores only public-key fingerprints and never private or full key material",
      solution: `import hashlib, pwd
from pathlib import Path

def fingerprint(line: str) -> str:
    return hashlib.sha256(line.encode()).hexdigest()[:16]

records = []
for user in pwd.getpwall():
    keys = Path(user.pw_dir) / ".ssh" / "authorized_keys"
    if user.pw_shell.endswith(("bash", "zsh")) and keys.exists():
        records.append({"user": user.pw_name,
                        "keys": [fingerprint(line) for line in keys.read_text().splitlines()]})
print(records)`,
      result: "Reviewers receive an accountable map of interactive Linux access without leaking authentication material.",
    }),
    operationalCapstone({
      id: "linux-container-host",
      title: "Develop a container-host health inspector",
      role: "SRE operating Linux nodes that run container workloads",
      incident: "Container restarts increased because inode, cgroup, and runtime pressure were not in the standard host check.",
      mission: "Collect runtime state, disk and inode pressure, cgroup limits, kernel messages, and failed units into one health decision.",
      skills: ["subprocess", "procfs", "cgroups", "disk/inodes", "kernel logs", "JSON"],
      artifact: "container-host health inspection command",
      guardrail: "All collectors are read-only and bound by strict output and execution limits",
      solution: `import json, subprocess

def collect(name, args):
    result = subprocess.run(args, capture_output=True, text=True, timeout=10)
    return {"name": name, "code": result.returncode, "output": result.stdout[-10000:]}

report = [
    collect("runtime", ["systemctl", "is-active", "containerd"]),
    collect("containers", ["ctr", "containers", "list"]),
    collect("kernel", ["dmesg", "--level=err"]),
]
print(json.dumps(report, indent=2))`,
      result: "Node health includes the Linux and container-runtime signals required to explain workload instability.",
    }),
    operationalCapstone({
      id: "linux-certificate-monitor",
      title: "Build a TLS certificate expiry monitor",
      role: "SRE protecting ingress endpoints and internal service certificates",
      incident: "An internal certificate expired silently and broke service-to-service communication.",
      mission: "Discover configured endpoints and certificate files, calculate days remaining, validate names, and alert by severity.",
      skills: ["ssl", "socket", "datetime", "pathlib", "timeouts", "alert thresholds"],
      artifact: "TLS certificate expiry monitoring utility",
      guardrail: "Network probes use short timeouts and certificate files are read without private-key access",
      solution: `import socket, ssl
from datetime import datetime, timezone

def days_left(host: str, port: int = 443) -> int:
    context = ssl.create_default_context()
    with socket.create_connection((host, port), timeout=5) as raw:
        with context.wrap_socket(raw, server_hostname=host) as secure:
            expires = ssl.cert_time_to_seconds(secure.getpeercert()["notAfter"])
    return int((datetime.fromtimestamp(expires, timezone.utc)
                - datetime.now(timezone.utc)).days)

print({"api.example.com": days_left("api.example.com")})`,
      result: "Expiring endpoint certificates become visible early enough for controlled rotation.",
    }),
    operationalCapstone({
      id: "linux-scheduler-audit",
      title: "Audit cron jobs and systemd timers across a host",
      role: "Platform engineer reducing hidden scheduled-workload risk",
      incident: "An undocumented root cron job repeatedly deleted deployment artifacts.",
      mission: "Inventory cron locations and systemd timers, resolve command owners, flag risky patterns, and generate migration recommendations.",
      skills: ["pathlib", "systemd", "subprocess", "ownership", "command analysis", "reports"],
      artifact: "scheduled-task inventory and risk auditor",
      guardrail: "The auditor never enables, disables, or edits scheduled jobs",
      solution: `import subprocess
from pathlib import Path

def cron_files():
    roots = [Path("/etc/cron.d"), Path("/var/spool/cron")]
    return [path for root in roots if root.exists() for path in root.rglob("*") if path.is_file()]

timers = subprocess.run(
    ["systemctl", "list-timers", "--all", "--no-pager"],
    capture_output=True, text=True, timeout=10,
).stdout
print({"cron_files": [str(path) for path in cron_files()], "timers": timers})`,
      result: "Every scheduled Linux action has visible ownership, timing, command, and risk evidence.",
    }),
  ],
  "aws-boto3": [
    operationalCapstone({
      id: "aws-cost-governance",
      title: "Build an AWS cost and ownership governance reporter",
      role: "Cloud platform engineer controlling unowned and idle resources",
      incident: "Monthly cloud spend increased because development resources had no owner or expiry policy.",
      mission: "Use boto3 to inventory cost-driving resources, evaluate ownership tags and utilization, and produce accountable cleanup candidates.",
      skills: ["boto3", "Cost Explorer", "CloudWatch", "tags", "paginators", "CSV"],
      artifact: "AWS cost-governance reporting pipeline",
      guardrail: "The reporting workflow is read-only and never terminates or resizes resources",
      solution: `import boto3

ec2 = boto3.client("ec2")
cloudwatch = boto3.client("cloudwatch")

def unowned_instances():
    paginator = ec2.get_paginator("describe_instances")
    for page in paginator.paginate():
        for reservation in page["Reservations"]:
            for instance in reservation["Instances"]:
                tags = {item["Key"]: item["Value"] for item in instance.get("Tags", [])}
                if "Owner" not in tags:
                    yield instance["InstanceId"]

print(list(unowned_instances()))`,
      result: "Platform teams receive owner-aware savings candidates backed by inventory and utilization evidence.",
    }),
    operationalCapstone({
      id: "aws-iam-audit",
      title: "Create an AWS IAM credential exposure auditor",
      role: "Platform security engineer enforcing short-lived cloud access",
      incident: "A long-lived access key remained active beyond policy and was used from an unexpected location.",
      mission: "Inventory IAM credential reports, flag old or unused keys, review MFA and password state, and generate remediation tickets.",
      skills: ["boto3 IAM", "credential reports", "datetime", "pagination", "least privilege", "audit evidence"],
      artifact: "AWS IAM credential compliance auditor",
      guardrail: "The first phase is read-only; key deactivation requires separate approval and apply mode",
      solution: `import boto3, csv, io
from datetime import datetime, timezone

iam = boto3.client("iam")
iam.generate_credential_report()
content = iam.get_credential_report()["Content"].decode()
rows = list(csv.DictReader(io.StringIO(content)))
findings = [row["user"] for row in rows
            if row["access_key_1_active"] == "true" and row["mfa_active"] != "true"]
print(findings)`,
      result: "Identity owners receive precise evidence for long-lived credentials and missing MFA before access is changed.",
    }),
    operationalCapstone({
      id: "aws-snapshot-policy",
      title: "Automate EBS snapshot policy and restore evidence",
      role: "SRE protecting stateful workloads in AWS",
      incident: "A volume had snapshots, but none matched the documented retention and restore policy.",
      mission: "Create tagged snapshots, wait for completion, enforce retention by application, and record periodic restore-test evidence.",
      skills: ["boto3 EC2", "waiters", "tags", "retention", "dry-run", "idempotency"],
      artifact: "EBS snapshot lifecycle and verification tool",
      guardrail: "Deletion requires policy tags, minimum retained copies, dry-run review, and explicit apply mode",
      solution: `import boto3

ec2 = boto3.client("ec2")

def snapshot(volume_id: str, application: str):
    response = ec2.create_snapshot(
        VolumeId=volume_id,
        Description=f"managed backup for {application}",
        TagSpecifications=[{"ResourceType": "snapshot", "Tags": [
            {"Key": "ManagedBy", "Value": "platform-backup"},
            {"Key": "Application", "Value": application},
        ]}],
    )
    ec2.get_waiter("snapshot_completed").wait(SnapshotIds=[response["SnapshotId"]])
    return response["SnapshotId"]`,
      result: "Stateful AWS workloads have tagged, completed, retained, and periodically verified recovery points.",
    }),
    operationalCapstone({
      id: "aws-route53-failover",
      title: "Build a Route 53 failover readiness verifier",
      role: "SRE validating multi-region DNS recovery",
      incident: "A failover record existed, but its health check referenced the wrong endpoint.",
      mission: "Inventory failover records and health checks, validate primary/secondary symmetry, run synthetic probes, and publish readiness.",
      skills: ["boto3 Route53", "paginators", "DNS", "health checks", "synthetic probes", "reports"],
      artifact: "Route 53 failover readiness verifier",
      guardrail: "The verifier performs no DNS changes and cannot trigger production failover",
      solution: `import boto3

route53 = boto3.client("route53")

def records(zone_id):
    paginator = route53.get_paginator("list_resource_record_sets")
    for page in paginator.paginate(HostedZoneId=zone_id):
        yield from page["ResourceRecordSets"]

failover = [record for record in records("Z123")
            if record.get("Failover") in {"PRIMARY", "SECONDARY"}]
print(failover)`,
      result: "DNS recovery readiness is proven by matching records, health checks, and reachable regional endpoints.",
    }),
    operationalCapstone({
      id: "aws-ecs-rollout",
      title: "Create an ECS deployment health observer",
      role: "Platform engineer operating container services on Amazon ECS",
      incident: "A service deployment stabilized at desired count while tasks repeatedly failed application health checks.",
      mission: "Track ECS deployments, task-stop reasons, target health, and CloudWatch signals until success or a bounded failure.",
      skills: ["boto3 ECS", "ELBv2", "CloudWatch", "wait loops", "timeouts", "event evidence"],
      artifact: "ECS deployment observation and decision tool",
      guardrail: "Observation is read-only and times out instead of polling forever",
      solution: `import boto3, time

ecs = boto3.client("ecs")

def wait_healthy(cluster, service, deadline=300):
    end = time.monotonic() + deadline
    while time.monotonic() < end:
        item = ecs.describe_services(cluster=cluster, services=[service])["services"][0]
        if item["runningCount"] == item["desiredCount"] and len(item["deployments"]) == 1:
            return True
        time.sleep(10)
    return False`,
      result: "CI receives an evidence-backed ECS rollout result instead of relying only on desired task count.",
    }),
  ],
  "azure-sdk": [
    operationalCapstone({
      id: "azure-resource-governance",
      title: "Build an Azure resource-group governance auditor",
      role: "Azure platform engineer enforcing subscription standards",
      incident: "Resources without owner, environment, or expiry tags accumulated outside managed resource groups.",
      mission: "Inventory resource groups and resources, evaluate tags, locks, regions, and policy state, then publish accountable findings.",
      skills: ["Azure Identity", "ResourceManagementClient", "paging", "tags", "locks", "CSV"],
      artifact: "Azure resource-governance auditor",
      guardrail: "The auditor uses read-only role permissions and cannot create or delete resources",
      solution: `from azure.identity import DefaultAzureCredential
from azure.mgmt.resource import ResourceManagementClient

def findings(subscription_id):
    client = ResourceManagementClient(DefaultAzureCredential(), subscription_id)
    for group in client.resource_groups.list():
        tags = group.tags or {}
        missing = [key for key in ("owner", "environment") if key not in tags]
        if missing:
            yield {"group": group.name, "missing": missing}

print(list(findings("subscription-id")))`,
      result: "Subscription owners receive a complete governance backlog mapped to resource groups and required standards.",
    }),
    operationalCapstone({
      id: "azure-keyvault-rotation",
      title: "Create an Azure Key Vault rotation readiness monitor",
      role: "Platform engineer tracking application secret and certificate expiry",
      incident: "A service credential expired because ownership and rotation windows were not monitored.",
      mission: "Inventory Key Vault secret and certificate metadata, calculate rotation windows, map ownership tags, and raise evidence-rich alerts.",
      skills: ["DefaultAzureCredential", "SecretClient", "CertificateClient", "datetime", "paging", "alerts"],
      artifact: "Key Vault rotation readiness monitor",
      guardrail: "The monitor reads metadata only and never retrieves or logs secret values",
      solution: `from datetime import datetime, timezone
from azure.identity import DefaultAzureCredential
from azure.keyvault.secrets import SecretClient

client = SecretClient("https://vault.vault.azure.net", DefaultAzureCredential())
findings = []
for item in client.list_properties_of_secrets():
    if item.expires_on:
        days = (item.expires_on - datetime.now(timezone.utc)).days
        if days < 30:
            findings.append({"name": item.name, "days_left": days})
print(findings)`,
      result: "Credential owners receive advance rotation alerts without exposing secret material.",
    }),
    operationalCapstone({
      id: "azure-aks-health",
      title: "Build an AKS node-pool health and upgrade planner",
      role: "SRE maintaining production Azure Kubernetes Service clusters",
      incident: "A node-pool upgrade started with insufficient surge capacity and disrupted workloads.",
      mission: "Inventory AKS versions, node pools, capacity, availability zones, and upgrade paths, then generate a safe maintenance plan.",
      skills: ["ContainerServiceClient", "Azure Identity", "Kubernetes capacity", "version policy", "maintenance planning", "reports"],
      artifact: "AKS upgrade-readiness planner",
      guardrail: "The planner is read-only and never starts a cluster or node-pool upgrade",
      solution: `from azure.identity import DefaultAzureCredential
from azure.mgmt.containerservice import ContainerServiceClient

def node_pools(subscription_id, group, cluster):
    client = ContainerServiceClient(DefaultAzureCredential(), subscription_id)
    return [
        {"name": pool.name, "count": pool.count, "version": pool.orchestrator_version}
        for pool in client.agent_pools.list(group, cluster)
    ]

print(node_pools("subscription-id", "platform-rg", "production-aks"))`,
      result: "Cluster upgrades begin with verified version compatibility, capacity, and node-pool evidence.",
    }),
    operationalCapstone({
      id: "azure-nsg-audit",
      title: "Develop an Azure NSG exposure and rule auditor",
      role: "Cloud platform engineer protecting Azure network boundaries",
      incident: "A temporary management rule exposed SSH to the internet and was never removed.",
      mission: "Inventory NSGs and effective rules, normalize priorities and address prefixes, and flag public management or broad inbound access.",
      skills: ["NetworkManagementClient", "NSG rules", "CIDR", "paging", "policy checks", "JSON"],
      artifact: "Azure NSG exposure auditing tool",
      guardrail: "The first phase reports only; remediation requires approved rule IDs and apply mode",
      solution: `from azure.identity import DefaultAzureCredential
from azure.mgmt.network import NetworkManagementClient

def public_rules(subscription_id):
    client = NetworkManagementClient(DefaultAzureCredential(), subscription_id)
    for nsg in client.network_security_groups.list_all():
        for rule in nsg.security_rules or []:
            if rule.direction == "Inbound" and rule.access == "Allow":
                if rule.source_address_prefix in {"*", "0.0.0.0/0", "Internet"}:
                    yield {"nsg": nsg.name, "rule": rule.name, "port": rule.destination_port_range}

print(list(public_rules("subscription-id")))`,
      result: "Network owners receive exact NSG rules that expose management or application ports publicly.",
    }),
    operationalCapstone({
      id: "azure-backup-verifier",
      title: "Automate Azure Backup policy and recovery-point verification",
      role: "SRE proving recovery readiness for Azure workloads",
      incident: "A protected VM had no recent application-consistent recovery point despite a healthy vault.",
      mission: "Inventory protected items, policies, job failures, and latest recovery points, then classify RPO compliance.",
      skills: ["RecoveryServicesBackupClient", "Azure Identity", "paging", "RPO policy", "datetime", "evidence"],
      artifact: "Azure Backup recovery-readiness verifier",
      guardrail: "The verifier cannot trigger restore or delete recovery points",
      solution: `from datetime import datetime, timezone

def rpo_compliant(last_recovery, maximum_hours=24):
    age = datetime.now(timezone.utc) - last_recovery
    return age.total_seconds() <= maximum_hours * 3600

def summarize(items):
    return [{"name": item["name"],
             "rpo_ok": rpo_compliant(item["last_recovery"])}
            for item in items]`,
      result: "Backup readiness is measured against workload RPO using actual recovery-point timestamps.",
    }),
  ],
  production: [
    operationalCapstone({
      id: "production-chaos-readiness",
      title: "Build a guarded chaos-readiness experiment runner",
      role: "Reliability engineer validating service resilience",
      incident: "A dependency outage caused a cascading failure because fallback behavior had never been exercised.",
      mission: "Define bounded failure experiments, validate steady state, require approvals, inject one fault, and verify recovery automatically.",
      skills: ["state machines", "approvals", "metrics", "timeouts", "rollback", "audit logs"],
      artifact: "guarded resilience experiment runner",
      guardrail: "Experiments require an approved target, blast-radius limit, maintenance window, and automatic stop condition",
      solution: `from dataclasses import dataclass

@dataclass
class Experiment:
    target: str
    max_seconds: int
    approved: bool

def run(experiment, provider, healthy):
    if not experiment.approved or not healthy():
        return "blocked"
    provider.inject(experiment.target)
    try:
        return "resilient" if healthy() else "failed"
    finally:
        provider.restore(experiment.target)`,
      result: "Teams prove fallback and recovery behavior inside a controlled blast radius before a real outage.",
    }),
    operationalCapstone({
      id: "production-incident-timeline",
      title: "Create an incident timeline and handoff generator",
      role: "Incident commander coordinating multi-team response",
      incident: "Key decisions and ownership changes were lost across chat, alerts, and manual notes.",
      mission: "Normalize event exports, correlate alerts and actions, track owners and decisions, and generate live handoff and post-incident timelines.",
      skills: ["datetime", "event schemas", "deduplication", "correlation", "Markdown", "auditability"],
      artifact: "incident timeline and handoff generator",
      guardrail: "Sensitive tokens and personal data are redacted before events are written",
      solution: `from datetime import datetime

def timeline(events):
    unique = {event["id"]: event for event in events}
    return sorted(unique.values(), key=lambda event: datetime.fromisoformat(event["timestamp"]))

def markdown(events):
    return "\\n".join(
        f'- {event["timestamp"]} — {event["type"]}: {event["summary"]}'
        for event in timeline(events)
    )`,
      result: "Every responder sees the same ordered decisions, actions, owners, and current incident state.",
    }),
    operationalCapstone({
      id: "production-dependency-map",
      title: "Build a service dependency health map",
      role: "Platform SRE diagnosing cascading failures",
      incident: "Teams treated downstream symptoms independently because service dependencies were not visible.",
      mission: "Combine service catalog data with health and telemetry, propagate dependency risk, and identify likely upstream causes.",
      skills: ["graphs", "service catalogs", "health checks", "topological traversal", "JSON", "visual reports"],
      artifact: "service dependency health analysis tool",
      guardrail: "Health collection is read-only and cyclic dependencies are detected safely",
      solution: `def impacted(graph, failed):
    affected = set(failed)
    changed = True
    while changed:
        changed = False
        for service, dependencies in graph.items():
            if service not in affected and affected.intersection(dependencies):
                affected.add(service)
                changed = True
    return sorted(affected)

print(impacted({"api": ["database"], "frontend": ["api"]}, {"database"}))`,
      result: "Responders see the likely upstream failure and every dependent service affected by it.",
    }),
    operationalCapstone({
      id: "production-alert-quality",
      title: "Develop an alert quality and noise auditor",
      role: "SRE improving signal-to-noise for the on-call rotation",
      incident: "Frequent non-actionable alerts caused responders to miss a real service degradation.",
      mission: "Analyze alert history, group duplicates, calculate actionability and repeat rates, and recommend tuning with evidence.",
      skills: ["CSV/JSON", "statistics", "grouping", "time windows", "SLO mapping", "reports"],
      artifact: "alert quality auditing pipeline",
      guardrail: "Recommendations never disable alerts automatically",
      solution: `from collections import defaultdict

def summarize(alerts):
    grouped = defaultdict(list)
    for alert in alerts:
        grouped[alert["rule"]].append(alert)
    return {
        rule: {
            "count": len(items),
            "actionable_rate": sum(item["action_taken"] for item in items) / len(items),
        }
        for rule, items in grouped.items()
    }`,
      result: "Alert owners receive evidence-based candidates for deduplication, threshold tuning, or runbook improvement.",
    }),
    operationalCapstone({
      id: "production-dr-exercise",
      title: "Create a disaster-recovery exercise controller",
      role: "Platform engineering lead validating regional recovery",
      incident: "The documented recovery sequence had not been tested after several architecture changes.",
      mission: "Orchestrate a dry-run-first recovery exercise with prechecks, approvals, checkpoints, traffic validation, rollback, and timed evidence.",
      skills: ["workflow state", "provider interfaces", "checkpoints", "RTO/RPO", "rollback", "audit reports"],
      artifact: "disaster-recovery exercise controller",
      guardrail: "Production traffic changes require explicit approval and a verified rollback path",
      solution: `import time

def exercise(steps, approved=False):
    started = time.monotonic()
    report = []
    for step in steps:
        if step.destructive and not approved:
            report.append({"step": step.name, "status": "preview"})
            continue
        result = step.run()
        report.append({"step": step.name, "status": result})
        if result != "passed":
            break
    return {"rto_seconds": round(time.monotonic() - started), "steps": report}`,
      result: "Recovery readiness is backed by timed, repeatable exercise evidence and a verified rollback sequence.",
    }),
  ],
};

export const chapters: Chapter[] = [
  {
    id: "python-mastery",
    number: "01",
    track: "Python",
    title: "Python: foundation to advanced",
    description: "A complete practical progression before you begin the 100-question scenario bank.",
    tools: ["Python 3", "stdlib", "asyncio", "argparse", "unittest"],
    units: pythonUnits,
    scenarios: expand("python", pythonSeeds),
    capstones: [
      ...capstonesByChapter["python-mastery"],
      ...additionalCapstonesByChapter["python-mastery"],
    ],
  },
  {
    id: "os-files",
    number: "02",
    track: "OS",
    title: "Operating system & file automation",
    description: "Portable file operations, structured data, backups, archives, integrity, and safe writes.",
    tools: ["pathlib", "shutil", "json", "csv", "zipfile"],
    units: compactUnits([
      ["Portable paths", "Basic", "Model paths safely across operating systems.", `Path.home() / "reports"`],
      ["Discovery and metadata", "Basic", "Search files and inspect size and modification time.", `for path in root.rglob("*.log"):\n    print(path.stat().st_size)`],
      ["Safe file changes", "Intermediate", "Copy, move, rename, and delete with explicit checks.", `if source.exists():\n    shutil.copy2(source, backup)`],
      ["Structured input and output", "Intermediate", "Read and write JSON and CSV with explicit encodings.", `data = json.loads(path.read_text(encoding="utf-8"))`],
      ["Archives and integrity", "Advanced", "Package artifacts and verify them with cryptographic hashes.", `digest = hashlib.sha256(path.read_bytes()).hexdigest()`],
      ["Reliable update patterns", "Advanced", "Use temporary files and atomic replacement to avoid corruption.", `temp.write_text(content)\nos.replace(temp, target)`],
    ]),
    scenarios: expand("os", osSeeds),
    capstones: [
      ...capstonesByChapter["os-files"],
      ...additionalCapstonesByChapter["os-files"],
    ],
  },
  {
    id: "linux-automation",
    number: "03",
    track: "Linux",
    title: "Linux operations automation",
    description: "Processes, services, logs, permissions, environment, signals, and safe command execution.",
    tools: ["subprocess", "systemd", "signals", "permissions", "logs"],
    units: compactUnits([
      ["Commands without shell injection", "Basic", "Pass arguments as lists and capture output explicitly.", `subprocess.run(["systemctl", "is-active", "nginx"], check=False)`],
      ["Processes and resources", "Basic", "Inspect processes, memory, disk, and load.", `total, used, free = shutil.disk_usage("/")`],
      ["Logs and text streams", "Intermediate", "Process logs line by line and surface operational signals.", `for line in stream:\n    if "ERROR" in line.upper(): print(line)`],
      ["Permissions and ownership", "Intermediate", "Audit Unix modes before touching sensitive files.", `mode = stat.S_IMODE(path.stat().st_mode)`],
      ["Timeouts and signals", "Advanced", "Bound commands and stop or reload processes gracefully.", `subprocess.run(command, timeout=30)`],
      ["Idempotent maintenance", "Advanced", "Make repeated runs produce the same safe result.", `if stale.exists():\n    stale.unlink()`],
    ]),
    scenarios: expand("linux", linuxSeeds),
    capstones: [
      ...capstonesByChapter["linux-automation"],
      ...additionalCapstonesByChapter["linux-automation"],
    ],
  },
  {
    id: "aws-boto3",
    number: "04",
    track: "AWS",
    title: "AWS automation with boto3",
    description: "Production-minded boto3 clients, pagination, filters, metrics, waiters, retries, and cross-account sessions.",
    tools: ["boto3", "botocore", "EC2", "S3", "CloudWatch", "STS"],
    units: compactUnits([
      ["Credentials and sessions", "Basic", "Use profiles, roles, or environment credentials—never hard-code keys.", `session = boto3.Session(profile_name="dev")`],
      ["Clients and resources", "Basic", "Create explicit regional clients and understand service responses.", `ec2 = boto3.client("ec2", region_name="ap-south-1")`],
      ["Pagination and filtering", "Intermediate", "Handle large accounts without missing resources.", `paginator = s3.get_paginator("list_objects_v2")`],
      ["Tags and inventory", "Intermediate", "Normalize nested API responses into useful reports.", `name = next((t["Value"] for t in tags if t["Key"] == "Name"), "unnamed")`],
      ["Waiters, retries, and errors", "Advanced", "Use SDK mechanisms for eventual consistency and transient failures.", `Config(retries={"mode": "standard", "max_attempts": 10})`],
      ["Cross-account automation", "Advanced", "Assume least-privilege roles and build temporary sessions.", `response = sts.assume_role(RoleArn=role, RoleSessionName="inventory")`],
    ]),
    scenarios: expand("aws", awsSeeds),
    capstones: [
      ...capstonesByChapter["aws-boto3"],
      ...additionalCapstonesByChapter["aws-boto3"],
    ],
  },
  {
    id: "azure-sdk",
    number: "05",
    track: "Azure",
    title: "Azure SDK automation",
    description: "Identity, compute, resources, storage, monitoring, networking, secrets, and asynchronous clients.",
    tools: ["Azure Identity", "Compute", "Storage", "Monitor", "Key Vault"],
    units: compactUnits([
      ["Default identity chain", "Basic", "Use one credential strategy locally and in Azure-hosted workloads.", `credential = DefaultAzureCredential()`],
      ["Management clients", "Basic", "Work with subscription-scoped compute and resource APIs.", `compute = ComputeManagementClient(credential, subscription_id)`],
      ["Storage and inventory", "Intermediate", "List and process blobs without connection strings in code.", `service = BlobServiceClient(account_url, credential=credential)`],
      ["Metrics and networking", "Intermediate", "Query Azure Monitor and audit network resources.", `metrics.query_resource(resource_uri, metric_names=["Percentage CPU"])`],
      ["Pollers and exceptions", "Advanced", "Wait for long-running operations and handle typed SDK failures.", `poller = compute.virtual_machines.begin_start(group, vm)`],
      ["Async SDK clients", "Advanced", "Scale I/O-heavy Azure inventory with aio clients.", `async with BlobServiceClient(url, credential=credential) as client:`],
    ]),
    scenarios: expand("azure", azureSeeds),
    capstones: [
      ...capstonesByChapter["azure-sdk"],
      ...additionalCapstonesByChapter["azure-sdk"],
    ],
  },
  {
    id: "production",
    number: "06",
    track: "Production",
    title: "Production automation engineering",
    description: "Turn scripts into dependable tools with tests, logs, concurrency, safeguards, audits, and rollback.",
    tools: ["logging", "unittest.mock", "concurrency", "dry-run", "CI/CD"],
    units: compactUnits([
      ["Observable scripts", "Basic", "Add structured logs, metrics, and clear exit codes.", `logger.info("job complete", extra={"job_id": job_id})`],
      ["Retries and timeouts", "Basic", "Recover from transient failures without waiting forever.", `delay = min(2 ** attempt, 30)`],
      ["Dry-run and validation", "Intermediate", "Validate inputs and preview destructive actions.", `if args.dry_run: print(f"would delete {resource}")`],
      ["Tests and mocks", "Intermediate", "Test decisions without touching real infrastructure.", `with patch("app.client") as mock_client:`],
      ["Safe concurrency", "Advanced", "Bound parallel work and collect partial failures.", `ThreadPoolExecutor(max_workers=5)`],
      ["Idempotency and rollback", "Advanced", "Detect desired state and restore the previous state on failure.", `if current != desired:\n    apply(desired)`],
    ]),
    scenarios: expand("production", productionSeeds),
    capstones: [
      ...capstonesByChapter.production,
      ...additionalCapstonesByChapter.production,
    ],
  },
];

for (const chapter of chapters) {
  const titles = new Set(chapter.scenarios.map((scenario) => scenario.title));
  const tasks = new Set(chapter.scenarios.map((scenario) => scenario.task));
  if (
    chapter.scenarios.length !== 100 ||
    titles.size !== chapter.scenarios.length ||
    tasks.size !== chapter.scenarios.length
  ) {
    throw new Error(
      `${chapter.id} must contain exactly 100 scenarios with unique titles and tasks`,
    );
  }
}

export const totalScenarios = chapters.reduce(
  (total, chapter) => total + chapter.scenarios.length,
  0,
);

export const totalCapstones = chapters.reduce(
  (total, chapter) => total + chapter.capstones.length,
  0,
);
