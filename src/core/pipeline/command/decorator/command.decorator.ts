export function Cmd(config: { cmd: string }) {
  return (ctor: Function) => {
    // console.log("cmd: " + config.cmd);
  }
}
