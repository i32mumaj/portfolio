// Page sections as fake processes for `ps` / `kill` / `systemctl restart` in the terminal.
export const PROCS = [
  { pid: 1, name: 'init', cmd: '/sbin/init' },
  { pid: 412, name: 'hero', cmd: 'hero --core-dump', section: true },
  { pid: 418, name: 'about', cmd: 'about --whoami', section: true },
  { pid: 427, name: 'projects', cmd: 'uvicorn projects:app', section: true },
  { pid: 433, name: 'side', cmd: 'side-quests --stack', section: true },
  { pid: 441, name: 'stack', cmd: 'pip install jorge', section: true },
  { pid: 456, name: 'contact', cmd: 'contact --listen :25', section: true },
  { pid: 1337, name: 'bash', cmd: '-bash (tty1)' },
];
