const { ipcRenderer } = require("electron");
const INTERVAL_TIME = 500;

document.addEventListener("DOMContentLoaded", () => {
  const memoryFree = document.getElementById("memory-free");
  const memoryTotal = document.getElementById("memory-total");
  const cpuInfo = document.getElementById("cpu-info");

  setInterval(() => {
    ipcRenderer.send("request-info");
  }, INTERVAL_TIME);

  ipcRenderer.on("sys-info", function (evt, { memory, cpu }) {
    memoryFree.innerText = `${convertKBToGB(memory.free)} GB | ${
      memory.ramFreePercent
    }%`;
    memoryTotal.innerText = `${convertKBToGB(memory.total)} GB`;
    cpuInfo.innerText = `${cpu.percentCPUUsage}%`;
  });
});

function convertKBToGB(inputKB) {
  return (inputKB / 1000000).toFixed(2);
}
