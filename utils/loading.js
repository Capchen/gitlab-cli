import ora from "ora";
import chalk from "chalk";

const spinner = ora()
let lastMsg = null

// 开始
const startLoadingSpinner = (symbol = '', msg = '') => {
  if (!msg) {
    msg = symbol
    symbol = chalk.green('✔')
  }
  if (lastMsg) {
    spinner.stopAndPersist({
      symbol: lastMsg.symbol,
      text: lastMsg.text
    })
  }

  spinner.text = ' ' + msg
  lastMsg = {
    symbol: symbol + ' ',
    text: msg
  }
  spinner.start()
}

// 停止
const stopLoadingSpinner = (persist) => {
  if (lastMsg && persist !== false) {
    spinner.stopAndPersist({
      symbol: lastMsg.symbol,
      text: lastMsg.text
    })
  } else {
    spinner.stop()
  }
  lastMsg = null
}


export const loading = {
  start: startLoadingSpinner,
  stop: stopLoadingSpinner
}
